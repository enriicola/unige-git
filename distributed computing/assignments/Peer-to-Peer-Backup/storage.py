#!/usr/bin/env python

import argparse
import configparser
import logging
import os
import random
import csv

from humanfriendly import format_timespan, parse_size, parse_timespan
from discrete_event_sim import Simulation, Event
from dataclasses import dataclass
from random import expovariate
from typing import Optional, List
from my_plot_lib import my_plots

FAKE_BLOCK_ID = -1
def exp_rv(mean):
   """Return an exponential random variable with the given mean."""
   return expovariate(1 / mean)

class DataLost(Exception):
   """Not enough redundancy in the system, data is lost. We raise this exception to stop the simulation."""
   pass

class Backup(Simulation):
   """Backup simulation.
   """

   # type annotations for `Node` are strings here to allow a forward declaration: https://stackoverflow.com/questions/36193540/self-reference-or-forward-reference-of-type-annotations-in-python
   def __init__(self, nodes: List['Node']):
      super().__init__()
      self.nodes = nodes

      # track metrics over time to plot
      self.online_nodes_over_time = []
      self.local_storage_over_time_avg = []
      self.backed_up_blocks_over_time_avg = []
      self.fake_blocks_over_time = []

      for node in nodes:
         self.schedule(node.arrival_time, Online(node))
         self.schedule(node.arrival_time + exp_rv(node.average_lifetime), Fail(node))
         if node.evil:
            self.schedule(exp_rv(node.corruption_delay), DataCorrupted(node))

   def update_fake_blocks_metric(self):
      """Calculate and record the number of fake blocks at the current time."""
      fake_blocks_count = sum(block == FAKE_BLOCK_ID for node in self.nodes for block in node.local_blocks)
      years = 1
      if str(format_timespan(self.timestamp)).split(' ')[1] == 'years,':
         years = int(str(format_timespan(self.timestamp)).split(' ')[0])
      self.fake_blocks_over_time.append((years, fake_blocks_count))

   def schedule_transfer(self, uploader: 'Node', downloader: 'Node', block_id: int, restore: bool):
      """Helper function called by `Node.schedule_next_upload` and `Node.schedule_next_download`.

      If `restore` is true, we are restoring a block owned by the downloader, otherwise, we are saving one owned by
      the uploader.
      """

      # TODO try to recover corrupted data

      block_size = downloader.block_size if restore else uploader.block_size

      assert uploader.current_upload is None
      assert downloader.current_download is None

      speed = min(uploader.upload_speed, downloader.download_speed)
      delay = block_size / speed

      if restore:
         event = BlockRestoreComplete(uploader, downloader, block_id)
      else:
         event = BlockBackupComplete(uploader, downloader, block_id)
      self.schedule(delay, event)
      uploader.current_upload = downloader.current_download = event

      self.log_info(f"scheduled {event.__class__.__name__} from {uploader} to {downloader}" f" in {format_timespan(delay)}")

   def log_info(self, msg):
      """Override method to get human-friendly logging for time."""
      logging.info(f'{format_timespan(self.timestamp)}: {msg}')

