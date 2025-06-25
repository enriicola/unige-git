import networkx as nx
import random
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd  # table generation
from networkx.algorithms import community


POLBLOGS_PATH = "../polblogs/out.dimacs10-polblogs"
IMAGES_PATH = "results"
os.makedirs(IMAGES_PATH, exist_ok=True)


def giant_component_size(G):
    if len(G) == 0:
        return 0
    return len(max(nx.connected_components(G), key=len))


def critical_threshold(G):
    degrees = np.array([d for n, d in G.degree()])
    k_mean = degrees.mean()
    k2_mean = (degrees ** 2).mean()
    return 1 - 1/(k2_mean/k_mean - 1)


def attack_random(G, remove_fraction=0.01, steps=100):
    nodes = list(G.nodes())
    random.shuffle(nodes)
    batch_size = max(1, int(remove_fraction * len(nodes)))
    sizes, Gc = [], G.copy()
    for i in range(steps):
        rem = nodes[i*batch_size:(i+1)*batch_size]
        if not rem:
            break
        Gc.remove_nodes_from(rem)
        sizes.append(giant_component_size(Gc))
    return sizes


def attack_highest_degree(G, remove_fraction=0.01, steps=100):
    Gc, sizes = G.copy(), []
    batch_size = max(1, int(remove_fraction * len(G)))
    for _ in range(steps):
        to_remove = [n for n,_ in sorted(Gc.degree(),
                                         key=lambda x: x[1],
                                         reverse=True)[:batch_size]]
        if not to_remove: break
        Gc.remove_nodes_from(to_remove)
        sizes.append(giant_component_size(Gc))
    return sizes


def attack_pagerank(G, remove_fraction=0.01, steps=100):
    Gc, sizes = G.copy(), []
    batch_size = max(1, int(remove_fraction * len(G)))
    for _ in range(steps):
        to_remove = [n for n,_ in sorted(nx.pagerank(Gc).items(),
                                         key=lambda x: x[1],
                                         reverse=True)[:batch_size]]
        if not to_remove: break
        Gc.remove_nodes_from(to_remove)
        sizes.append(giant_component_size(Gc))
    return sizes


def attack_betweenness(G, remove_fraction=0.01, steps=100):
    Gc, sizes = G.copy(), []
    batch_size = max(1, int(remove_fraction * len(G)))
    for _ in range(steps):
        to_remove = [n for n,_ in sorted(nx.betweenness_centrality(Gc).items(),
                                         key=lambda x: x[1],
                                         reverse=True)[:batch_size]]
        if not to_remove: break
        Gc.remove_nodes_from(to_remove)
        sizes.append(giant_component_size(Gc))
    return sizes


def add_ring_among_high_degree(G, top_k=3):
    Gc = G.copy()
    top_nodes = sorted(Gc.degree(), key=lambda x: x[1], reverse=True)[:top_k]
    for n, _ in top_nodes:
        neigh = list(Gc.neighbors(n))
        if len(neigh) > 2:
            for i in range(len(neigh)):
                u, v = neigh[i], neigh[(i+1) % len(neigh)]
                if not Gc.has_edge(u, v):
                    Gc.add_edge(u, v)
    return Gc


def randomize_graph(G, n_swaps=None):
    Gc = G.copy()
    if n_swaps is None:
        n_swaps = Gc.number_of_edges() * 10
    nx.double_edge_swap(Gc, n_swaps, max_tries=n_swaps * 10)
    return Gc


def plot_attacks(results, orig_size, title=""):
    fractions = np.linspace(0, 1, len(results['random']))
    plt.figure(figsize=(6,4))
    for name, sizes in results.items():
        plt.plot(fractions, sizes, label=name)
    plt.scatter(fractions,
                [orig_size * (1-f) for f in fractions],
                color='cyan',
                label="NETWORK_SIZE")
    plt.xlabel("Fraction of nodes removed")
    plt.ylabel("Giant component size")
    plt.title(title)
    plt.legend()
    plt.tight_layout()
    plt.savefig(f"{IMAGES_PATH}/{title.replace(' ', '_').lower()}.png")
    plt.close()


