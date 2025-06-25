# With this second exercise we continue using the graph library (Networkx or others).
   # 1. Take the graph used for the first exercise.
   # 2. Compute the betweenness centrality and the closeness centrality for the nodes.
   # 3. For each metric, print the top-10 nodes with their associated centrality values.
# Repeat steps 1-5, reading a graph from an external file (see for example http://networkrepository.com)

import networkx as nx
import matplotlib.pyplot as plt

G = nx.read_edgelist("../facebook_combined.txt", create_using=nx.Graph(), nodetype=int)
print("graph loaded from file")

# Compute betweenness centrality
betweenness_centrality = nx.betweenness_centrality(G)
print("betweenness centrality computed")

# Compute closeness centrality
closeness_centrality = nx.closeness_centrality(G)

# Get top-10 nodes by betweenness centrality
top_betweenness = sorted(betweenness_centrality.items(), key=lambda x: x[1], reverse=True)[:10]

# Get top-10 nodes by closeness centrality
top_closeness = sorted(closeness_centrality.items(), key=lambda x: x[1], reverse=True)[:10]

# Print top-10 nodes with their betweenness centrality values
print("Top 10 nodes by Betweenness Centrality:")
for node, centrality in top_betweenness:
   print(f"Node: {node}, Betweenness Centrality: {centrality:.4f}")

# Print top-10 nodes with their closeness centrality values
print("\nTop 10 nodes by Closeness Centrality:")
for node, centrality in top_closeness:
   print(f"Node: {node}, Closeness Centrality: {centrality:.4f}")

# ex2 ends here

# Draw the graph
nx.draw(G, with_labels=True)
plt.title("Graph Visualization")
plt.savefig("graph_with_centrality.png")

# Plot the degree distribution
degree_sequence = sorted([d for n, d in G.degree()], reverse=True)  # degree sequence
degreeCount = dict()
for degree in degree_sequence:
   degreeCount[degree] = degreeCount.get(degree, 0) + 1
deg, cnt = zip(*degreeCount.items())
plt.bar(deg, cnt, color='b')
plt.title("Degree Histogram")
plt.ylabel("Count")
plt.xlabel("Degree")
plt.savefig("degree_distribution_with_centrality.png")

plt.close('all')  # Close all plots to free up memory