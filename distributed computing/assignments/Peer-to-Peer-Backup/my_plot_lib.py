from humanfriendly import format_timespan
import matplotlib.pyplot as plt
import os
from PIL import Image

FAKE_BLOCK_ID = -1
X_LABEL = 'Years'
DESTINATION = 'images/'

def merge_plots(input_files, destination, evilness):
   input_files.sort()  # Sort the input files to ensure correct order
   images = [Image.open(file) for file in input_files]
   widths, heights = zip(*(i.size for i in images))
   total_height = sum(heights)
   max_width = max(widths)
   new_image = Image.new('RGB', (max_width, total_height))
   y_offset = 0
   for img in images:
      new_image.paste(img, (0, y_offset))
      y_offset += img.size[1]
   new_image.save(destination + 'results.png')
   for img in input_files:
      os.remove(img)

def my_plots(sim, name, evilness):
   def plot_fake_blocks_over_time(sim, title, ylabel):
      """Plot the number of fake blocks over time."""
      if not sim.fake_blocks_over_time:
         return
      years, fake_blocks_counts = zip(*sim.fake_blocks_over_time)
      plt.plot(years, fake_blocks_counts, drawstyle='steps-post')
      plt.xlabel(X_LABEL)
      plt.ylabel(ylabel)
      plt.title(title)
      plt.xlim(left=1)
      plt.savefig(f'{DESTINATION}{name.split(".")[0]}/fake_blocks_over_time.png')
      plt.close()
      
   def plot_corruption(sim, title, ylabel):
      # keep track of the number of corrupted blocks over time for each node
      corrupted_blocks_over_time_list = [[] for _ in range(len(sim.nodes))]
      for i, node in enumerate(sim.nodes):
         if node.corrupted_blocks_over_time:
            for years, blocks_corrupted in node.corrupted_blocks_over_time:
               while len(corrupted_blocks_over_time_list[i]) < years:
                  corrupted_blocks_over_time_list[i].append([])
               corrupted_blocks_over_time_list[i][years-1].append(blocks_corrupted)

      # plot avg of corrupted blocks over time
      for i, node in enumerate(sim.nodes):
         avg_corrupted_blocks = [sum(blocks) / len(blocks) if blocks else 0 for blocks in corrupted_blocks_over_time_list[i]]
         if node.n == 0:
            plt.plot(range(1, len(avg_corrupted_blocks)+1), avg_corrupted_blocks, drawstyle='steps-post', label=f'Node {node.name}')
         else:
            plt.plot(range(1, len(avg_corrupted_blocks)+1), avg_corrupted_blocks, drawstyle='steps-post', label=f'Node {node.name} ({node.n})')
            
      plt.xlabel(X_LABEL)
      plt.ylabel(ylabel)
      plt.legend()
      plt.xlim(left=1)
      plt.title(title)
      # plt.show()
      plt.savefig(f'{DESTINATION}/{name.split(".")[0]}/{title[0]}.png')
      plt.close()

   # ancillary fn to plot multiple averages over time
   def plot_avg_over_time(metrics_over_time, title, ylabel):
      if not metrics_over_time:
         return

      # accumulator = [[] for wildcard range(len(metrics_over_time[0]))]
      metrics_acc = []
      
      for years, metrics in metrics_over_time:
         while len(metrics_acc) < years:
            metrics_acc.append([])

         metrics_acc[years-1].append(metrics)

      avg = [sum(metrics) / len(metrics) if metrics else 0 for metrics in metrics_acc] # avg over years

      plt.plot(range(1, len(avg)+1), avg, drawstyle='steps-post')

      plt.xlabel(X_LABEL)
      plt.ylabel(ylabel)
      plt.title(title)
      plt.xlim(left=1) # start from 1
      # plt.show()
      plt.savefig(f'{DESTINATION}{name.split(".")[0]}/{title[0]}.png')
      plt.close()

   # print(sim.online_nodes_over_time)
   # with open('/Users/enrico/Desktop/dc/Peer-to-Peer Backup/pippo.txt', 'w') as file:
   #    file.write(str(sim.online_nodes_over_time))

   plot_avg_over_time(sim.online_nodes_over_time, '# online nodes on avg', '# online nodes over time on avg')
   plot_avg_over_time(sim.local_storage_over_time_avg, 'Local blocks on avg', 'Local blocks over time on avg')
   plot_avg_over_time(sim.backed_up_blocks_over_time_avg, 'Backed up blocks on avg', 'Backed up blocks over time on avg')
   if evilness:
      plot_corruption(sim, 'Corrupted blocks for '+str(evilness)+' evil nodes', 'Avg corrupted blocks')
      plot_fake_blocks_over_time(sim, 'Fake blocks over time for '+str(evilness)+' evil nodes', 'Number of fake blocks')
   
   images_list = []
   for filename in os.listdir(DESTINATION + name.split(".")[0]):
      if not filename.__contains__('results'):
         images_list.append(os.path.join(DESTINATION + name.split(".")[0], filename))
   merge_plots(images_list, DESTINATION + name.split(".")[0] + '/', evilness)