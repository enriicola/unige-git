import networkx as nx
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import time
import igraph as ig

from scipy.cluster import hierarchy
from louvain import ribba_louvain
from leiden import ribba_leiden
from networkx.algorithms.community import louvain_communities
from matplotlib.cm import get_cmap

from collections import Counter
from sklearn.metrics import normalized_mutual_info_score, adjusted_rand_score
from sklearn.metrics import normalized_mutual_info_score, adjusted_rand_score


# debugging
import cProfile
pr = cProfile.Profile()
pr.enable()


def plot_degree_distributions_logbin(G, img_path):
    degrees = [d for _, d in G.degree()]
    
    # Generate Barabasi-Albert model for reference
    n = G.number_of_nodes()
    m = int(G.number_of_edges() / n)  # approximate attachment parameter
    m = max(1, m)  # ensure m is at least 1
    ba_model = nx.barabasi_albert_graph(n=n, m=m)
    ba_degrees = [d for _, d in ba_model.degree()]
    
    # Log-binned histogram
    bins = np.logspace(np.log10(min(min(degrees), min(ba_degrees))+1),
                      np.log10(max(max(degrees), max(ba_degrees))), 20)
    plt.figure(figsize=(10, 6))
    plt.hist(degrees, bins=bins, edgecolor='black', alpha=0.7, label="Original Network")
    plt.hist(ba_degrees, bins=bins, edgecolor='red', alpha=0.5, 
             histtype='step', linewidth=1.5, label="Barabási-Albert Model")
    plt.xscale('log'); plt.yscale('log')
    plt.xlabel("Degree $k$")
    plt.ylabel("Frequency")
    plt.title("Degree Distribution (log-binned)")
    plt.grid(True, which="both", linestyle="--", linewidth=0.5)
    plt.legend()
    plt.savefig(f"{img_path}degree_distribution_logbinned.png", dpi=300)
    plt.close()
    
    # Complementary CDF (CCDF)
    deg_counts = Counter(degrees)
    k_vals, counts = zip(*sorted(deg_counts.items()))
    pk = np.array(counts) / sum(counts)
    ccdf = np.cumsum(pk[::-1])[::-1]
    
    plt.figure(figsize=(10, 6))
    plt.step(k_vals, ccdf, where="post")
    plt.xscale('log'); plt.yscale('log')
    plt.xlabel("Degree $k$")
    plt.ylabel("P(K ≥ k)")
    plt.title("Degree CCDF")
    plt.grid(True, which="both", linestyle="--", linewidth=0.5)
    plt.savefig(f"{img_path}degree_ccdf.png", dpi=300)
    plt.close()
    
    # Scatter plot + power law fit on raw counts
    #    Fit line on log-log of counts
    mask = np.array(counts) > 0
    log_k = np.log10(np.array(k_vals)[mask])
    log_c = np.log10(np.array(counts)[mask])
    slope, intercept = np.polyfit(log_k, log_c, 1)
    
    plt.figure(figsize=(10, 6))
    plt.loglog(k_vals, counts, 'bo', markersize=4, label="empirical")
    k_line = np.array(k_vals)
    plt.loglog(k_line, 10**intercept * k_line**slope, 'r--',
               label=f"fit: slope={slope:.2f}")
    plt.xlabel("Degree $k$")
    plt.ylabel("Frequency")
    plt.title("Degree Distribution (scatter & fit)")
    plt.legend()
    plt.grid(True, which="both", linestyle="--", linewidth=0.5)
    plt.savefig(f"{img_path}degree_scatter_fit.png", dpi=300)
    plt.close()
    
    # optional original network drawing
    plt.figure(figsize=(10, 6))
    nx.draw(G, with_labels=True, node_size=50, font_size=8)
    plt.title("Network structure")
    plt.savefig(f"{img_path}polblogs_graph.png", dpi=300)
    plt.close()

def compute_components(G):
    wccs = list(nx.weakly_connected_components(G))
    sccs = list(nx.strongly_connected_components(G))

    if len(wccs) == 1:
        print("Graph is weakly connected")
    else:
        largest_wcc = max(wccs, key=len)
        print(f"Graph is not weakly connected ({len(wccs)} components); "
            f"largest WCC size = {len(largest_wcc)}")

        G_lcc = G.subgraph(largest_wcc)
        print("\tLargest WCC strongly connected? ",
            nx.is_strongly_connected(G_lcc))

    if len(sccs) == 1:
        print("Graph is strongly connected")
    else:
        print(f"Graph is not strongly connected ({len(sccs)} components); "
            f"largest SCC size = {len(max(sccs, key=len))}")

    print("\nComponent size summary:")
    print(f"\t# WCCs: {len(wccs)}   sizes: {sorted(map(len, wccs))}")
    print(f"\t# SCCs: {len(sccs)}   sizes: {sorted(map(len, sccs))}")
    # for i, wcc in enumerate(wccs, 1):
    #     count = sum(1 for scc in sccs if scc.issubset(wcc))
    #     print(f"  WCC {i} (size {len(wcc)}) contains {count} SCC(s)")

