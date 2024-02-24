# Write a program that generate a random sequence of n integers between 0 and m - 1, and outputs the k-th smallest element of the sequence.

# The input contains four positive integers: s, n, m, and t; respectively
# - the seed s of the random number generator;
# - the number n of integers to generate;
# - the maximum value m of the integers to generate;
# - the rank k of the element to output.

# The output contains a single integer, the k-th smallest element of the sequence.

# Constraints: this code should run in under a second, with k < n <= 10^6 and m <= 10^9.

# Use the Quickselect algorithm, which is a relative of Quicksort described below.

# For an array of n elements, the Quickselect algorithm finds the k-th smallest element in O(n) time, on average. It works as follows:
# - Choose a pivot element p.
# - Partition the array into three parts: the elements smaller than p, the elements equal to p, and the elements greater than p.
# - If the number of elements smaller than p is greater than k, then recursively find the k-th smallest element in the first part.
# - If the number t of elements smaller or equal to p is smaller than k, then recursively find the (k - t)-th smallest element in the third part.
# - Otherwise, p is the result.

# Use the standard library's random.seed() and random.randrange() functions. For example, with s=1, m=10 and n=10, you will generate the "2 9 1 4 1 7 7 7 6 3" sequence.

import random

s, n, m, k = [int(x) for x in input().split()]

# set the random generator's seed
random.seed(s)
source = []

# this will generate our n random values; modify as required
for _ in range(n):
    value = random.randrange(m)
    source.append(value)

def quickselect(array, k): # è sprecone, poi lo scriverò meglio
    pivot = random.choice(array)
    left = [x for x in array if x < pivot]
    mid = [x for x in array if x == pivot]
    right = [x for x in array if x > pivot]
    t = len(mid) + len(left)

    if(k < len(left)):
        return quickselect(left, k)
    elif(k >= t):
        return quickselect(right, k - t)
    else:
        return pivot

print(quickselect(source, k - 1))