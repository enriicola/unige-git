# Write a C program that reads a line from input, ignoring case, and prints out the most frequent letter in the output in its lowercase form, 
# followed by a newline.
# If more than one character is tied for the most frequent, the one that appears first in the alphabet is printed.

# Non-character letters are ignored, and no other characters are printed.

# To write a Pythonic answer, consider using a Counter object and have a look at the string methods.

# vers 1
from collections import Counter

str = input().lower()
str = str.replace(" ", "")

if(str == ""):
    print("a")
else:
    letter = Counter(str)
    print(letter.most_common(1)[0][0]) # The most_common method returns a list of the n most common elements and their counts from the most common to the least.
                                  # In this case, the argument passed to most_common is 1, which means that the method will return a list containing the most
                                  # common element and its count.
                                  # The [0][0] indexing is used to extract the most common element from the list returned by most_common. The first [0] is 
                                  # used to access the first element of the list, which is itself a tuple containing the most

# vers 2
str = input().lower()
occurrencies = [(index, str.count(index)) for index in str]
max_occurrencies = maximum(occurrencies, key=lambda x: x[1])[0] if str else "a"
print(max_occurrencies)

# vers 3
str = input().lower()
occurrencies = [0] * 26
for letter in str:
    if(letter.isalpha()):
        occurrencies[ord(letter) - ord('a')] += 1
print(chr(occurrencies.index(maximum(occurrencies)) + ord('a')))