@dataclass(eq=False)  # auto initialization from parameters below (won't consider two nodes with same state as equal)
class Node:
   """Class representing the configuration of a given node."""

   # using dataclass is (for our purposes) equivalent to having something like
   # def __init__(self, description, n, k, ...):
   #    self.n = n
   #    self.k = k
   #    ...
   #    self.__post_init__()  # if the method exists

   name: str
   n: int
   k: int

   data_size: int
   storage_size: int

   upload_speed: float 
   download_speed: float

   average_uptime: float
   average_downtime: float

   average_lifetime: float
   average_recover_time: float

   arrival_time: float

   corruption_delay: float 
   evil: bool = False  # evil node control, if True the node will not store data

   def __post_init__(self):
      """Compute other data dependent on config values and set up initial state."""
      
      self.online: bool = False

      self.failed: bool = False

      self.block_size: int = self.data_size // self.k if self.k > 0 else 0

      self.free_space: int = self.storage_size - self.block_size * self.n

      assert self.free_space >= 0, "Node without enough space to hold its own data"

      self.local_blocks: list[bool] = [True] * self.n

      self.backed_up_blocks: list[Optional[Node]] = [None] * self.n

      self.remote_blocks_held: dict[Node, int] = {}

      self.current_upload: Optional[TransferComplete] = None
      self.current_download: Optional[TransferComplete] = None

      self.corrupted_blocks = set()
      self.corrupted_blocks_over_time: List[tuple[float, int]] = []

   def schedule_fake_upload(self, sim: Backup):
      if not self.online:
         return
      for peer in sim.nodes:
         if peer is not self and peer.online and peer.current_download is None and peer.free_space >= self.block_size and peer.evil is not True:
            fake_block_id = FAKE_BLOCK_ID
            sim.schedule_transfer(self, peer, fake_block_id, restore=False)
            sim.log_info(f"Evil node {self} uploaded fake data to {peer}")
            return

   def find_block_to_back_up(self):
      """Returns the block id of a block that needs backing up, or None if there are none."""

      for block_id, (held_locally, peer) in enumerate(zip(self.local_blocks, self.backed_up_blocks)):
         if held_locally and peer is None:
            return block_id
      return None

   def schedule_next_upload(self, sim: Backup):
      """Schedule the next upload, if any."""

      assert self.online

      if self.current_upload is not None:
         return

        # first find if we have a backup that a remote node needs
      for peer, block_id in self.remote_blocks_held.items():
         if peer.online and peer.current_download is None and not peer.local_blocks[block_id]:
            sim.schedule_transfer(self, peer, block_id, restore=True)
            return
         
      block_id = self.find_block_to_back_up()
      if block_id is None:
         return
      remote_owners = set(node for node in self.backed_up_blocks if node is not None)
      for peer in sim.nodes:
         if (peer is not self and peer.online and peer not in remote_owners and peer.current_download is None and peer.free_space >= peer.block_size):
            sim.schedule_transfer(self, peer, block_id, restore=False)
            return

   def schedule_next_download(self, sim: Backup):
      """Schedule the next download, if any."""

      assert self.online

      sim.log_info(f"schedule_next_download on {self}")

      if self.current_download is not None:
         return

      for block_id, (held_locally, peer) in enumerate(zip(self.local_blocks, self.backed_up_blocks)):
         if not held_locally and peer is not None and peer.online and peer.current_upload is None:
            sim.schedule_transfer(peer, self, block_id, restore=True)
            return  # we are done in this case

      for peer in sim.nodes:
         if (peer is not self and peer.online and peer.current_upload is None and peer not in self.remote_blocks_held and self.free_space >= self.block_size):
            block_id = peer.find_block_to_back_up()
            if block_id is not None:
               sim.schedule_transfer(peer, self, block_id, restore=False)
               return

   def __hash__(self):
      """Function that allows us to have `Node`s as dictionary keys or set items.

      With this implementation, each node is only equal to itself.
      """
      return id(self)

   def __str__(self):
      """Function that will be called when converting this to a string (e.g., when logging or printing)."""

      return self.name

@dataclass
class NodeEvent(Event):
   """An event regarding a node. Carries the identifier, i.e., the node's index in `Backup.nodes_config`"""

   node: Node

   def process(self, sim: Simulation):
      """Must be implemented by subclasses."""
      raise NotImplementedError

class DataCorrupted(NodeEvent):
    def process(self, sim: Backup):
      node = self.node

      sim.schedule(exp_rv(node.corruption_delay), DataCorrupted(node))

      if node.failed:
         return
      
      try:
         block_id = random.choice([i for i in range(sum(node.local_blocks) + len(node.remote_blocks_held))])
      except IndexError:
         return

      if block_id < len(node.local_blocks):
         node.corrupted_blocks.add(block_id)
      else:
         idx = block_id - len(node.local_blocks)
         peer = list(node.remote_blocks_held.keys())[idx] 
         peer_block_id = node.remote_blocks_held[peer] 
         node.corrupted_blocks.add((peer, peer_block_id))

      years = 1
      if str(format_timespan(sim.timestamp)).split(' ')[1] == 'years,':
         years = int(str(format_timespan(sim.timestamp)).split(' ')[0])
      node.corrupted_blocks_over_time.append((years, len(node.corrupted_blocks)))