def plot_degree_distribution_vanilla(G, img_path):
    # Original graph degree distribution
    degrees = [d for _, d in G.degree()]
    degree_counts = Counter(degrees)
    x = sorted(degree_counts.keys())
    y = [degree_counts[d] for d in x]
    
    # Generate Barabasi-Albert model for reference
    n = G.number_of_nodes()
    m = int(G.number_of_edges() / n)  # approximate attachment parameter
    m = max(1, m)  # ensure m is at least 1
    ba_model = nx.barabasi_albert_graph(n=n, m=m)
    ba_degrees = [d for _, d in ba_model.degree()]
    ba_degree_counts = Counter(ba_degrees)
    ba_x = sorted(ba_degree_counts.keys())
    ba_y = [ba_degree_counts[d] for d in ba_x]
    
    # Plot both
    plt.figure(figsize=(10, 6))
    plt.bar(x, y, width=0.8, color='blue', alpha=0.7, label='Original Network')
    plt.plot(ba_x, ba_y, 'ro-', markersize=4, alpha=0.8, label='Barabási-Albert Model')
    plt.xlabel("Degree $k$")
    plt.ylabel("Frequency")
    plt.title("Degree Distribution with BA Model Reference")
    plt.grid(True, linestyle='--', linewidth=0.5)
    plt.legend()
    plt.savefig(f"{img_path}degree_distribution.png", dpi=300)

def are_paths_short_wrt_size_of_the_network(G, n, k):
    Gsub = G.copy()
    sccs = list(nx.strongly_connected_components(Gsub))
    for scc in sccs:
        if len(scc) == 2:
            Gsub.remove_nodes_from(scc)
            # print(f"Removed SCC of size 2: {scc}")
            break

    try:        
        avg_path_length = nx.average_shortest_path_length(Gsub)
        print(f"Average shortest path length: {avg_path_length:.2f}")
        
        t = np.log(n) / np.log(k)
        print(f"Theoretical average shortest path length for random graph: {t:.2f}")
        # if avg_path_length < t:
        #     print("Paths are short with respect to the size of the network.")
        # else:
        #     print("Paths are not short with respect to the size of the network.")
    except nx.NetworkXError as e:
        print(f"Error calculating average path length: {e}")    
        
def condensed_dists(G_sub):
    """
    helper: get condensed distances from shortest-path lengths
    """
    nodes = list(G_sub.nodes())
    allsp = dict(nx.all_pairs_shortest_path_length(G_sub.to_undirected()))
    dists = []
    max_finite_dist = 0
    
    # First pass: find maximum finite distance
    for i in range(len(nodes)):
        for j in range(i+1, len(nodes)):
            distance = allsp[nodes[i]].get(nodes[j], float('inf'))
            if distance != float('inf'):
                max_finite_dist = max(max_finite_dist, distance)
    
    # Use max_finite_dist + 1 as replacement for infinite distances
    replacement_dist = max_finite_dist + 1
    
    # Second pass: build distance array with finite values only
    for i in range(len(nodes)):
        for j in range(i+1, len(nodes)):
            distance = allsp[nodes[i]].get(nodes[j], replacement_dist)
            dists.append(distance)
    return np.array(dists), nodes

