import sys
import argparse
import networkx as nx
import matplotlib.pyplot as plt

WS = "Watts-Strogatz"
ER = "Erdős-Rényi"

COLOR_WS = "skyblue"
COLOR_ER = "lightcoral"

def parse_arguments() -> argparse.Namespace:
    """
    Parse command line arguments for the number of nodes, k nearest neighbors, and rewiring probability.

    Returns:
        Parsed arguments containing N, k, and p.
    """
    parser = argparse.ArgumentParser(description=f'Generate and compare {WS} and {ER} graphs.')
    parser.add_argument('N', type=int, help='Number of nodes')
    parser.add_argument('k', type=int, help='Each node is joined with its k nearest neighbors in a ring topology')
    parser.add_argument('p', type=float, help='Probability of rewiring each edge')
    args = parser.parse_args()

    if not 0 <= args.p <= 1:
        print("p must be between 0 and 1", file=sys.stderr)
        exit(1)

    return args

def plot_graphs(G_WS: nx.Graph, G_ER: nx.Graph) -> None:
    """
    Plot the Watts-Strogatz and Erdős-Rényi graphs side by side.

    Args:
        G_WS: Watts-Strogatz graph.
        G_ER: Erdős-Rényi graph.
    """
    def plot_graph(G: nx.Graph, axis: plt.Axes, title: str, node_color: str) -> None:
        nx.draw_circular(G, ax=axis, node_size=20, node_color=node_color, with_labels=False)
        axis.set_title(title)

    fig, axs = plt.subplots(1, 2, figsize=(15, 10))
    plot_graph(G_WS, axs[0], WS, COLOR_WS)
    plot_graph(G_ER, axs[1], ER, COLOR_ER)

def print_graph_statistics(G_WS: nx.Graph, G_ER: nx.Graph) -> None:
    """
    Print statistics for the Watts-Strogatz and Erdős-Rényi graphs.

    Args:
        G_WS: Watts-Strogatz graph.
        G_ER: Erdős-Rényi graph.
    """
    N = G_WS.order()
    assert N == G_ER.order(), "Number of nodes must be the same"

    E = G_WS.size()
    assert E == G_ER.size(), "Number of edges must be the same"

    def degrees(G: nx.Graph) -> list[int]:
        return [d for n, d in G.degree()]

    degrees_WS, degrees_ER = degrees(G_WS), degrees(G_ER)

    print(f"---------------------------------------")
    print(f"{WS} vs {ER}")
    print(f"---------------------------------------")
    print(f"Number of nodes       : {N}")
    print(f"Number of edges       : {E}")
    print(f"---------------------------------------")
    print(f"Min degree WS         : {min(degrees_WS)}")
    print(f"Min degree G(N,M)     : {min(degrees_ER)}")
    print(f"---------------------------------------")
    print(f"Max degree WS         : {max(degrees_WS)}")
    print(f"Max degree G(N,M)     : {max(degrees_ER)}")
    print(f"---------------------------------------")
    print(f"Avg clustering WS     : {nx.average_clustering(G_WS)}")
    print(f"Avg clustering G(N,M) : {nx.average_clustering(G_ER)}")
    print(f"---------------------------------------")

    def print_diameter(G: nx.Graph, name: str) -> None:
        if nx.is_connected(G):
            print(f"Diameter {name:6}       : {nx.diameter(G)}")
        else:
            print(f"{name:6} is not connected")

    print_diameter(G_WS, "WS")
    print_diameter(G_ER, "G(N,M)")

def plot_degree_histogram(G_WS: nx.Graph, G_ER: nx.Graph, N: int) -> None:
    """
    Plot the degree histogram for the Watts-Strogatz and Erdős-Rényi graphs.

    Args:
        G_WS: Watts-Strogatz graph.
        G_ER: Erdős-Rényi graph.
        N: Number of nodes.
    """
    plt.figure()

    def degree_p(G: nx.Graph) -> list[float]:
        N = G.order()
        return [x / N for x in nx.degree_histogram(G)]

    deg_hist_WS = degree_p(G_WS)
    deg_hist_ER = degree_p(G_ER)

    def plot_hist(deg_hist: list[float], color: str, label: str, alpha: float) -> None:
        plt.bar(range(len(deg_hist)), deg_hist, color=color, alpha=alpha, label=label)
    
    plot_hist(deg_hist_WS, COLOR_WS, WS, 0.9)
    plot_hist(deg_hist_ER, COLOR_ER, ER, 0.5)
    plt.xlabel("Degree")
    plt.ylabel("p(k)")
    plt.legend()
    plt.grid()
    plt.show()


if __name__ == "__main__":
    args = parse_arguments()

    G_WS = nx.watts_strogatz_graph(args.N, args.k, args.p)
    G_ER = nx.gnm_random_graph(args.N, args.N * args.k // 2)

    print_graph_statistics(G_WS, G_ER)
    plot_graphs(G_WS, G_ER)
    plot_degree_histogram(G_WS, G_ER, args.N)
    plt.show()
