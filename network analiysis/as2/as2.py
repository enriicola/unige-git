import os
import argparse
import random
import networkx as nx
import numpy as np
import matplotlib.pyplot as plt
import operator
from sklearn.metrics.pairwise import cosine_similarity

POLBLOGS_PATH = "../polblogs/out.dimacs10-polblogs"

def generate_network(model: str, n: int, **kwargs) -> nx.Graph:
    if model == 'ER':
        p = kwargs.get('p', 0.1)
        return nx.erdos_renyi_graph(n, p)
    elif model == 'WS':
        k = kwargs.get('k', 4)
        p = kwargs.get('p', 0.1)
        return nx.watts_strogatz_graph(n, k, p)
    elif model == 'BA':
        m = kwargs.get('m', 2)
        return nx.barabasi_albert_graph(n, m)
    elif model == 'polblogs' or model == 'polblogs-attack':
        G_full = nx.read_edgelist(POLBLOGS_PATH, create_using=nx.Graph(), nodetype=int, comments='%')
        largest_cc = max(nx.connected_components(G_full), key=len)
        return G_full.subgraph(largest_cc).copy()
    else:
        raise ValueError(f"Unknown model: {model}")

def initialize_messages(G: nx.Graph, dim: int, malicious_nodes: list, noise_scale=0.5):
    original_label = ('original', None)
    tampered_labels = {m: ('tampered', m) for m in malicious_nodes}
    messages = {node: None for node in G.nodes()}
    return original_label, tampered_labels, messages

def run_threshold_diffusion(
        G: nx.Graph,
        thresholds: dict,
        seeds: list,
        malicious_nodes: set,
        dim=100,
        max_steps=50
    ) -> dict:
    original_label = ('original', None)
    tampered_labels = {m: ('tampered', m) for m in malicious_nodes}
    messages = {node: None for node in G.nodes()}

    # Seeds adopt original message
    for s in seeds:
        if s in G:
            messages[s] = original_label

    forwarded = set(seeds)

    for t in range(max_steps):
        newly_forwarded = set()
        for node in G.nodes():
            if messages[node] is not None:
                continue  # Already adopted

            neighbors = list(G.neighbors(node))
            count = sum((1 for u in neighbors if u in forwarded))
            if len(neighbors) == 0:
                continue
            if (count / len(neighbors)) >= thresholds.get(node, 0.0):
                newly_forwarded.add(node)

                # Decide which message to adopt
                if node in malicious_nodes:
                    messages[node] = tampered_labels[node]
                else:
                    neighbor_labels = [messages[u] for u in neighbors if messages[u] is not None]
                    if any(label[0] == 'tampered' for label in neighbor_labels):
                        for label in neighbor_labels:
                            if label[0] == 'tampered':
                                messages[node] = label
                                break
                    else:
                        messages[node] = original_label

        if not newly_forwarded:
            break
        forwarded.update(newly_forwarded)

    return messages

def plot_diffusion(G: nx.Graph, messages: dict, original_label, tampered_labels, seeds: list, outpath: str):
    os.makedirs(os.path.dirname(outpath), exist_ok=True)

    no_message_nodes = []
    original_nodes = []
    tampered_nodes = []

    for node, label in messages.items():
        if label is None:
            no_message_nodes.append(node)
        elif label == original_label:
            original_nodes.append(node)
        elif label[0] == 'tampered':
            tampered_nodes.append(node)
        else:
            no_message_nodes.append(node)

    # sizes = {n: len(list(G.neighbors(n))) * 50 for n in G.nodes()}
    fixed_size = 50
    
    pos = nx.spring_layout(G, seed=42)

    plt.figure(figsize=(6, 6))
    nx.draw_networkx_edges(G, pos, alpha=0.3, width=1)

    # Draw nodes
    if no_message_nodes:
        nx.draw_networkx_nodes(G, pos, nodelist=no_message_nodes, node_size=fixed_size, node_color='gray', alpha=0.7, label='No Message')
    if original_nodes:
        nx.draw_networkx_nodes(G, pos, nodelist=original_nodes, node_size=fixed_size, node_color='skyblue', alpha=0.9, label='Original Message')
    if tampered_nodes:
        nx.draw_networkx_nodes(G, pos, nodelist=tampered_nodes, node_size=fixed_size, node_color='darkorange', alpha=0.9, label='Tampered Message')

    # Highlight special nodes
    if seeds:
        nx.draw_networkx_nodes(G, pos, nodelist=seeds, node_size=fixed_size,
                               node_color='none', edgecolors='k', linewidths=2, label='Seed Node')
    malicious_list = list(tampered_labels.keys())
    if malicious_list:
        nx.draw_networkx_nodes(G, pos, nodelist=malicious_list, node_size=fixed_size,
                               node_color='red', edgecolors='red', linewidths=2, label='Malicious Node')

    plt.axis('off')
    plt.tight_layout()

    from matplotlib.patches import Patch
    legend_elements = []
    if no_message_nodes:
        legend_elements.append(Patch(facecolor='gray', edgecolor='gray', alpha=0.7, label='No Message'))
    if original_nodes:
        legend_elements.append(Patch(facecolor='skyblue', edgecolor='skyblue', alpha=0.9, label='Original Message'))
    if tampered_nodes:
        legend_elements.append(Patch(facecolor='darkorange', edgecolor='darkorange', alpha=0.9, label='Tampered Message'))
    if seeds:
        legend_elements.append(Patch(facecolor='white', edgecolor='black', linewidth=2, label='Seed Node'))
    if malicious_list:
        legend_elements.append(Patch(facecolor='red', edgecolor='red', linewidth=2, label='Malicious Node'))

    if G.number_of_nodes() < 1000: 
        plt.legend(handles=legend_elements, loc='best', bbox_to_anchor=(0.0, 1.0), fontsize=8)
    plt.savefig(outpath, dpi=300)
    plt.close()

