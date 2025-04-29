#!/usr/bin/env python3
import json
import sys
import operator

pairs = json.loads(sys.stdin.read())

# compute the left and right borders of the output interval

l = []
for start, end in pairs:
    l.append((start, 1))
    l.append((end, -1))

l.sort(key=lambda x: x[0])

max_count = max_index = count = 0
for i, (_, value) in enumerate(l):
    count += value
    if count > max_count:
        max_count = count
        max_index = i
        left = l[i][0]
        right = l[i+1][0]

print(left, right)

# echo '[[1, 3], [2, 4], [2.5, 5], [14, 16], [2.25, 4]]' | python3 marzullo.py