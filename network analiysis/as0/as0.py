# Files: 
#     meta.dimacs10-polblogs -- Metadata about the network 
#     out.dimacs10-polblogs -- The adjacency matrix of the network in whitespace-separated values format, with one edge per line
#       The meaning of the columns in out.dimacs10-polblogs are: 
#         First column: ID of from node 
#         Second column: ID of to node
#         Third column (if present): weight or multiplicity of edge
#         Fourth column (if present):  timestamp of edges Unix time


# Once built the graph, you should compute the metrics we discussed in class and draw some conclusions on the type of the network you have chosen. Examples of questions you can answer are the following:
# 1. Does the graph have the same characteristics of a random or a power-law network?
# 2. Which are the most important nodes, with respect to a given centrality measure?
# 3. Are the paths short with respect to the size of the network?
# 4. Is the network dense?
# 5. Is the network assortative?
# 6. And so on


import networkx as nx
import numpy as np
import matplotlib.pyplot as plt


def plot():
   # Plot degree distribution
   degree_sequence = sorted([d for n, d in G.degree()], reverse=True)
   degree_count = dict()
   for degree in degree_sequence:
      degree_count[degree] = degree_count.get(degree, 0) + 1
   deg, cnt = zip(*degree_count.items())
   plt.figure(figsize=(10, 6))
   plt.bar(deg, cnt, color='b')
   plt.title("Degree Histogram")
   plt.ylabel("Count")
   plt.xlabel("Degree")
   plt.xscale('log')
   plt.yscale('log')
   plt.grid(True)
   plt.savefig("degree_distribution.png", dpi=300)

   # save the graph as a PNG file
   plt.figure(figsize=(10, 6))
   nx.draw(G, with_labels=True, node_size=50, font_size=8)
   plt.savefig("polblogs_graph.png", dpi=300)

G = nx.read_edgelist('../polblogs/out.dimacs10-polblogs', nodetype=int, comments='%', create_using=nx.Graph())

# Print basic graph properties
print("***Basic graph properties:***\n")
print("Number of nodes:", G.number_of_nodes())
print("Number of edges:", G.number_of_edges())

# Get the largest connected component
largest_cc = max(nx.connected_components(G), key=len)
largest_cc_subgraph = G.subgraph(largest_cc)
print("Size of largest connected component:", len(largest_cc))
print("Diameter of largest connected component:", nx.diameter(largest_cc_subgraph))

# Continue with rest of the analysis using the largest connected component
print("Average degree:", sum(dict(G.degree()).values()) / G.number_of_nodes())
print("Max degree:", max(dict(G.degree()).values()))

# print betweenness centrality
betweenness_centrality = nx.betweenness_centrality(G)
print("Betweenness centrality (top 5 nodes):")
top_betweenness = sorted(betweenness_centrality.items(), key=lambda x: x[1], reverse=True)[:5]
for node, centrality in top_betweenness:
    print(f"Node {node}: {centrality:.4f}")
    
# print closeness centrality
closeness_centrality = nx.closeness_centrality(G)
print("Closeness centrality (top 5 nodes):")
top_closeness = sorted(closeness_centrality.items(), key=lambda x: x[1], reverse=True)[:5]
for node, centrality in top_closeness:
    print(f"Node {node}: {centrality:.4f}")

# print degree centrality
degree_centrality = nx.degree_centrality(G)
print("Degree centrality (top 5 nodes):")
top_degree = sorted(degree_centrality.items(), key=lambda x: x[1], reverse=True)[:5]
for node, centrality in top_degree:
    print(f"Node {node}: {centrality:.4f}")

print("\n\n***Advanced graph properties:***\n")

# Calculate network metrics
avg_clustering = nx.average_clustering(G)
density = nx.density(G)
n_components = nx.number_connected_components(G)
assortativity = nx.degree_assortativity_coefficient(G)

print(f"Number of connected components: {n_components}")
print(f"Network density: {density:.4f}")
print(f"Average clustering coefficient: {avg_clustering:.4f}")
print(f"Expected clustering for random graph: {density:.4f}")
print(f"Assortativity coefficient: {assortativity:.4f}")

# Corrected power law analysis
degrees = [d for n, d in G.degree()]
degree_counts = np.bincount(degrees)
degrees_range = np.arange(len(degree_counts))
mask = degree_counts > 0

# Use only non-zero values for log-log plot
log_degrees = np.log10(degrees_range[mask])
log_counts = np.log10(degree_counts[mask])

# Linear regression to find power law exponent
slope, _ = np.polyfit(log_degrees[1:], log_counts[1:], 1)
print(f"Power law exponent (gamma): {-slope:.4f}")

print("\nConclusion:")
if -slope > 2 and -slope < 3 and avg_clustering > density:
    print("1) The network shows characteristics of a scale-free (power-law) network:")
    print(f"- Power law exponent: {-slope:.4f} (between 2 and 3)")
    print(f"- Higher clustering ({avg_clustering:.4f}) than expected in random graphs ({density:.4f})")
    print(f"- {'Assortative' if assortativity > 0 else 'Disassortative'} mixing (coefficient: {assortativity:.4f})")
else:
    print("1) The network shows characteristics more similar to a random network")

print("\n2) Most important nodes by different centrality measures:")
print("By betweenness centrality:")
print("- These nodes are important for information flow as they act as bridges between different parts of the network")
for node, centrality in top_betweenness:
   print(f"- Node {node} with centrality {centrality:.4f}")

print("\nBy closeness centrality:")
print("- These nodes can efficiently spread information to all other nodes")
for node, centrality in top_closeness:
   print(f"- Node {node} with centrality {centrality:.4f}")

print("\nBy degree centrality:")
print("- These are the most connected nodes, having the most direct influences")
for node, centrality in top_degree:
   print(f"- Node {node} with centrality {centrality:.4f}")
   
# 3. Are the paths short with respect to the size of the network?
avg_path_length = nx.average_shortest_path_length(largest_cc_subgraph)
network_size = G.number_of_nodes()
theoretical_path_length = np.log(network_size)

print("\n3) Path length analysis:")
print(f"Average shortest path length: {avg_path_length:.4f}")
print(f"Network size (n): {network_size}")
print(f"Theoretical random network path length (log n): {theoretical_path_length:.4f}")
if avg_path_length < theoretical_path_length * 2:
   print("The network shows small-world properties with relatively short paths")
else:
   print("The paths are longer than expected for a small-world network")
   

# 4. Is the network dense?
density = nx.density(G)
print(f"Network density: {density:.4f}")
if density > 0.5:
   print("4) The network is dense.")
else:
   print("4) The network is sparse.")

# 5. Is the network assortative?
assortativity = nx.degree_assortativity_coefficient(G)
print(f"Assortativity coefficient: {assortativity:.4f}")
if assortativity > 0:
   print("5) The network is assortative.")
else:
   print("5) The network is disassortative.")
   
plot()