class Online(NodeEvent):
   """A node goes online."""

   def process(self, sim: Backup):
      if self.node.evil:
         sim.log_info(f"Evil node {self.node} goes online")

      node = self.node
      if node.online or node.failed:
         return
      node.online = True

      if node.evil:
         node.schedule_fake_upload(sim)

      node.schedule_next_upload(sim)
      node.schedule_next_download(sim)
      sim.schedule(exp_rv(node.average_uptime), Offline(node))

      # track metrics for online nodes over time to plot
      online_nodes = sum(node.online for node in sim.nodes)

      years = 1 # to avoid index out of range error
      if str(format_timespan(sim.timestamp)).split(' ')[1] == 'years,':
         # Calculate the number of years passed by dividing the total time in seconds by the number of seconds in a year
         years = int(str(format_timespan(sim.timestamp)).split(' ')[0]) #// 31536000 >:(
      sim.online_nodes_over_time.append((years, online_nodes))

class Recover(Online):
   """A node goes online after recovering from a failure."""
   def process(self, sim: Backup):
      if self.node.evil:
         sim.log_info(f"Evil node {self.node} recovers")

      node = self.node
      sim.log_info(f"{node} recovers")
      node.failed = False

      # Recalculate the free space after recovery
      node.free_space = node.storage_size - node.block_size * node.n

      super().process(sim)
      sim.schedule(exp_rv(node.average_lifetime), Fail(node))
      sim.update_fake_blocks_metric()

class Disconnection(NodeEvent):
   """Base class for both Offline and Fail, events that make a node disconnect."""

   def process(self, sim: Simulation):
      """Must be implemented by subclasses."""
      raise NotImplementedError

   def disconnect(self):
      node = self.node
      node.online = False

      current_upload, current_download = node.current_upload, node.current_download

      if current_upload is not None:
         current_upload.canceled = True
         current_upload.downloader.current_download = None
         node.current_upload = None
      if current_download is not None:
         current_download.canceled = True
         current_download.uploader.current_upload = None
         node.current_download = None

class Offline(Disconnection):
   """A node goes offline."""

   def process(self, sim: Backup):
      if self.node.evil:
         sim.log_info(f"Evil node {self.node} goes offline")

      node = self.node
      if node.failed or not node.online:
         return
      assert node.online
      self.disconnect()

      # schedule the next online event
      sim.schedule(exp_rv(self.node.average_downtime), Online(node))

class Fail(Disconnection):
   """A node fails and loses all local data."""

   def process(self, sim: Backup):
      sim.log_info(f"{self.node} fails")
      self.disconnect()
      node = self.node
      node.failed = True
      node.local_blocks = [False] * node.n  # lose all local data
      # lose all remote data
      for owner, block_id in node.remote_blocks_held.items():
         owner.backed_up_blocks[block_id] = None
         if owner.online and owner.current_upload is None:
            # this node may want to back up the missing block
            owner.schedule_next_upload(sim)
      node.remote_blocks_held.clear()
      # schedule the next online and recover events
      recover_time = exp_rv(node.average_recover_time)
      sim.schedule(recover_time, Recover(node))
      sim.update_fake_blocks_metric()

@dataclass
class TransferComplete(Event):
   """An upload is completed."""

   uploader: Node
   downloader: Node
   block_id: int
   canceled: bool = False

   def __post_init__(self):
      assert self.uploader is not self.downloader

   def process(self, sim: Backup):
      sim.log_info(f"{self.__class__.__name__} from {self.uploader} to {self.downloader}")
      if self.canceled:
         return  # this transfer was canceled, so ignore this event

      uploader, downloader = self.uploader, self.downloader

      if not (uploader.online): # TODO
         sim.log_info(f"Error: Uploader {uploader} is not online :(")
      if not (downloader.online): # TODO
         sim.log_info(f"Error: Downloader {downloader} is not online :(")

      assert uploader.online and downloader.online
      self.update_block_state(sim)
      uploader.current_upload = downloader.current_download = None
      uploader.schedule_next_upload(sim)
      downloader.schedule_next_download(sim)
      for node in [uploader, downloader]:
            sim.log_info(f"{node}: {sum(node.local_blocks)} local blocks, "
                   f"{sum(peer is not None for peer in node.backed_up_blocks)} backed up blocks, "
                   f"{len(node.remote_blocks_held)} remote blocks held")

   def update_block_state(self):
      """Needs to be specified by the subclasses, `BackupComplete` and `DownloadComplete`."""
      raise NotImplementedError

