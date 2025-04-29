#!/usr/bin/env python3

import csv
import heapq

import simplemr


class FifaMean(simplemr.MapReduce):    
    def map(self, row):
        yield row['Club'], int(row['Overall'])
        
    def reduce(self, club, values):
        values = list(values)
        yield club, sum(values) / len(values)

    
class FifaMeanCombine(simplemr.MapReduceCombine):    
    def map(self, row):
        yield row['Club'], (int(row['Overall']), 1)

    def combine(self, club, values):
        values = list(values)
        yield club, sum(values), len(values)
        
    def reduce(self, club, pairs):
        total = num = 0
        for v, n in pairs:
            total += v
            num += n
        yield club, total / num



if __name__ == '__main__':

    print("Without combiner")
    with open('fifa21.csv') as f:
        output = FifaMean().run(csv.DictReader(f))
        print(heapq.nlargest(10, output, key=simplemr.second))

    print("With combiner")
    with open('fifa21.csv') as f:
        output = FifaMeanCombine().run(csv.DictReader(f))
        print(heapq.nlargest(10, output, key=simplemr.second))

