# Write a Python program that computes the scalar multiplication of two vectors of integers.
# Each vector is input as a single line.
# The program computes the scalar multiplication of the two vectors and prints the result, followed by a newline.

# The scalar multiplication of two vectors of size n is defined as the sum of the products of the corresponding elements of the two vectors. 
# For example, the scalar multiplication of the vectors [1, 2, 3] and [4, 5, 6] is 1 * 4 + 2 * 5 + 3 * 6 = 32.

# Assume that the input only contains the size of the vectors followed by the elements of the vectors, separated by spaces and/or newlines. 
# No other characters are printed in the output.

# To write a more Pythonic (and readable and concise) answer, consider the following points:
# write a function input_int_vector() that returns a list of integers read from a line in standard input
# try implementing it with a list comprehension: once you get used to them, they make programming easier!
# try not iterating on indices but on elements of lists: i.e., rather than "for x in range(len(...))" try using "for x in ...". Have a look at the zip()
#  and the sum() built-in functions.

def input_int_vector():
    line = input().split() #"\n"
    return [int(x) for x in line]

v1 = input_int_vector()
v2 = input_int_vector()

result = []

for item in zip(v1, v2):
    result.append(item[0]*item[1])

print(sum(result))