import csv
import matplotlib.pyplot as plt

def read_execution_times(csv_filename):
   client_server_data = {}
   p2p_data = {}
   
   with open(csv_filename, mode='r') as file:
      reader = csv.DictReader(file)
      for row in reader:
         cfg = row['cfg']
         evil_nodes = int(row['Evil Nodes'])
         seconds = float(row['Seconds'])
         
         if cfg == 'client_server':
               client_server_data[evil_nodes] = seconds
         elif cfg == 'p2p':
               p2p_data[evil_nodes] = seconds
   
   return client_server_data, p2p_data


def plot_execution_times(client_server_data, p2p_data):
   client_server_x, client_server_y = zip(*sorted(client_server_data.items()))
   p2p_x, p2p_y = zip(*sorted(p2p_data.items()))
   
   plt.figure(figsize=(10, 6))
   plt.plot(client_server_x, client_server_y, marker='o', label='Client-Server')
   plt.plot(p2p_x, p2p_y, marker='o', label='P2P')
   
   plt.xlabel('Number of Evil Nodes')
   plt.ylabel('Execution Time (Seconds)')
   plt.title('Execution Time vs Number of Evil Nodes')
   plt.legend()
   plt.grid(True)
   # plt.show()
   plt.savefig("images/exec_times.png")


def main():
   client_server_data, p2p_data = read_execution_times("times.csv")
   plot_execution_times(client_server_data, p2p_data)

if __name__ == '__main__':
   main()