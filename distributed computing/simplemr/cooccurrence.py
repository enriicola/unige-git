#!/usr/bin/env python3

import collections
import heapq
import re

import simplemr

WORD_RE = re.compile(r'\w+')


class PairCoOccurrence(simplemr.MapReduceCombine):
    def __init__(self, window):
        self.window = window
    
    def map(self, line):
        line = line.lower()
        words = WORD_RE.findall(line)
        raise NotImplementedError
        
    def combine(self, k, vs):
        raise NotImplementedError

    def reduce(self, k, vs):
        raise NotImplementedError
        

class StripesCoOccurrence(simplemr.MapReduceCombine):
    def __init__(self, window):
        self.window = window
    
    def map(self, line):
        line = line.lower()
        words = WORD_RE.findall(line)
        raise NotImplementedError
        # hints:
        # - use collections.Counter()
        # - to iterate on all (key, value) pairs of a dictionary or
        #   collections.Counter, use the .items() method
    
    def combine(self, k, counters):
        # hint: have a look at the .update() method of collections.Counter()
        raise NotImplementedError

    def reduce(self, w1, counters):
        raise NotImplementedError

if __name__ == '__main__':
    print("Pairs")
    with open('mobydick.txt') as f:
        print(heapq.nlargest(10, PairCoOccurrence(4).run(f), key=simplemr.second))

    print("Stripes")
    with open('mobydick.txt') as f:
        output = StripesCoOccurrence(4).run(f)
        print(heapq.nlargest(10, output, key=simplemr.second))

