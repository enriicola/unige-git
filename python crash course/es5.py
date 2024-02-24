# Write a Python program that computes the minimum and maximum of the sliding-window mean of a set of random integers between 0 and m - 1.
# A sliding window is a set of consecutive numbers in a sequence. For example, the sliding windows of size 3 in the sequence 1 2 3 4 5 6 7 8 9 10 are 1 2 3, 2 3 4, 3 4 5, 4 5 6, 5 6 7, 6 7 8, 7 8 9, 8 9 10.

# The sliding-window mean is defined as the mean of the numbers in the window. The window slides over the set of numbers, one number at a time. The minimum and maximum of the sliding-window mean is the minimum and maximum of the mean values computed for each window position.

# The input contains four numbers, s, n, m and w on a single line: respectively, the seed s of the random number generator, the number n of random numbers to generate, the maximum value m of the random numbers, and the size w of the sliding window.
# The output contains the minimum and maximum of the sliding-window mean, with a precision of four digits. Do not print other values.

# The way to use the random number generator is already given. For example, with s=1, m=10 and n=10, it will generate the "2 9 1 4 1 7 7 7 6 3" sequence.
# To correctly print the output, have a look at the documentation for f-strings.

# Constraints: this code should run in under 3 seconds, with w <= n <= 10^5. Note that an algorithm with quadratic complexity will not meet the time constraint.


import random

s, n, m, w = [int(x) for x in input().split()]

# set the random generator's seed
random.seed(s)
source = []
mean = []
buffer = 0

# this will generate our n random values; modify as required
for _ in range(n):
    value = random.randrange(m)
    source.append(value)

for i in range(n):
    buffer += source[i]
    if(i >= w-1):
        mean.append(buffer/w)
        buffer -= source[i-w+1]

print(f"{min(mean):.4f} {max(mean):.4f}")