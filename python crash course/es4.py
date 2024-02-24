# Write a Python program that computes the number of prime numbers between a and b (included), which are positive integers read from input.
# For example, the primes between 5 and 20 are 5, 7, 11, 13, 17, 19: the corresponding output is 6.

# Use the Sieve of Erathostenes algorithm, which is described below.

# Initially, create a boolean array that will tell us whether a number is "prime" or "not prime". Set all numbers between 2 and n - 1 to "prime".
# Then, starting from 2, for each prime number p, set to "not prime" all numbers between p^2 and n - 1 that are multiples of p.
# Then, find the next number between p + 1 and n - 1 that is "prime", and repeat the previous step.
# Stop when there are no more prime numbers between p + 1 and n - 1.
# The numbers between 2 and n - 1 that are still "prime" are the real prime numbers between 2 and n - 1.

# Hints:
# to generate a list with n copies of a value x, you can just use the "[x] * n" expression
# have a look at the documentation for the range() built-in function

# The maximum runtime is 3 seconds, for b <= 10^6.

def sieve(n):
    primes = [True] * n
    primes[0] = False
    primes[1] = False
    for i in range(2, n):
        if(primes[i]):
            for j in range(i*i, n, i):
                primes[j] = False
    return primes

line = input().split()
a = int(line[0])
b = int(line[1])

primes = sieve(b+1)

print(len([x for x in primes[a:b+1] if x])) # list comprehension