class BlockBackupComplete(TransferComplete):
   def update_block_state(self, sim: Backup):
      # if peer.evil:
      #    return # evil nodes don't store data >:(

      owner, peer = self.uploader, self.downloader
      if self.block_id == FAKE_BLOCK_ID:
         peer.local_blocks.append(FAKE_BLOCK_ID)
         sim.log_info(f"Evil node {peer} received fake data from {owner}")
      else:
         peer.free_space -= owner.block_size
         assert peer.free_space >= 0
         owner.backed_up_blocks[self.block_id] = peer
         peer.remote_blocks_held[owner] = self.block_id

      # calculate the metrics for local storage over time to plot
      is_clientserver = any(node.n == 0 for node in sim.nodes)

      # Find the client node in the simulation, if any
      client_node = next((node for node in sim.nodes if node.n != 0), None)

      # if there is the client-server configuration, we calculate only the local blocks of clients (since the server has no blocks)
      if is_clientserver and client_node:
         # Calculate the local storage over time for the client node
         backed_up_avg = sum(peer is not None for peer in client_node.backed_up_blocks)
      else:
         # Calculate the average local storage over time for all nodes
         backed_up_avg = sum(sum(peer is not None for peer in node.backed_up_blocks) for node in sim.nodes) / len(sim.nodes)

      fake_blocks = 0
      for node in sim.nodes:
         for block in node.local_blocks:
            if block == FAKE_BLOCK_ID:
               fake_blocks += 1

      years = 1
      # Check if the time in the simulation has reached years
      if str(format_timespan(sim.timestamp)).split(' ')[1] == 'years,':
         # Calculate the number of years passed by dividing the total time in seconds by the number of seconds in a year
         years = int(str(format_timespan(sim.timestamp)).split(' ')[0])

      # Append the local storage at the current time to the list of local storage over time
      sim.backed_up_blocks_over_time_avg.append((years, backed_up_avg))
      sim.update_fake_blocks_metric()

class BlockRestoreComplete(TransferComplete):
   def update_block_state(self, sim: Backup):
      owner = self.downloader
      owner.local_blocks[self.block_id] = True
      if sum(owner.local_blocks) == owner.k:
         owner.local_blocks = [True] * owner.n

      # calculate the metrics for local storage over time to plot
      is_clientserver = any(node.n == 0 for node in sim.nodes)
      # Find the client node in the simulation, if any
      client_node = next((node for node in sim.nodes if node.n != 0), None)

      # if there is the client-server configuration, we calculate only the local blocks of clients (since the server has no blocks)
      if is_clientserver and client_node:
         # Calculate the local storage over time for the client node
         avg_of_local_storage = sum(client_node.local_blocks)
      else:
         # Calculate the average local storage over time for all nodes
         # (be careful to how you count fake-blocks, for python everything that is not 1 is not counted (1=True, 0 and the rest of values=False))
         # avg_of_local_storage = sum(sum(node.local_blocks) for node in sim.nodes) / len(sim.nodes)
         avg_of_local_storage = sum(
            sum(block == True or block == FAKE_BLOCK_ID for block in node.local_blocks)
            for node in sim.nodes
         ) / len(sim.nodes)

      years = 1 # to avoid index out of range error
      # Check if the time in the simulation has reached years
      if str(format_timespan(sim.timestamp)).split(' ')[1] == 'years,':
         # Calculate the number of years passed by dividing the total time in seconds by the number of seconds in a year
         years = int(str(format_timespan(sim.timestamp)).split(' ')[0]) #// 31536000

      # Append the local storage at the current time to the list of local storage over time
      sim.local_storage_over_time_avg.append((years, avg_of_local_storage))

def count_lost_data(sim):
   lost = 0
   for nodo in sim.nodes:
      for block in nodo.local_blocks:
         if not block:
            lost += 1
   return lost

def count_fake_blocks(sim):
   fakes = 0
   for node in sim.nodes:
      for block in node.local_blocks:
         # print('block:', block)
         if block == FAKE_BLOCK_ID:
            fakes += 1
   return fakes

def get_total_blocks(sim):
   return sum(len(node.local_blocks) for node in sim.nodes)

def count_corrupted_blocks(sim):
   corrupted = 0
   for node in sim.nodes:
      if node.evil:
         corrupted += len(node.corrupted_blocks)
   return corrupted

def get_percentage_of_corrupted_blocks(sim):
   total_blocks = get_total_blocks(sim)
   if total_blocks == 0:
      return 0
   return count_corrupted_blocks(sim) / total_blocks * 100

def get_percentage_of_fake_blocks(sim):
   total_blocks = get_total_blocks(sim)
   if total_blocks == 0:
      return 0
   return count_fake_blocks(sim) / total_blocks * 100