def part1(G, img_path):
    print("############\n***Part 1***\n############\n")

    n = G.number_of_nodes()
    m = G.number_of_edges()
    print("Number of nodes:", n)
    print("Number of edges:", m)
    k = np.mean([d for _, d in G.degree()])
    print("Average degree:", k)
    print("Max degree:", max(dict(G.degree()).values()))
    print("Min degree:", min(dict(G.degree()).values()))

    all_lengths = nx.all_pairs_shortest_path_length(G)
    max_dist = 0
    for source, dist_dict in all_lengths:
        # dist_dict only contains reachable targets
        local_max = max(dist_dict.values(), default=0)
        if local_max > max_dist:
            max_dist = local_max
    print("Finite-reachability diameter:", max_dist)


    density = nx.density(G)
    print(f"Density: {density:.4f}")

    alpha = np.log(m) / np.log(n)
    print(f"Scaling exponent α ≈ log(m)/log(n) = {alpha:.3f}")

    # classification
    if abs(alpha - 2) < abs(alpha - 1):
        print("⇒ Graph is DENSE (m grows ~ O(n²), so ρ→const).")
    else:
        print("⇒ Graph is SPARSE (m grows ~ O(n), so ρ→0).")

    print("")  # better readability
    compute_components(G)

    print("Diameter of the largest strongly connected component:", nx.diameter(G.subgraph(max(nx.strongly_connected_components(G), key=len))))
    weak_cc = max(nx.weakly_connected_components(G), key=len)
    H = G.subgraph(weak_cc).to_undirected()
    print("Diameter of the largest weakly connected component:", nx.diameter(H))

    avg_clustering = nx.average_clustering(G.to_undirected())
    print(f"\nAverage clustering coefficient: {avg_clustering:.4f}")
    
    # checking avg_clustering against random network
    deg_seq = [d for _, d in G.degree()]
    RandomGraph = nx.configuration_model(deg_seq, create_using=nx.Graph())  
    RandomGraph.remove_edges_from(nx.selfloop_edges(RandomGraph))

    # compute its average clustering
    rand_C = nx.average_clustering(RandomGraph)
    print(f"Random-baseline clustering: {rand_C:.4f}")

    if avg_clustering > rand_C:
        print("\tClustering is higher than random-graph baseline")
    else:
        print("\tClustering is not higher than baseline")


    print("\nBetweenness centrality (top 5 nodes):")
    betweenness_centrality = nx.betweenness_centrality(G)
    top_betweenness = sorted(betweenness_centrality.items(), key=lambda x: x[1], reverse=True)[:5]
    pos = 0
    for node, centrality in top_betweenness:
        print(f"\t{pos+1}. Node {node}: {centrality:.4f}")
        pos += 1

    print("\nCloseness centrality (top 5 nodes):")
    closeness_centrality = nx.closeness_centrality(G)
    top_closeness = sorted(closeness_centrality.items(), key=lambda x: x[1], reverse=True)[:5]
    pos = 0
    for node, centrality in top_closeness:
        print(f"\t{pos+1}. Node {node}: {centrality:.4f}")
        pos += 1

    print("\nDegree centrality (top 5 nodes):")
    degree_centrality = nx.degree_centrality(G)
    top_degree = sorted(degree_centrality.items(), key=lambda x: x[1], reverse=True)[:5]
    pos = 0
    for node, centrality in top_degree:
        print(f"\t{pos+1}. Node {node}: {centrality:.4f}")
        pos += 1

    # assortativity
    assortativity = nx.degree_assortativity_coefficient(G)
    print(f"\nAssortativity coefficient: {assortativity:.4f}")
    print("Is the graph assortative?", assortativity > 0)

    plot_degree_distribution_vanilla(G, img_path)

    are_paths_short_wrt_size_of_the_network(G, n, k)

    plot_degree_distributions_logbin(G, img_path)