def compute_similarity_matrix(messages: dict) -> tuple[list, np.ndarray]:
    nodes = sorted(messages.keys())
    first = next(m for m in messages.values() if m is not None)
    dim = 100  # fixed dimension
    zero = np.zeros(dim, dtype=float)
    vecs = []
    for n in nodes:
        if messages[n] == ('original', None):
            vec = np.ones(dim)
        elif messages[n] is not None and messages[n][0] == 'tampered':
            base = np.ones(dim)
            noise = np.random.normal(scale=0.5, size=dim)
            vec = base + noise
        else:
            vec = np.zeros(dim)
        vecs.append(vec)
    sim = cosine_similarity(np.vstack(vecs))
    return nodes, sim

def plot_heatmap(sim: np.ndarray, title: str, outdir: str):
    os.makedirs(outdir, exist_ok=True)
    plt.figure(figsize=(6, 6))
    im = plt.imshow(sim, cmap='viridis', vmin=0, vmax=1)
    plt.colorbar(im, shrink=0.8)
    # plt.title("Cosine Similarity of Final Messages")
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(os.path.join(outdir, f"{title}.png"), dpi=300)
    plt.close()

def main():
    parser = argparse.ArgumentParser(description="Simulate message diffusion on networks.")
    parser.add_argument('--models', nargs='+', default=['ER', 'WS', 'BA'], help='Network models to use')
    parser.add_argument('--n', type=int, default=100, help='Number of nodes')
    parser.add_argument('--dim', type=int, default=100, help='Message dimension')
    parser.add_argument('--p', type=float, default=0.05, help='ER probability')
    parser.add_argument('--k', type=int, default=4, help='WS mean degree')
    parser.add_argument('--m', type=int, default=2, help='BA mean degree')
    parser.add_argument('--seeds', nargs='+', type=float, default=[0.01, 0.05, 0.1], help='Fractions of nodes to use as initial seeds (e.g. 0.05 for 5%)')
    parser.add_argument('--malicious', nargs='+', type=float, default=[0.01, 0.05, 0.1], help='Fractions of nodes to use as malicious (e.g. 0.05 for 5%)')
    parser.add_argument('--theta', nargs='+', type=float, default=[0.1, 0.3, 0.5], help='Threshold values')
    parser.add_argument('--outdir', type=str, default='results', help='Output directory')
    args = parser.parse_args()

    for model in args.models:
        if model in ['polblogs', 'polblogs-attack']:
            G = generate_network(model, args.n)
        else:
            G = generate_network(model, args.n, p=args.p, k=args.k, m=args.m)
        
        N = G.number_of_nodes()
        print(f"\n\n\nGenerated {model} network with {N} nodes")
        
        for seed_count in args.seeds:
            for mal_count in args.malicious:
                for theta in args.theta:
                    print(f"\nRunning {model} | seeds={seed_count*100:.1f}% of {N} | mal={mal_count*100:.1f}% of {N} | θ={theta}")

                    # convert *fractions* to counts
                    num_malicious = max(1, round(mal_count * N))
                    num_seeds = max(1, round(seed_count * N))
                    thresholds   = {n: theta for n in G.nodes()}
                    seeds        = random.sample(list(G.nodes()), num_seeds)
                    
                    # Select malicious nodes based on model
                    if model == 'polblogs-attack':
                        degs = G.degree()
                        malicious_nodes = [n for n, _ in sorted(degs, key=operator.itemgetter(1), reverse=True)[:num_malicious]]
                    else:
                        malicious_nodes = random.sample(list(G.nodes()), num_malicious)

                    messages = run_threshold_diffusion(G, thresholds, seeds, malicious_nodes, args.dim)
                    title = f"{model}_init{int(seed_count*100)}_mal{int(mal_count*100)}_θ{theta}"
                                        
                    visdir = os.path.join(args.outdir, 'nets', model)
                    vispath = os.path.join(visdir, f"{title}.png")

                    plot_diffusion(G, messages, ('original', None), {m: ('tampered', m) for m in malicious_nodes}, seeds, vispath)

                    nodes, sim = compute_similarity_matrix(messages)
                    
                    heatdir = os.path.join(args.outdir, 'heatmaps', model)

                    plot_heatmap(sim, title, heatdir)

                    total = len(G.nodes())
                    received = sum(1 for v in messages.values() if v is not None)
                    corrupted = sum(1 for v in messages.values() if v is not None and v[0] == 'tampered')
                    print(f"{model}| seeds={num_seeds}| mal={num_malicious}| θ={theta} -> reached {received}/{total}, corrupted {corrupted}/{received if received > 0 else 0}")

if __name__ == '__main__':
    main()
