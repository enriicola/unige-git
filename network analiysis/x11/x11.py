# Part 1
# One of the most popular network used as a benchmark for community detection algorithms is the Zachary's karate club network.
# Use this network to find the communities with the Girvan-Newman algorithm (community.girvan_newman(G)) and then compute the modularity of each partition  (community.modularity(G))
# Once you have a partition, it is possible to associate different colors to the nodes of the network, depending on the partition they belong to.
# The function draw_networkx() and other drawing functions have several optional parameters. We have already seen that it is possible to fix nodes positions so that different instances of the same graph share the same layout.
# It is also possible to color nodes (and edges) according to a given rule, for example the node degree. It is necessary to define a color map that maps each node with a given color.
# From the online documentation of draw_networkx()
# node_color: color or array of colors (default=’#1f78b4’) Can be a single color or a sequence of colors with the same length as nodelist. Color can be string or rgb (or rgba) tuple of floats from 0-1. If numeric values are specified they will be mapped to colors using the cmap and vmin,vmax parameters. See matplotlib.scatter for more details.
# Try to color the nodes of your network according to a give partition.
# Finally, change the network with a random graph or any other type of graph and see what happens.
# [optional] Another interesting thing is drawing the dendogram resulting from the execution of the Girvan-Newman algorithm. I have not tried yet, but if you want...
 
# Part 2
# The previous algorithm does not scale with large networks since it computes edge betweenness at each iteration.
# Take a large graph and compute its partitions using the code developed for the Part 1. How long does it take?
# Then use the Louvain algorithm. NetworkX does not provide an implementation of the Louvain algorithm, but you need to install the right package. Have a look at the community API page form more information.
# How much faster is Louvain with respect to Girvan-Newman?

import networkx as nx
import matplotlib.pyplot as plt
from networkx.algorithms.community import girvan_newman
from networkx.algorithms.community.quality import modularity
import time

try:
    import community.community_louvain as community_louvain
except ImportError:
    import community as community_louvain

# -------------------------
# Part 1: Girvan–Newman until max modularity on Karate Club
# -------------------------
G = nx.karate_club_graph()
pos = nx.spring_layout(G, seed=42)

comp_gen = girvan_newman(G)
best_mod = -1.0
best_communities = None
level = 0

print("Searching for best Girvan–Newman partition on Karate Club:")

for communities in comp_gen:
    level += 1
    m = modularity(G, communities)
    print(f" Level {level} ({len(communities)} communities): modularity = {m:.4f}")
    
    if m > best_mod:
        best_mod = m
        best_communities = communities
    else:
        break

print(f"\nBest modularity = {best_mod:.4f} at partition with {len(best_communities)} communities.\n")

# Visualize best partition
comm_index = {node: idx for idx, comm in enumerate(best_communities) for node in comm}
plt.figure(figsize=(6, 4))
nx.draw(
    G, pos,
    node_color=[comm_index[n] for n in G.nodes()],
    with_labels=True, cmap=plt.cm.tab10
)
plt.title(f"Best GN Partition ({len(best_communities)} comms, modularity={best_mod:.4f})")
# plt.show()
plt.savefig("karate_club_best_partition.png", bbox_inches='tight')

# -------------------------
# Part 2: Scalability & Louvain
# -------------------------
G_big = nx.erdos_renyi_graph(1000, 0.01)

# Time one split of Girvan–Newman
comp_gen_big = girvan_newman(G_big)
start = time.time()
_ = next(comp_gen_big)
gn_time = time.time() - start

# Time Louvain
start = time.time()
partition = community_louvain.best_partition(G_big)
louv_time = time.time() - start

# Convert Louvain partition to communities list
louv_comms = {}
for node, comm in partition.items():
    louv_comms.setdefault(comm, set()).add(node)

louv_mod = modularity(G_big, louv_comms.values())

print("Performance on G(n=1000, p=0.01):")
print(f" Girvan–Newman (first split) time: {gn_time:.4f} s")
print(f" Louvain time: {louv_time:.4f} s    modularity: {louv_mod:.4f}")
print(f"Speedup: {gn_time / louv_time:.2f}x")
# Visualize Louvain partition
louv_index = {node: idx for idx, comm in enumerate(louv_comms.values()) for node in comm}
plt.figure(figsize=(6, 4))
nx.draw(
    G_big, pos=nx.spring_layout(G_big, seed=42),
    node_color=[louv_index[n] for n in G_big.nodes()],
    with_labels=False, cmap=plt.cm.tab10
)
plt.title(f"Louvain Partition ({len(louv_comms)} comms, modularity={louv_mod:.4f})")
# plt.show()
plt.savefig("big_graph_louvain_partition.png", bbox_inches='tight')