def get_percentage_of_lost_data(sim):
   total_blocks = get_total_blocks(sim)
   if total_blocks == 0:
      return 0
   return count_lost_data(sim) / total_blocks * 100

def main():
   parser = argparse.ArgumentParser()
   parser.add_argument("config", help="configuration file")
   parser.add_argument("--max-t", default="100 years")
   parser.add_argument("--seed", help="random seed")
   parser.add_argument("--verbose", "-v", action='store_true')
   parser.add_argument("--e", default=0, type=int, choices=range(11), help="e for (e)xtension and for (e)vil nodes :D")
   args = parser.parse_args()

   if args.seed:
      random.seed(args.seed)  # set a seed to make experiments repeatable
   if args.verbose:
      logging.basicConfig(format='{levelname}:{message}', level=logging.INFO, style='{')  # output info on stdout

   parsing_functions = [
      ('n', int), ('k', int),
      ('data_size', parse_size), ('storage_size', parse_size),
      ('upload_speed', parse_size), ('download_speed', parse_size),
      ('average_uptime', parse_timespan), ('average_downtime', parse_timespan),
      ('average_lifetime', parse_timespan), ('average_recover_time', parse_timespan),
      ('arrival_time', parse_timespan), ('corruption_delay', parse_timespan)
   ]

   config = configparser.ConfigParser()
   config.read(args.config)
   nodes = []
   for node_class in config.sections():
      class_config = config[node_class]
      cfg = [parse(class_config[name]) for name, parse in parsing_functions]
      nodes.extend(Node(f"{node_class}-{i}", *cfg) for i in range(class_config.getint('number')))

   evil_nodes = args.e
   for node in random.sample(nodes, evil_nodes):
      node.evil = True

   evil_list = [node.name for node in nodes if node.evil]
   if evil_nodes > 0:
      print(f"Evil nodes: {evil_list}")

   sim = Backup(nodes)
   sim.run(parse_timespan(args.max_t))

   # Determine configuration type
   is_clientserver = any(node.n == 0 for node in sim.nodes)
   config_type = "client_server" if is_clientserver else "p2p"

   # Collect metrics
   lost_data_blocks = count_lost_data(sim)
   fake_data_blocks = count_fake_blocks(sim)
   corrupted_data_blocks = count_corrupted_blocks(sim)
   total_blocks = get_total_blocks(sim)
   percentage_lost_data = get_percentage_of_lost_data(sim)
   percentage_fake_data = get_percentage_of_fake_blocks(sim)
   percentage_corrupted_data = get_percentage_of_corrupted_blocks(sim)
   damaged_percentage = percentage_corrupted_data + percentage_fake_data

   # Print metrics
   print("Simulation completed")
   print(f"Lost data blocks: {lost_data_blocks}")
   print(f"Fake data blocks: {fake_data_blocks} out of {total_blocks} total blocks")
   print(f"Corrupted data blocks: {corrupted_data_blocks} out of {total_blocks} total blocks")
   print(f"Total blocks: {total_blocks}")
   print(f"Percentage of lost data: {percentage_lost_data}%")
   print(f"Percentage of fake data: {percentage_fake_data}%")
   print(f"Percentage of corrupted data: {percentage_corrupted_data}%")
   print(f"Evil nodes damaged (fake or corrupted) {damaged_percentage}% of the total blocks")

   # Save metrics to CSV
   csv_filename = f"results.csv"
   file_exists = os.path.isfile(csv_filename)
   file_is_empty = False
   if file_exists:
        with open(csv_filename, 'r', newline='') as file:
            reader = csv.reader(file)
            file_is_empty = len(list(reader)) == 0
   with open(csv_filename, mode='a', newline='') as file:
      writer = csv.writer(file)
      if not file_exists or file_is_empty:
         writer.writerow([
               "cfg", "Lost Data Blocks", "Fake Data Blocks", "Corrupted Data Blocks",
               "Total Blocks", "Percentage Lost Data", "Percentage Fake Data",
               "Percentage Corrupted Data", "Damaged Percentage", "Evil Nodes"
         ])
      writer.writerow([
         config_type, lost_data_blocks, fake_data_blocks, corrupted_data_blocks,
         total_blocks, percentage_lost_data, percentage_fake_data,
         percentage_corrupted_data, damaged_percentage, evil_nodes
      ])

   my_plots(sim, name=args.config, evilness=args.e)

if __name__ == '__main__':
   main()