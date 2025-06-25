# Take a directed graph of your choice, compute PageRank and HITS, plot the results, and then print the top-10 nodes for each metrics. For the implementation of the algorithms, see pagerank() and hits().
# Notice that both PageRank and HITS were defined for directed graphs. However you can use these algorithms also for undirected graphs: each edge is replaced by two edges with a direction.
# The scores for hubs and authorities are different when you have a directed network while, in the undirected case, you will get two identical ranking vectors. PageRank, on the other hand, does not consider outgoing links.

import networkx as nx
import matplotlib.pyplot as plt

# 1) Create or load a directed graph.
# Here, as an example, we generate a random directed graph with 100 nodes and edge probability 0.05.
# You may replace this with any DiGraph you like (e.g., loading from a file).
n = 100
p = 0.05
G = nx.gnp_random_graph(n, p, directed=True)

# 2) Compute PageRank
pr = nx.pagerank(G, alpha=0.85)

# 3) Compute HITS (authority and hub scores)
auth, hub = nx.hits(G, max_iter=100, tol=1e-6)

# 4) Sort and print top 10 nodes for each metric
def top_k(d, k=10):
    return sorted(d.items(), key=lambda x: x[1], reverse=True)[:k]

print("Top 10 by PageRank:")
for node, score in top_k(pr):
    print(f"  {node}: {score:.4f}")

print("\nTop 10 by Authority (HITS):")
for node, score in top_k(auth):
    print(f"  {node}: {score:.4f}")

print("\nTop 10 by Hub (HITS):")
for node, score in top_k(hub):
    print(f"  {node}: {score:.4f}")

# 5) Plot the distributions and highlight the top 10 for each metric
#    We will plot the top 20 for clarity.

def plot_top_scores(score_dict, title, subplot_pos):
    items = sorted(score_dict.items(), key=lambda x: x[1], reverse=True)
    top_items = items[:20]
    nodes = [str(node) for node, _ in top_items]
    scores = [score for _, score in top_items]
    plt.subplot(subplot_pos)
    plt.bar(nodes, scores)
    plt.xticks(rotation=90, fontsize=6)
    plt.title(title)
    plt.ylabel("Score")

plt.figure(figsize=(12, 8))

plot_top_scores(pr,    "Top 20 by PageRank",     311)
plot_top_scores(auth,  "Top 20 by Authority",    312)
plot_top_scores(hub,   "Top 20 by Hub",          313)

plt.tight_layout()
# plt.show()
plt.savefig("pagerank_hits_top_scores.png")
