
# Install NetworkX (see documentation at: https://networkx.org/documentation/stable/index.html)
# Select a graph (see for example https://networkx.org/documentation/stable/auto_examples/index.html#graph)
# Compute and print basic graph properties (e.g., number of nodes, number of links, diameter, adjacency list)
# Draw the graph
# Plot the degree distribution

import networkx as nx
import matplotlib.pyplot as plt

# create a graph from a txt file
G = nx.read_edgelist("../facebook_combined.txt", create_using=nx.Graph(), nodetype=int)

#print number of nodes
print("Number of nodes: ", G.number_of_nodes())

#print number of links
print("Number of links: ", G.number_of_edges())

#print diameter
print("Diameter: ", nx.diameter(G))

#print adjacency list
print("Adjacency list: ", G.adj)

#print avg degree
print("Average degree: ", sum(dict(G.degree()).values())/G.number_of_nodes())

#print max degree
print("Max degree: ", max(dict(G.degree()).values()))

#draw and save the graph
nx.draw(G, with_labels=True)
# plt.show()
plt.savefig("graph.png")

#compute and plot degree distribution
degree_sequence = sorted([d for n, d in G.degree()], reverse=True) # degree sequence
degreeCount = dict()
for degree in degree_sequence:
    degreeCount[degree] = degreeCount.get(degree, 0) + 1
deg, cnt = zip(*degreeCount.items())
plt.bar(deg, cnt, color='b')
plt.title("Degree Histogram")
plt.ylabel("Count")
plt.xlabel("Degree")
# plt.show()
plt.savefig("degree_distribution.png")