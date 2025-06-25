# The friendship paradox is the phenomenon first observed by the sociologist Scott L. Feld in 1991 that on average, an individual's friends have more friends than that individual. It can be explained as a form of sampling bias in which people with more friends are more likely to be in one's own friend group. In other words, one is less likely to be friends with someone who has very few friends. In contradiction to this, most people believe that they have more friends than their friends have.
# Source: https://en.wikipedia.org/wiki/Friendship_paradox

# Write a Python script that, given a network, computes the degree of each node (function degree()) and the average degree of its neighbors (function all_neighbors() ) and check the results you obtain.

import networkx as nx
def degree(G):
    """Compute the degree of each node in the graph G."""
    return {node: G.degree(node) for node in G.nodes()}
 
def all_neighbors(G):
   """Compute the average degree of each node's neighbors in the graph G."""
   avg_degrees = {}
   for node in G.nodes():
      neighbors = list(nx.all_neighbors(G, node))
      if neighbors:
         avg_degree = sum(G.degree(neighbor) for neighbor in neighbors) / len(neighbors)
         avg_degrees[node] = avg_degree
      else:
         avg_degrees[node] = 0  # No neighbors, average degree is 0
   return avg_degrees

def check_friendship_paradox(G):
    """Check the friendship paradox in the graph G."""
    node_degrees = degree(G)
    neighbor_avg_degrees = all_neighbors(G)
    
    paradox_nodes = []
    for node in G.nodes():
        if neighbor_avg_degrees[node] > node_degrees[node]:
            paradox_nodes.append(node)
    return paradox_nodes

# Example usage
G = nx.Graph()
G.add_edges_from([(1, 2), (1, 3), (2, 4), (3, 4), (4, 5)])
print("Degrees:", degree(G))
print("Average neighbor degrees:", all_neighbors(G))
print("Friendship paradox nodes:", check_friendship_paradox(G))

# Example usage with a larger graph
G_large = nx.erdos_renyi_graph(100, 0.05)
print("\n\n\nLarge Graph Example")
print("Degrees in large graph:", degree(G_large))
print("Average neighbor degrees in large graph:", all_neighbors(G_large))
print("Friendship paradox nodes in large graph:", check_friendship_paradox(G_large))
