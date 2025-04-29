import json
import sys

def readTimes(path: str) -> list:
    with open(path, 'r') as f:
        data = json.load(f)
    return data

def buildTable(path: str) -> list:
    data = readTimes(path)
    timeList = []
    for l in data:
        timeList.append([l[0], -1])
        timeList.append([l[1], +1])
    return timeList

def marzulloAlgo(path: str) -> int:
    '''
    From: https://en.wikipedia.org/wiki/Marzullo%27s_algorithm#Method

    0) Build the table of tuples.
    1) Sort the table by the offset.
    2) Init best = 0 cnt = 0
    3) go through each tuple in the table in ascending order
    4)      [current number of overlapping intervals] cnt = cnt − type[i]
    5)      if cnt > best:
    6)          update best = cnt, beststart = offset[i], bestend = offset[i+1]
    7) Return [beststart,bestend] as optimal interval.
    '''

    '''
    0) Build the table
        time <-- [[x_0[start], type_0], [x_0[end], type_1], ..., [x_n-1[start], type_0], [x_n-1[end], type_1]]
        x_i[start]: offset value of the start
        x_i[end]: offset value of the end
        type_0 <-- -1: label of start the interval
        type_1 <-- +1: label of end the interval
    '''
    time = buildTable(path)

    '''
    1) Sort the table by the offset
    '''
    time = sorted(time, key=lambda x : x[0])

    '''
    2) Init best = 0, cnt = 0
    '''
    best = 0; cnt = 0

    '''
    3) go through each tuple in the table in ascending order
    '''
    bestStart = 0; bestEnd = 0
    for i, t in enumerate(time):
        '''
        4) cnt = cnt − type[i]
        '''
        cnt = cnt - t[1]

        '''
        5) if cnt > best
        '''
        if cnt > best:
            '''
            6) update best = cnt, beststart = offset[i], bestend = offset[i+1]
            '''
            best = cnt
            bestStart = t[0]
            bestEnd = time[i + 1][0]
    '''
    7) Return [beststart,bestend] as optimal interval
    '''
    return bestStart, bestEnd

def main(path: str) -> int:
    bestStart, bestEnd = marzulloAlgo(path)
    print(bestStart, bestEnd)
    return 0

if __name__ == "__main__":
    if len(sys.argv) == 2:
        path = sys.argv[1]
        main(path)
    else:
        print("[*] Usage: python3 marzulloAlgo.py time.json")   
