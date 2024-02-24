def GCD(a, b):
    if(b == 0):
        return a
    return GCD(b, a%b)

line = input().split()
a = int(line[0])
b = int(line[1])

print(GCD(a,b))