import csv
import matplotlib.pyplot as plt
import numpy as np

def read_results_csv(csv_filename):
   client_server_data = {}
   p2p_data = {}

   with open(csv_filename, mode='r') as file:
      reader = csv.DictReader(file)
      for row in reader:
         cfg = row['cfg']
         evil_nodes = int(row['Evil Nodes'])
         lost_data_blocks = int(row['Lost Data Blocks'])
         fake_data_blocks = int(row['Fake Data Blocks'])
         corrupted_data_blocks = int(row['Corrupted Data Blocks'])
         total_blocks = int(row['Total Blocks'])
         percentage_lost_data = float(row['Percentage Lost Data'])
         percentage_fake_data = float(row['Percentage Fake Data'])
         percentage_corrupted_data = float(row['Percentage Corrupted Data'])
         damaged_percentage = float(row['Damaged Percentage'])

         if cfg == 'client_server':
               if evil_nodes not in client_server_data:
                  client_server_data[evil_nodes] = {
                     'Lost Data Blocks': [],
                     'Fake Data Blocks': [],
                     'Corrupted Data Blocks': [],
                     'Total Blocks': [],
                     'Percentage Lost Data': [],
                     'Percentage Fake Data': [],
                     'Percentage Corrupted Data': [],
                     'Damaged Percentage': []
                  }
               client_server_data[evil_nodes]['Lost Data Blocks'].append(lost_data_blocks)
               client_server_data[evil_nodes]['Fake Data Blocks'].append(fake_data_blocks)
               client_server_data[evil_nodes]['Corrupted Data Blocks'].append(corrupted_data_blocks)
               client_server_data[evil_nodes]['Total Blocks'].append(total_blocks)
               client_server_data[evil_nodes]['Percentage Lost Data'].append(percentage_lost_data)
               client_server_data[evil_nodes]['Percentage Fake Data'].append(percentage_fake_data)
               client_server_data[evil_nodes]['Percentage Corrupted Data'].append(percentage_corrupted_data)
               client_server_data[evil_nodes]['Damaged Percentage'].append(damaged_percentage)

         elif cfg == 'p2p':
               if evil_nodes not in p2p_data:
                  p2p_data[evil_nodes] = {
                     'Lost Data Blocks': [],
                     'Fake Data Blocks': [],
                     'Corrupted Data Blocks': [],
                     'Total Blocks': [],
                     'Percentage Lost Data': [],
                     'Percentage Fake Data': [],
                     'Percentage Corrupted Data': [],
                     'Damaged Percentage': []
                  }
               p2p_data[evil_nodes]['Lost Data Blocks'].append(lost_data_blocks)
               p2p_data[evil_nodes]['Fake Data Blocks'].append(fake_data_blocks)
               p2p_data[evil_nodes]['Corrupted Data Blocks'].append(corrupted_data_blocks)
               p2p_data[evil_nodes]['Total Blocks'].append(total_blocks)
               p2p_data[evil_nodes]['Percentage Lost Data'].append(percentage_lost_data)
               p2p_data[evil_nodes]['Percentage Fake Data'].append(percentage_fake_data)
               p2p_data[evil_nodes]['Percentage Corrupted Data'].append(percentage_corrupted_data)
               p2p_data[evil_nodes]['Damaged Percentage'].append(damaged_percentage)

   return client_server_data, p2p_data

def calculate_averages(data):
   averaged_data = {}
   for evil_nodes, metrics in data.items():
      averaged_data[evil_nodes] = {
         'Lost Data Blocks': np.mean(metrics['Lost Data Blocks']),
         'Fake Data Blocks': np.mean(metrics['Fake Data Blocks']),
         'Corrupted Data Blocks': np.mean(metrics['Corrupted Data Blocks']),
         'Total Blocks': np.mean(metrics['Total Blocks']),
         'Percentage Lost Data': np.mean(metrics['Percentage Lost Data']),
         'Percentage Fake Data': np.mean(metrics['Percentage Fake Data']),
         'Percentage Corrupted Data': np.mean(metrics['Percentage Corrupted Data']),
         'Damaged Percentage': np.mean(metrics['Damaged Percentage'])
      }
   return averaged_data

