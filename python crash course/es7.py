# Write a program that implements a priority queue using the heap data structure. It reads four integers from input: s, n, m and w, on a single line: respectively,
# - the seed s of the random number generator;
# - the number n of elements to generate;
# - the maximum value m of the elements to generate;
# - a "window size" w which is the number of elements to keep in the priority queue.

# After the first w elements are generated and inserted in the queue, for each other element remove from the queue the smallest element and insert the newly generated element.

# The output of the program will be the smallest element remaining in the queue after all n elements have been generated.

# The random number generator you should use is already given. For example, with s=1, m=10 and n=10, it will generate the "2 9 1 4 1 7 7 7 6 3" sequence.
# If we run on this sequence with w=7,
# - the priority queue will first contain the first 7 values (2 9 1 4 1 7 7)
# - the smallest element (1) will be removed from the queue, and the next element (7) will be inserted (2 9 4 1 7 7 7)
# - the smallest element (1) will be removed from the queue, and the next element (6) will be inserted (2 9 4 7 7 7 6)
# - the smallest element (2) will be removed from the queue, and the next element (3) will be inserted (9 4 7 7 7 6 3)
# The smallest element remaining in the queue is 3.

# Our priority queue will be a min-heap, which is a binary tree that satisfies the following properties:
# - the value of each node is smaller than the value of its children;
# - the tree is complete, i.e. all levels are filled except possibly the last one, which is filled from left to right.
# Note that the smallest element is always at the root of the tree.

# We will represent the heap as a list, where the root is at index 0, and the children of the element at index i are at indices 2i + 1 and 2i + 2.

# Rather than implementing your own heap, this time try using the one in the standard library. Choose wisely the function to use (if you've done the C exercise, don't be lazy and look at all that the library can offer you!)

# Constraints: this code should run in under 3 seconds, with w < n <= 10^5 and m <= 10^9.

import random
import heapq

s, n, m, w = [int(x) for x in input().split()]

# set the random generator's seed
random.seed(s)
source = []
heap = []

# this will generate our n random values; modify as required
for _ in range(n):
    value = random.randrange(m)
    if(len(heap) < w):
        heapq.heappush(heap, value)
    else:
        heapq.heappop(heap)
        heapq.heappush(heap, value)

print(heap[0])