def part2(G, img_path):
    """
    Part 2: Community detection using:
      1) Girvan–Newman (modularity-peak stopping)
      2) Louvain via external ribba_louvain
      3) Leiden  via external ribba_leiden
    """
    print("\n\n############\n***Part 2***\n############\n")

    # find Girvan-Newman communities stopping at modularity peak
    print("Girvan-Newman algorithm:")
    
    # G = nx.karate_club_graph()  # TODO comment when finished debugging
    
    pos = nx.spring_layout(G, seed=42)
    start_time = time.time()
    comp_gen = nx.community.girvan_newman(G)
    best_mod = -1
    best_communities = None
    level = 0
    for communities in comp_gen:
        level += 1
        m = nx.community.modularity(G, communities)
        print(f" Level {level} ({len(communities)} communities): modularity = {m:.4f}")
        
        if m > best_mod:
            best_mod = m
            best_communities = communities
        else:
            break
    end_time = time.time()
    print(f"\nBest modularity = {best_mod:.4f} at partition with {len(best_communities)} communities.")
    gn_time = end_time - start_time
    print(f"Execution time: {gn_time:.4f} seconds")

    # Visualize best partition
    comm_index = {node: idx for idx, comm in enumerate(best_communities) for node in comm}
    plt.figure(figsize=(6, 4))
    nx.draw(
        G, pos,
        node_color=[comm_index[n] for n in G.nodes()],
        with_labels=True, cmap=plt.cm.tab10
    )
    plt.title(f"Best GN Partition ({len(best_communities)} comms, modularity={best_mod:.4f})")
    plt.savefig(f"{img_path}best_girvan_newman_partition.png", bbox_inches='tight')
    plt.close()
    
    # dendrogram
    dists, labels = condensed_dists(G)
    Z = hierarchy.linkage(dists, method='average', optimal_ordering=True)
    plt.figure(figsize=(12, 8))
    palette = plt.get_cmap('tab20').colors
    def llc(k):
        return mcolors.to_hex(palette[k % len(palette)])

    # Plot with link_color_func to get multiple colors
    hierarchy.dendrogram(
        Z,
        labels=[str(n) for n in labels],
        orientation='top',
        truncate_mode='lastp',
        p=30,
        leaf_rotation=90,
        leaf_font_size=10,
        show_contracted=True,
        link_color_func=llc
    )

    # Enhance the plot
    plt.xticks(rotation=90)
    plt.title("Hierarchical Clustering Dendrogram")
    plt.xlabel("Node ID")
    plt.ylabel("Distance")
    plt.tight_layout()
    plt.savefig(f"{img_path}dendrogram.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Dendrogram saved.")
    
    
    # Louvain algorithm
    print("\nLouvain algorithm:")
    start_time = time.time()
    partition_lv = ribba_louvain()  # This returns a list of sets
    end_time = time.time()
    lv_time = end_time - start_time
    print(f"Best partition found in {lv_time:.4f} seconds")
    
    # Convert partition_lv (list of sets) to partition_lv_orig (dict format)
    # This is needed for part3() compatibility
    partition_lv_dict = {}
    for comm_id, community in enumerate(partition_lv):
        for node in community:
            partition_lv_dict[node] = comm_id

    print("\nLeiden algorithm:")
    start_time = time.time()
    ribba_leiden()  # This function just prints results and saves to CSV
    end_time = time.time()
    ld_time = end_time - start_time
    print(f"Best partition found in {ld_time:.4f} seconds")
    
    # Read Leiden communities from CSV and map igraph indices to original node IDs
    import csv
    leiden_communities = {}
    # Export the undirected graph to GML and read with igraph to get vertex names
    nx.write_gml(G.to_undirected(), "temp_leiden.gml")
    G_ig = ig.Graph.Read_GML("temp_leiden.gml")
    # Attempt to get original node IDs from 'name', fallback to 'label'
    try:
        ig_labels = [int(name) for name in G_ig.vs["name"]]
    except (KeyError, ValueError):
        ig_labels = [int(label) for label in G_ig.vs["label"]]
    # Parse CSV of community assignments
    with open("ld_communities.csv", "r") as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for comm_str, idx_str in reader:
            comm_id = int(comm_str)
            ig_idx = int(idx_str)
            if 0 <= ig_idx < len(ig_labels):
                original_node = ig_labels[ig_idx]
                leiden_communities.setdefault(comm_id, set()).add(original_node)
    
    # Convert to list of sets format
    partition_ld = list(leiden_communities.values())
    
    print(f"\nExecution times:\n\tGirvan-Newman: {gn_time:.1f} seconds\n\tLouvain: {lv_time:.4f} seconds\n\tLeiden: {ld_time:.4f} seconds")
    print(f"\tSpeedup of Louvain over Girvan-Newman: {gn_time/lv_time:.2f}x")
    print(f"\tSpeedup of Leiden over Girvan-Newman: {gn_time/ld_time:.2f}x")
    print(f"\n\tSpeedup of Leiden over Louvain: {lv_time/ld_time:.2f}x")

    return best_communities, partition_lv_dict, partition_ld
    

