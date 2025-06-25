import networkx as nx
import matplotlib.pyplot as plt

def analyze_graph(G, name):
    """
    Computes and prints basic graph metrics, and plots the degree distribution.
    """
    print(f"--- Analysis for {name} ---")
    
    # Check connectivity for diameter calculation
    if nx.is_connected(G):
        diameter = nx.diameter(G)
    else:
        # Compute diameter of the largest connected component
        largest_cc = max(nx.connected_components(G), key=len)
        subgraph = G.subgraph(largest_cc)
        diameter = nx.diameter(subgraph)
        print("Graph is disconnected; computed diameter of largest connected component.")

    num_triangles = sum(nx.triangles(G).values()) // 3  # Each triangle is counted thrice
    transitivity = nx.transitivity(G)
    avg_clustering = nx.average_clustering(G)
    clustering_coeffs = nx.clustering(G)

    print(f"Number of nodes (N): {G.number_of_nodes()}")
    print(f"Number of edges (M): {G.number_of_edges()}")
    print(f"Diameter: {diameter}")
    print(f"Number of triangles: {num_triangles}")
    print(f"Transitivity (global clustering): {transitivity:.4f}")
    print(f"Average clustering coefficient: {avg_clustering:.4f}")
    print("Clustering coefficient per node (showing first 10 nodes):")
    for node, coeff in list(clustering_coeffs.items())[:10]:
        print(f"  Node {node}: {coeff:.4f}")
    
    # Plot degree distribution
    degrees = [d for _, d in G.degree()]
    plt.figure()
    plt.hist(degrees, bins=range(min(degrees), max(degrees) + 2), edgecolor='black', align='left')
    plt.title(f"Degree Distribution: {name}")
    plt.xlabel("Degree")
    plt.ylabel("Frequency")
    plt.grid(axis='y', linestyle='--', linewidth=0.5)
   #  plt.show()
    plt.savefig(f"degree_distribution_{name.replace(' ', '_').lower()}.png")
    print("\n")

# -------------------------
# 1. Regular Graphs
# -------------------------

# 1.1 Complete Graph (Clique) with 10 nodes
G_complete = nx.complete_graph(10)
analyze_graph(G_complete, "Complete Graph (10 nodes)")

# 1.2 Triangular Lattice Graph (5 x 5)
G_triangular = nx.triangular_lattice_graph(5, 5)
analyze_graph(G_triangular, "Triangular Lattice (5x5)")

# -------------------------
# 2. Watts-Strogatz Model
# -------------------------

# Parameters for the WS model
N = 100   # number of nodes
k = 4     # each node is connected to k nearest neighbors in ring topology
p = 0.1   # rewiring probability

G_ws = nx.watts_strogatz_graph(N, k, p)

# Draw the WS graph with circular layout to highlight ring structure
plt.figure(figsize=(6, 6))
pos = nx.circular_layout(G_ws)
nx.draw(G_ws, pos, node_size=50, with_labels=False)
plt.title(f"Watts-Strogatz Graph (N={N}, k={k}, p={p}) with Circular Layout")
# plt.show()
plt.savefig(f"ws_graph_n{N}_k{k}_p{p}.png")

# Analyze WS graph
analyze_graph(G_ws, f"Watts-Strogatz Graph (N={N}, k={k}, p={p})")

# -------------------------
# 3. Compare WS vs ER
# -------------------------

# Use the same number of nodes and edges from the WS graph to define the ER graph
N_compare = N
M_compare = G_ws.number_of_edges()

# Generate ER graph with the same N and M
G_er = nx.gnm_random_graph(N_compare, M_compare)

# Analyze ER graph
analyze_graph(G_er, f"Erdős-Rényi Graph G(N={N_compare}, M={M_compare})")

# Plot comparison of degree distributions side by side
fig, axes = plt.subplots(1, 2, figsize=(12, 5), sharey=True)

# WS degree distribution
degrees_ws = [d for _, d in G_ws.degree()]
axes[0].hist(degrees_ws, bins=range(min(degrees_ws), max(degrees_ws) + 2), edgecolor='black', align='left')
axes[0].set_title("WS Degree Distribution")
axes[0].set_xlabel("Degree")
axes[0].set_ylabel("Frequency")
axes[0].grid(axis='y', linestyle='--', linewidth=0.5)

# ER degree distribution
degrees_er = [d for _, d in G_er.degree()]
axes[1].hist(degrees_er, bins=range(min(degrees_er), max(degrees_er) + 2), edgecolor='black', align='left')
axes[1].set_title("ER Degree Distribution")
axes[1].set_xlabel("Degree")
axes[1].grid(axis='y', linestyle='--', linewidth=0.5)

plt.suptitle(f"Degree Distribution Comparison: WS vs ER (N={N_compare}, M={M_compare})")
plt.tight_layout(rect=[0, 0.03, 1, 0.95])
# plt.show()
plt.savefig(f"degree_distribution_comparison_ws_er_n{N_compare}_m{M_compare}.png")