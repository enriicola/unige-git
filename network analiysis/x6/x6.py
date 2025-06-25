import networkx as nx
import matplotlib.pyplot as plt
import numpy as np

def analyze_configuration_model(deg_seq, name):
    """
    Build and analyze a graph using the configuration model.
    """
    print(f"=== Configuration Model: {name} ===")
    
    # 1) Creo il MultiGraph (pseudografo) direttamente dalla sequenza di gradi
    G_orig = nx.configuration_model(deg_seq)  # restituisce un MultiGraph con parallel edges e self-loop
    
    num_nodes = len(deg_seq)
    num_edges_multi = G_orig.number_of_edges()
    num_selfloops = nx.number_of_selfloops(G_orig)
    has_multi_edges = any(G_orig.number_of_edges(u, v) > 1 for u, v in G_orig.edges())
    
    print(f"Number of nodes: {num_nodes}")
    print(f"Number of edges (including multi-edges): {num_edges_multi}")
    print(f"Number of self-loops: {num_selfloops}")
    print(f"Contains multi-edges: {has_multi_edges}")
    
    # 2) Rimuovo tutti i self-loop
    G_no_selfloops = G_orig.copy()
    G_no_selfloops.remove_edges_from(list(nx.selfloop_edges(G_no_selfloops)))
    num_edges_no_selfloops = G_no_selfloops.number_of_edges()
    print(f"Edges after removing self-loops: {num_edges_no_selfloops}")
    
    # 3) Converto in grafo semplice (elimina parallel edges)
    G_simple = nx.Graph(G_no_selfloops)
    num_edges_simple = G_simple.number_of_edges()
    print(f"Edges after removing multi-edges (simple graph): {num_edges_simple}")
    
    # 4) Analizzo il grafo semplice
    connected = nx.is_connected(G_simple)
    num_components = nx.number_connected_components(G_simple)
    print(f"Is simple graph connected? {connected}")
    print(f"Number of connected components: {num_components}")
    
    transitivity = nx.transitivity(G_simple)
    avg_clustering = nx.average_clustering(G_simple)
    print(f"Global transitivity: {transitivity:.4f}")
    print(f"Average clustering coefficient: {avg_clustering:.4f}")
    
    if has_multi_edges:
        G_simple.remove_edges_from(list(G_simple.edges()))
        G_simple.add_edges_from(set(G_no_selfloops.edges()))
    
    # Diametro (del componente principale se non connesso)
    if connected:
        diameter = nx.diameter(G_simple)
    else:
        largest_cc = max(nx.connected_components(G_simple), key=len)
        subgraph = G_simple.subgraph(largest_cc)
        diameter = nx.diameter(subgraph)
        print("Graph is disconnected; computed diameter of largest component.")
    print(f"Diameter: {diameter}")

    
    # 5) Plotto la degree distribution
    degrees = [d for _, d in G_simple.degree()]
    plt.figure()
    plt.hist(degrees, bins=range(min(degrees), max(degrees) + 2), edgecolor='black', align='left')
    plt.title(f"Degree Distribution (Configuration Model: {name})")
    plt.xlabel("Degree")
    plt.ylabel("Frequency")
    plt.grid(axis='y', linestyle='--', linewidth=0.5)
    # plt.show()
    plt.savefig(f"degree_distribution_{name}.png")
    plt.close()
    print("\n")


def analyze_barabasi_albert(n, m):
    """
    Build and analyze a Barabási–Albert model graph.
    """
    name = f"BA Graph (n={n}, m={m})"
    print(f"=== {name} ===")
    
    G_ba = nx.barabasi_albert_graph(n, m)
    
    # 1) Trovo i primi 5 hub
    degree_sequence = sorted(G_ba.degree(), key=lambda x: x[1], reverse=True)
    top_hubs = degree_sequence[:5]
    print("Top 5 hubs (node, degree):")
    for node, deg in top_hubs:
        print(f"  Node {node}: Degree {deg}")
    
    # 2) Calcolo clustering e transitività
    transitivity = nx.transitivity(G_ba)
    avg_clustering = nx.average_clustering(G_ba)
    print(f"Global transitivity: {transitivity:.4f}")
    print(f"Average clustering coefficient: {avg_clustering:.4f}")
    
    # 3) Diametro (BA genera grafi connessi se m >= 1)
    if nx.is_connected(G_ba):
        diameter = nx.diameter(G_ba)
    else:
        largest_cc = max(nx.connected_components(G_ba), key=len)
        subgraph = G_ba.subgraph(largest_cc)
        diameter = nx.diameter(subgraph)
        print("Graph is disconnected; computed diameter of largest component.")
    print(f"Diameter: {diameter}")
    
    # 4) Degree distribution
    degrees = [d for _, d in G_ba.degree()]
    plt.figure()
    plt.hist(degrees, bins=range(min(degrees), max(degrees) + 2), edgecolor='black', align='left')
    plt.title(f"Degree Distribution: {name}")
    plt.xlabel("Degree")
    plt.ylabel("Frequency")
    plt.grid(axis='y', linestyle='--', linewidth=0.5)
    # plt.show()
    plt.savefig(f"degree_distribution_{name}.png")
    plt.close()
    
    # 5) Log-Log degree distribution
    unique_degs, counts = np.unique(degrees, return_counts=True)
    plt.figure()
    plt.loglog(unique_degs, counts, marker='o', linestyle='None')
    plt.title(f"Log-Log Degree Distribution: {name}")
    plt.xlabel("Degree (k)")
    plt.ylabel("Frequency")
    plt.grid(True, which="both", ls="--", linewidth=0.5)
    # plt.show()
    plt.savefig(f"loglog_degree_distribution_{name}.png")
    plt.close()
    print("\n")


# -------------------------
# 1. Configuration Model
# -------------------------

# Esempio di sequenze di gradi (devono avere somma pari)
deg_seq1 = [3, 3, 2, 2, 2, 2, 1, 1, 1, 1]  
analyze_configuration_model(deg_seq1, "Seq1: [3,3,2,2,2,2,1,1,1,1]")

deg_seq2 = [4, 4, 4, 4, 2, 2, 2, 2, 2, 2]
analyze_configuration_model(deg_seq2, "Seq2: [4,4,4,4,2,2,2,2,2,2]")

# -------------------------
# 2. Barabási–Albert Model
# -------------------------

analyze_barabasi_albert(n=100, m=2)
analyze_barabasi_albert(n=100, m=5)
