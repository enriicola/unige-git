# Consider an Erdős-Rényi random graph with N = 3000 nodes, connected to each other with probability p = 0.001 and then answer to the following questions. 
# 1. Can you compute the mean degree 〈k〉 and the expected number of links 〈L〉?
# 2. Calculate the probability pcr so that the network is at the critical point.
# 3. In which regime is the network?
# 4. Given the linking probability p = 0.001, calculate the number of nodes Ncr so that the network has only one component.
# 5. For the network in (4), calculate the average degree 〈kcr〉 and the average distance 〈d〉 between two randomly chosen nodes

import numpy as np

def mean_degree_expected_links(N, p):
   """
   Calculate the mean degree and expected number of links for an Erdős-Rényi random graph.
   
   Parameters:
   N (int): Number of nodes
   p (float): Probability of connection between nodes
   
   Returns:
   tuple: Mean degree 〈k〉 and expected number of links 〈L〉
   """
   mean_degree = p * (N - 1)  # Mean degree 〈k〉
   expected_links = N * mean_degree / 2  # Expected number of links 〈L〉
   return mean_degree, expected_links
 
def critical_probability(N):
    """
    Calculate the critical probability pcr for an Erdős-Rényi random graph.
    
    Parameters:
    N (int): Number of nodes
    
    Returns:
    float: Critical probability pcr
    
    Raises:
    ValueError: If N is less than or equal to 0
    """
    if N <= 0:
        raise ValueError("Number of nodes must be positive")
    return 1 / N  # Critical probability pcr
   
def regime(N, p):
   """
   Determine the regime of the network based on the linking probability p.
   
   Parameters:
   N (int): Number of nodes
   p (float): Probability of connection between nodes
   
   Returns:
   str: Regime of the network
   """
   pcr = critical_probability(N)
   if p < pcr:
     return "Subcritical"
   elif p == pcr:
     return "Critical"
   else:
     return "Supercritical"
   
def critical_nodes(p):
   """
   Calculate the number of nodes Ncr for which the network has only one component.
   
   Parameters:
   p (float): Probability of connection between nodes
   
   Returns:
   int: Number of nodes Ncr
   """
   return int(1 / p)  # Ncr = 1/p
 
def average_degree(Ncr, p):
   """
   Calculate the average degree 〈kcr〉 for a network with Ncr nodes and linking probability p.
   
   Parameters:
   Ncr (int): Number of nodes in the critical network
   p (float): Probability of connection between nodes
   
   Returns:
   float: Average degree 〈kcr〉
   """
   return p * (Ncr - 1)  # Average degree 〈kcr〉
 
def average_distance(Ncr):
   """
   Calculate the average distance 〈d〉 between two randomly chosen nodes in a critical network.
   For large Ncr, the average distance can be approximated as log(Ncr) / log(kcr).
   """
   kcr = average_degree(Ncr, p)
   return np.log(Ncr) / np.log(kcr) if kcr > 1 else 0 # if kcr <= 1, the network is likely disconnected

# Parameters
N = 3000  # Number of nodes
p = 0.001  # Probability of connection

# Calculations
mean_k, expected_L = mean_degree_expected_links(N, p)
pcr = critical_probability(N)
regime_type = regime(N, p)
Ncr = critical_nodes(p)
mean_kcr = average_degree(Ncr, p)
mean_distance = average_distance(Ncr)

# Output results
print(f"Mean degree 〈k〉: {mean_k:.4f}")
print(f"Expected number of links 〈L〉: {expected_L:.4f}")

print(f"Critical probability pcr: {pcr:.4f}")

print(f"Network regime: {regime_type}")

print(f"Number of nodes Ncr for one component: {Ncr}")

print(f"Average degree 〈kcr〉: {mean_kcr:.4f}")
print(f"Average distance 〈d〉: {mean_distance:.4f}")
# Note: The average distance calculation assumes a large enough network and may not be accurate for small Ncr.
# The average distance calculation is a simplification and may not hold for all network configurations.