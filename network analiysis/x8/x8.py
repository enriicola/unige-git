# Consider the following directed network with three web pages and compute its PageRank.
# A -> B
# A -> C
# B -> A
# C -> A
# C -> B

# 1. First by hand (compute the Google Matrix and see the toy examples in the slides on PageRank).
# 2. After some steps by hand, create the corresponding Directed Graph with NetworkX and compute the PageRank to see the final result (stationary distribution).
# - pagerank()
# - google_matrix()

import numpy as np
import networkx as nx

G = nx.DiGraph()
edges = [('A', 'B'), ('A', 'C'), ('B', 'A'), ('C', 'A'), ('C', 'B')] 
G.add_edges_from(edges)

pagerank = nx.pagerank(G, alpha=0.85)
print("PageRank values:", pagerank)
  
google_matrix = nx.google_matrix(G, alpha=0.85)
print("\nGoogle Matrix:\n", google_matrix)