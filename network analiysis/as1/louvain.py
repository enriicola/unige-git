import networkx as nx
from networkx.algorithms.community import louvain_communities
import time
import networkx as nx
import csv

def ribba_louvain():
    G = nx.read_edgelist("../polblogs/out.dimacs10-polblogs",
                                create_using=nx.DiGraph(), nodetype=int,
                                comments='%')
    G_und = G.to_undirected()
    nx.write_gml(G_und, "../polblogs/polblogs.gml")

    # Create the graph
    #G = nx.karate_club_graph()
    G = nx.read_gml("../polblogs/polblogs.gml")


    # Run the Louvain algorithm and log execution time
    start_time = time.time()
    partition = louvain_communities(G)
    end_time = time.time()

    # Print number of communities
    print(f"\tNumber of communities found: {len(partition)}")

    # Calculate overall modularity
    overall_modularity = nx.community.modularity(G, partition)
    
    # Print the nodes in each community and check if connected
    for i, community in enumerate(partition): 
        subgraph = G.subgraph(community)
        print(f"\tCommunity {i}: size {len(community)}")
        
        # Save sorted communities to CSV file
        with open("lv_communities.csv", "w", newline="") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["Community", "Nodes"])
            for i, community in enumerate(partition):
                writer.writerow([i, sorted(community)])
    
    print(f"\tOverall modularity: {overall_modularity:.4f}")

    print(f"\tExecution time: {end_time - start_time:.4f} seconds")

    return partition