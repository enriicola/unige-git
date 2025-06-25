# In this exercise you can compute the Jaccard coefficient on a (small) network of your choice to see which node pairs are more likely to form a link in the future. See the built-in NetworkX function jaccard_coefficient(). 

# The Jaccard coefficient captures the idea that common neighbors indicate possible future connections, and it is easy to compute even for large graphs. However, it may not perform well in sparse graphs where the Adamic-Adar index might be more effective (https://en.wikipedia.org/wiki/Adamic-Adar_index).

# Also the Adamic-Adar index is implemented in NetworkX and you can compute it for the network of your choice. The Adamic-Adar index is similar to the Jaccard coefficient but gives more weight to common neighbors with fewer connections.

# The idea is that rare connections (low-degree nodes) are more informative than common ones. Neighbors with fewer connections are more significant in predicting a future link than high-degree nodes. If two nodes share a rare neighbor, they are more likely to connect than if they share a popular one.

# For the formula of the index, you can refer to the NetworkX page at adamic_adar_index().

# The Adamic-Adar index is more effective than Jaccard in social networks where hubs can distort predictions.

# Notice that the Jaccard coefficient ranges in [0,1] while the Adamic-Adar index has a value equal to 0 when two nodes have no common neighbors, but does not have a strict upper limit (you will see values larger than 1 in the results).

import networkx as nx

# 1) Create a test graph (Zachary's Karate Club)
G = nx.karate_club_graph()

# 2) Compute Jaccard Coefficient for all non-existent edges
jaccard_scores = list(nx.jaccard_coefficient(G))
# Sort by score descending
jaccard_top10 = sorted(jaccard_scores, key=lambda x: x[2], reverse=True)[:10]

print("Top 10 link predictions by Jaccard Coefficient:")
for u, v, score in jaccard_top10:
    print(f"  ({u}, {v}): {score:.4f}")

# 3) Compute Adamic–Adar Index for all non-existent edges
aa_scores = list(nx.adamic_adar_index(G))
# Sort by score descending
aa_top10 = sorted(aa_scores, key=lambda x: x[2], reverse=True)[:10]

print("\nTop 10 link predictions by Adamic-Adar Index:")
for u, v, score in aa_top10:
    print(f"  ({u}, {v}): {score:.4f}")
    

# 4) draw and plot the graph with predicted links
import matplotlib.pyplot as plt
def draw_graph_with_predictions(G, predictions, title):
    pos = nx.spring_layout(G)
    plt.figure(figsize=(10, 8))
    
    # Draw the original graph
    nx.draw(G, pos, with_labels=True, node_color='lightblue', edge_color='gray', node_size=500, font_size=10)
    
    # Highlight predicted links
    for u, v in predictions:
        plt.plot([pos[u][0], pos[v][0]], [pos[u][1], pos[v][1]], 'r--', alpha=0.5)
    
    plt.title(title)
   #  plt.show()
    plt.savefig(f"{title.replace(' ', '_').lower()}.png")
# Draw the graph with Jaccard predictions
draw_graph_with_predictions(G, [(u, v) for u, v, _ in jaccard_top10], "Jaccard Coefficient Predictions")
# Draw the graph with Adamic-Adar predictions
draw_graph_with_predictions(G, [(u, v) for u, v, _ in aa_top10], "Adamic-Adar Index Predictions")
