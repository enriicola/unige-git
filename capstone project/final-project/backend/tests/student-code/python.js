// Snippet of Python code used for test files

export const pythonCorrectTwoSum = `import json
import sys

# Support both wrapped (input_data provided) and raw stdin JSON
try:
    nums, target = input_data
except NameError:
    raw = sys.stdin.read().strip() or "[]"
    nums, target = json.loads(raw)

seen = {}
result = []
for idx, num in enumerate(nums):
    need = target - num
    if need in seen:
        result = [seen[need], idx]
        break
    seen[num] = idx

print(json.dumps(result))`;

export const pythonIncorrectTwoSum = `import json
# Wrong implementation - always returns empty list
print(json.dumps([]))`;

export const pythonSyntaxError = `import json
s, t = input_data
# Syntax error - missing colon
for ch in s
    print(json.dumps(True))`;

export const pythonInfiniteLoop = `import json
# Infinite loop - should timeout
while True:
    pass`;
