# In this third exercise we learn how to work with syntectic models.
# We start by generating different Erdős-Rényi random graphs G(N,p) for different values of the parameters, e.g., by varying the number of vertices N or the probability p. 
# For each graph, compute some of the metrics we have already computed in previous exercises and check if it is connected. If the answer is yes, compute also its diameter.
# Plot the degree distribution.

import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
def generate_random_graphs(num_graphs, num_vertices, probabilities):
   graphs = []
   for p in probabilities:
      for _ in range(num_graphs):
         G = nx.erdos_renyi_graph(num_vertices, p)
         graphs.append(G)
   # print(f"Total number of graphs generated: {len(graphs)}")
   return graphs

def compute_metrics(graphs):
    metrics = []
    for G in graphs:
        if nx.is_connected(G):
            diameter = nx.diameter(G)
        else:
            diameter = None
        
        metrics.append({
            'num_nodes': G.number_of_nodes(),
            'num_edges': G.number_of_edges(),
            'is_connected': nx.is_connected(G),
            'diameter': diameter,
            'average_degree': np.mean([d for n, d in G.degree()])
        })
    return metrics

def plot_degree_distribution(graphs):
   plt.figure(figsize=(10, 6))
   for G in graphs:
      degree_sequence = sorted([d for n, d in G.degree()], reverse=True)
      plt.hist(degree_sequence, bins=range(max(degree_sequence) + 2), alpha=0.5, label=f'N={G.number_of_nodes()}, p={G.number_of_edges()/G.number_of_nodes()}')
   
   plt.title('Degree Distribution of Random Graphs')
   plt.xlabel('Degree')
   plt.ylabel('Frequency')
   plt.legend()
   # plt.show()
   plt.savefig("degree_distribution.png")

def main():
   num_graphs = 5
   num_vertices = 20
   probabilities = [0.1, 0.2, 0.3, 0.4, 0.5]

   # Generate random graphs
   graphs = generate_random_graphs(num_graphs, num_vertices, probabilities)

   # Compute metrics
   metrics = compute_metrics(graphs)
   
   for i, metric in enumerate(metrics):
      print(f"Graph {i+1}: {metric}")

   # Plot degree distribution
   plot_degree_distribution(graphs)

if __name__ == "__main__":
   main()