def plot_attacks_with_reference(results, ref_results, orig_size, title=""):
    fractions = np.linspace(0, 1, len(results['random']))
    plt.figure(figsize=(6,4))
    
    for name, sizes in results.items():
        plt.plot(fractions, sizes, label=name)
    
    # Plot reference results
    for name, ref_sizes in ref_results.items():
        plt.plot(fractions, ref_sizes, linestyle='--', label=f"{name} (ref)")
    
    plt.scatter(fractions,
                [orig_size * (1-f) for f in fractions],
                color='cyan',
                label="NETWORK_SIZE")
    
    
    plt.xlabel("Fraction of nodes removed")
    plt.ylabel("Giant component size")
    plt.title(title)
    plt.legend()
    plt.tight_layout()
    plt.savefig(f"{IMAGES_PATH}/{title.replace(' ', '_').lower()}.png")
    plt.close()


# -------------------------------
# Part 1: Use small graphs to write the code
# -------------------------------
# G_toy = nx.erdos_renyi_graph(100, 0.05)
# orig_t = giant_component_size(G_toy)
# res_t = {
#     'random':      attack_random(G_toy, remove_fraction=0.02, steps=50),
#     'degree':      attack_highest_degree(G_toy, remove_fraction=0.02, steps=50),
#     'pagerank':    attack_pagerank(G_toy, remove_fraction=0.02, steps=50),
#     'betweenness': attack_betweenness(G_toy, remove_fraction=0.02, steps=50),
# }
# plot_attacks(res_t, orig_t, title="Toy Graph Attacks")
# print("Part 1 executed")


# -------------------------------
# Part 2: PolBlogs real graph
# -------------------------------
G = nx.read_edgelist(POLBLOGS_PATH,
                     create_using=nx.Graph(),
                     nodetype=int,
                     comments='%')
largest_cc = max(nx.connected_components(G), key=len)
G_real = G.subgraph(largest_cc).copy()
gc_size = giant_component_size(G_real)

# results_real = {
#     'random':      attack_random(G_real, remove_fraction=0.01, steps=100),
#     'degree':      attack_highest_degree(G_real, remove_fraction=0.01, steps=100),
#     'pagerank':    attack_pagerank(G_real, remove_fraction=0.01, steps=100),
#     'betweenness': attack_betweenness(G_real, remove_fraction=0.01, steps=100),
# }
# plot_attacks(results_real, gc_size, title="PolBlogs Graph Attacks")
print("Part 2 executed")


# -------------------------------
# Part 3: Robustness variants
# -------------------------------
# orig_fc = critical_threshold(G_real)

# G_rand  = randomize_graph(G_real)
# G_ring1 = add_ring_among_high_degree(G_real, top_k=40)
# G_ring2 = add_ring_among_high_degree(G_ring1,  top_k=80)
# G_ring3 = add_ring_among_high_degree(G_ring2,  top_k=120)

# variants = {
#     'Original':      G_real,
#     'Randomized':    G_rand,
#     'After 40 rings':  G_ring1,
#     'After 80 rings': G_ring2,
#     'After 120 rings': G_ring3,
# }

# records = []
# for name, Gs in variants.items():
#     N, L = Gs.number_of_nodes(), Gs.number_of_edges()
#     degs = np.array([d for _, d in Gs.degree()])
#     k1, k2 = degs.mean(), (degs**2).mean()
#     fc = critical_threshold(Gs)
#     records.append({
#         'Graph':       name,
#         'Size (N,L)':  f'N={N}, L={L}',
#         '⟨k⟩':         f'{k1:.2f}',
#         '⟨k²⟩':        f'{k2:.2f}',
#         'f_c':         f'{fc:.4f}',
#     })

# df = pd.DataFrame(records)
# print("\nPart 3 Summary Table:\n")
# print(df.to_markdown(index=False))



# # plot for each variant
# for name, Gs in variants.items():
#     if name != 'Original':
#         res = {
#             'random':      attack_random(Gs, remove_fraction=0.01, steps=100),
#             'degree':      attack_highest_degree(Gs, remove_fraction=0.01, steps=100),
#             'pagerank':    attack_pagerank(Gs, remove_fraction=0.01, steps=100),
#             'betweenness': attack_betweenness(Gs, remove_fraction=0.01, steps=100),
#         }
#         plot_attacks_with_reference(res, results_real, giant_component_size(Gs), title=f"PolBlogs Attacks ({name})")
#         print(f"Plotted attacks for variant: {name}")



# -------------------------------
# part 4: enriicola's bonus :)
# -------------------------------

print("\nPart 4 :)")