def plot_averaged_results(client_server_data, p2p_data):
   client_server_x = sorted(client_server_data.keys())
   client_server_lost = [client_server_data[evil_nodes]['Lost Data Blocks'] for evil_nodes in client_server_x]
   client_server_fake = [client_server_data[evil_nodes]['Fake Data Blocks'] for evil_nodes in client_server_x]
   client_server_corrupted = [client_server_data[evil_nodes]['Corrupted Data Blocks'] for evil_nodes in client_server_x]
   client_server_damaged = [client_server_data[evil_nodes]['Damaged Percentage'] for evil_nodes in client_server_x]

   p2p_x = sorted(p2p_data.keys())
   p2p_lost = [p2p_data[evil_nodes]['Lost Data Blocks'] for evil_nodes in p2p_x]
   p2p_fake = [p2p_data[evil_nodes]['Fake Data Blocks'] for evil_nodes in p2p_x]
   p2p_corrupted = [p2p_data[evil_nodes]['Corrupted Data Blocks'] for evil_nodes in p2p_x]
   p2p_damaged = [p2p_data[evil_nodes]['Damaged Percentage'] for evil_nodes in p2p_x]

   # Create subplots
   fig, axes = plt.subplots(2, 2, figsize=(15, 10))
   fig.suptitle('Simulation Results: Client-Server vs P2P')

   # Plot 1: Lost Data Blocks
   axes[0, 0].plot(client_server_x, client_server_lost, marker='o', label='Client-Server')
   axes[0, 0].plot(p2p_x, p2p_lost, marker='o', label='P2P')
   axes[0, 0].set_title('Lost Data Blocks vs Evil Nodes')
   axes[0, 0].set_xlabel('Number of Evil Nodes')
   axes[0, 0].set_ylabel('Lost Data Blocks')
   axes[0, 0].legend()
   axes[0, 0].grid(True)

   # Plot 2: Fake Data Blocks
   axes[0, 1].plot(client_server_x, client_server_fake, marker='o', label='Client-Server')
   axes[0, 1].plot(p2p_x, p2p_fake, marker='o', label='P2P')
   axes[0, 1].set_title('Fake Data Blocks vs Evil Nodes')
   axes[0, 1].set_xlabel('Number of Evil Nodes')
   axes[0, 1].set_ylabel('Fake Data Blocks')
   axes[0, 1].legend()
   axes[0, 1].grid(True)

   # Plot 3: Corrupted Data Blocks
   axes[1, 0].plot(client_server_x, client_server_corrupted, marker='o', label='Client-Server')
   axes[1, 0].plot(p2p_x, p2p_corrupted, marker='o', label='P2P')
   axes[1, 0].set_title('Corrupted Data Blocks vs Evil Nodes')
   axes[1, 0].set_xlabel('Number of Evil Nodes')
   axes[1, 0].set_ylabel('Corrupted Data Blocks')
   axes[1, 0].legend()
   axes[1, 0].grid(True)

   # Plot 4: Damaged Percentage
   axes[1, 1].plot(client_server_x, client_server_damaged, marker='o', label='Client-Server')
   axes[1, 1].plot(p2p_x, p2p_damaged, marker='o', label='P2P')
   axes[1, 1].set_title('Damaged Percentage vs Evil Nodes')
   axes[1, 1].set_xlabel('Number of Evil Nodes')
   axes[1, 1].set_ylabel('Damaged Percentage')
   axes[1, 1].legend()
   axes[1, 1].grid(True)

   plt.tight_layout(rect=[0, 0, 1, 0.96])
   # plt.show()
   plt.savefig('images/csv_results.png')

def main():
   csv_filename = 'results.csv'
   client_server_data, p2p_data = read_results_csv(csv_filename)

   client_server_averages = calculate_averages(client_server_data)
   p2p_averages = calculate_averages(p2p_data)

   plot_averaged_results(client_server_averages, p2p_averages)

if __name__ == '__main__':
   main()