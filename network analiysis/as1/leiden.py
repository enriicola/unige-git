import igraph as ig  # Notice that here you need a different library
import leidenalg
import time
import networkx as nx
import csv

def ribba_leiden():
    G = nx.read_edgelist("../polblogs/out.dimacs10-polblogs",
                        create_using=nx.DiGraph(), nodetype=int,
                        comments='%')

    G_und = G.to_undirected()
    nx.write_gml(G_und, "../polblogs/polblogs.gml")


    # Read the graph
    #G = ig.Graph.Famous("Zachary")
    G = ig.Graph.Read_GML("../polblogs/polblogs.gml")

    # Run the Leiden algorithm, optimizing Modularity and log execution time
    start_time = time.time()
    partition = leidenalg.find_partition(G, leidenalg.ModularityVertexPartition)
    end_time = time.time()


    # Print number of communities
    print(f"\tNumber of communities found: {len(partition)}")

    # Print the nodes in each community
    for i, community in enumerate(partition):
        print(f"\tCommunity {i}: {len(community)} nodes")

    # Save communities to CSV
    with open("ld_communities.csv", "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["community_id", "node_id"])
        for i, community in enumerate(partition):
            for node in sorted(community):
                writer.writerow([i, node])

    print(f"\tLeiden total modularity: {partition.modularity:.4f}")
    print(f"\tExecution time: {end_time - start_time:.4f} seconds")