comms = community.greedy_modularity_communities(G_real)
print(f"\nDetected {len(comms)} communities")
for i, nodes in enumerate(comms):
    sub = G_real.subgraph(nodes)
    degs = np.array([d for _,d in sub.degree()])
    k1, k2 = degs.mean(), (degs**2).mean()
    denom = k2/k1 - 1 if k1>0 else -1
    fc = (1 - 1/denom) if denom>0 else float('nan')
    print(f"\tCommunity {i}: N={sub.number_of_nodes()}, L={sub.number_of_edges()}, f_c={fc:.4f}")

MIN_SIZE = 10
cands = []
for i, nodes in enumerate(comms):
    if len(nodes) < MIN_SIZE: continue
    sub = G_real.subgraph(nodes).copy()
    degs = np.array([d for _,d in sub.degree()])
    k1, k2 = degs.mean(), (degs**2).mean()
    denom = k2/k1 - 1 if k1>0 else -1
    if denom<=0: continue
    fc = 1 - 1/denom
    cands.append((f"Community {i}", sub, fc))

if not cands:
    print("No valid community ≥ MIN_SIZE with fc>0.")
    exit()

worst_name, worst_subG, worst_fc = min(cands, key=lambda x: x[2])
Nw, Lw = worst_subG.number_of_nodes(), worst_subG.number_of_edges()

# plot the worst community
plt.figure(figsize=(8, 6))
pos = nx.spring_layout(worst_subG, seed=42)
nx.draw(worst_subG, pos, with_labels=True, node_size=50, font_size=8, edge_color='gray')
plt.title(f"Worst Community: {worst_name} (N={Nw}, L={Lw}, f_c={worst_fc:.4f})")
plt.savefig(f"{IMAGES_PATH}/worst_community.png")
plt.close()

# attack the worst_subG and plot
bonus_res = {
    'random':      attack_random(worst_subG, remove_fraction=0.01, steps=100),
    'degree':      attack_highest_degree(worst_subG, remove_fraction=0.01, steps=100),
    'pagerank':    attack_pagerank(worst_subG, remove_fraction=0.01, steps=100),
    'betweenness': attack_betweenness(worst_subG, remove_fraction=0.01, steps=100),
}
plot_attacks(bonus_res, giant_component_size(worst_subG),
             title=f"Worst Community Attacks on {worst_name}")

# one-row summary of the worst subgraph
rec = {
    'Graph':      f"({worst_name})",
    'Size (N,L)': f"N={Nw}, L={Lw}",
    '⟨k⟩':        f"{np.array([d for _,d in worst_subG.degree()]).mean():.2f}",
    '⟨k²⟩':       f"{(np.array([d for _,d in worst_subG.degree()])**2).mean():.2f}",
    'f_c':        f"{worst_fc:.4f}",
}
print("\nWorst f_c subgraph Summary:\n")
print(pd.DataFrame([rec]).to_markdown(index=False))

# build 5-variant improvements on worst_subG
sv = {
    'Original':      worst_subG,
    'Randomized':    randomize_graph(worst_subG),
    'After 1 ring':  add_ring_among_high_degree(worst_subG, top_k=1),
    'After 2 rings':  add_ring_among_high_degree(worst_subG, top_k=2),
    'After 3 rings':  add_ring_among_high_degree(worst_subG, top_k=3),
}

# 5-row summary table
rows = []
for name, g in sv.items():
    degs = np.array([d for _,d in g.degree()])
    rows.append({
        'Graph':      name,
        'Size (N,L)': f"N={g.number_of_nodes()}, L={g.number_of_edges()}",
        '⟨k⟩':        f"{degs.mean():.2f}",
        '⟨k²⟩':       f"{(degs**2).mean():.2f}",
        'f_c':        f"{critical_threshold(g):.4f}",
    })
print("\nWorst f_c community Improvement Table:\n")
print(pd.DataFrame(rows).to_markdown(index=False))


# Plot each improved variant
for name, g in sv.items():
    if name != 'Original':
        res = {
            'random':      attack_random(g, remove_fraction=0.01, steps=100),
            'degree':      attack_highest_degree(g, remove_fraction=0.01, steps=100),
            'pagerank':    attack_pagerank(g, remove_fraction=0.01, steps=100),
            'betweenness': attack_betweenness(g, remove_fraction=0.01, steps=100),
        }
        plot_attacks_with_reference(res, bonus_res, giant_component_size(g), title=f"Worst Community Improved ({name})")
        print(f"Plotted worst community Improved: {name}")