def part3(G, best_communities):
    """
    Part 3: Evaluate quality of communities using NMI and ARI between partitions.
    
    Even without a ground truth, metrics like Normalized Mutual Information (NMI) and the Adjusted Rand Index (ARI) can be used to compare the results obtained from different algorithms, as they evaluate how similar the detected communities are in the graph.
    These metrics help answer the question: “How consistent are the algorithms in the way they grouped the nodes of my graph?”
    Compute these metrics on the partitions produced by the different algorithms and discuss the results in your report. Note that with this approach, you cannot determine which result is correct (since there is no ground truth), but rather how much the algorithms agree with each other. It is also worth mentioning that NMI performs well even when the number of communities differs between algorithms.
    """
    print("\n\n############\n***Part 3***\n############\n")
    
    nodes = list(G.nodes())  # casting to list for consistent ordering
    
    # gn labels
    gn_map = {n: idx for idx, comm in enumerate(best_communities) for n in comm}
    labels_gn = [gn_map.get(n, -1) for n in nodes]
    
    # lv labels (crepi l'avarizia)
    from community import best_partition
    lv_partition = best_partition(G.to_undirected())
    labels_lv = [lv_partition.get(n, -1) for n in nodes]
    
    # le labels (crepi l'avarizia)
    from leidenalg import find_partition, ModularityVertexPartition
    import igraph as ig
    G_ig = ig.Graph.TupleList(G.edges(), directed=True)
    partition_ld = find_partition(G_ig, ModularityVertexPartition)
    labels_ld = [
        partition_ld.membership[
        G_ig.vs.find(name=n).index
    ]
    for n in nodes
]
    
    
    # Compute and print pairwise similarity
    print("\nPartition similarity (no ground truth):")
    pairs = [ ("Girvan–Newman", labels_gn), ("Louvain", labels_lv), ("Leiden", labels_ld) ]
    for i in range(len(pairs)):
        for j in range(i+1, len(pairs)):
            name1, lab1 = pairs[i]
            name2, lab2 = pairs[j]
            nmi = normalized_mutual_info_score(lab1, lab2)
            ari = adjusted_rand_score(lab1, lab2)
            print(f"\t{name1:>15} vs {name2:<15} → NMI = {nmi:.4f}, ARI = {ari:.4f}")
    
    # Return metrics if needed
    return {
        (pairs[i][0], pairs[j][0]): {"NMI": normalized_mutual_info_score(pairs[i][1], pairs[j][1]),
                                       "ARI": adjusted_rand_score(pairs[i][1], pairs[j][1])}
        for i in range(len(pairs)) for j in range(i+1, len(pairs))
    }
    


def part4(G, pos, img_path, gn_labels, partition_lv_orig, ld_labels):
    print("\n\n############\n***Part 4***\n############\n")
    
    def normalize(label_map):
        """Cast all keys to int so they match G.nodes() exactly."""
        return {int(k): v for k, v in label_map.items()}
    
    # build consistent dicts: node->community_id
    gn_dict = (
        normalize({n: cid for cid, comm in enumerate(gn_labels) for n in comm})
        if isinstance(gn_labels, (list, tuple))
        else normalize(gn_labels)
    )
    lv_dict = normalize(partition_lv_orig)
    ld_dict = (
        normalize({n: cid for cid, comm in enumerate(ld_labels) for n in comm})
        if isinstance(ld_labels, (list, tuple))
        else normalize(ld_labels)
    )

    algorithms = {
        "GN": gn_dict,
        "Louvain":       lv_dict,
        "Leiden":        ld_dict
    }

    for name, labels in algorithms.items():
        # build a color list in node-order
        color_vals = [labels[n] for n in G.nodes()]
        # number of communities
        ncomms = max(color_vals) + 1
        # discrete colormap with ncomms entries
        cmap = plt.get_cmap("tab20", ncomms)

        plt.figure(figsize=(8,6))
        nx.draw(
            G,
            pos=pos,
            node_color=color_vals,
            cmap=cmap,
            node_size=50,
            with_labels=False,
            edge_color="lightgray",
            linewidths=0.2
        )
        plt.title(f"{name} partitions")
        plt.axis("off")
        plt.savefig(f"{img_path}{name.lower().replace(' ','_')}_communities.png",
                    dpi=300, bbox_inches="tight")
        plt.close()
        print(f"Saved {name} partition visualization.")



def main():
    img_path   = "images/"
    graph_file = '../polblogs/out.dimacs10-polblogs'

    try:
        with open(graph_file) as f: pass
    except FileNotFoundError:
        print(f"Error: The file {graph_file} does not exist.")
        exit(1)
    if not open(graph_file).read().strip():
        print(f"Error: The file {graph_file} is empty.")
        exit(1)

    G = nx.read_edgelist(graph_file, create_using=nx.DiGraph, nodetype=int, comments='%')

    part1(G, img_path)
    
    best_communities, partition_lv_orig, partition_ld = part2(G, img_path)
    
    # Part 3: evaluate similarity between community partitions
    part3(G, best_communities)

    pos = nx.spring_layout(G, seed=42)
    part4(G, pos, img_path, best_communities, partition_lv_orig, partition_ld)
    
    print()


if __name__ == "__main__":
    main()
    
    # pr.disable()
    # ps = pstats.Stats(pr).sort_stats('tottime')  # https://docs.python.org/3/library/profile.html#pstats.Stats.sort_stats 
    # ps.print_stats(10)  
    # ps.dump_stats('profiling_stats.prof')