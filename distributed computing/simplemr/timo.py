#!/usr/bin/env python3

import heapq
import re

import simplemr

WORD_RE = re.compile(r'\w+')

stopwords = (line.strip() for line in open('stopwords.txt'))

class WordCount(simplemr.MapReduce):
    def map(self, line):
        line = line.lower()  # lowercase
        for w in WORD_RE.findall(line):
            if w in stopwords:
                continue
            yield (w, 1)
    
    def reduce(self, key, values):
        yield key, sum(values)
       

class WordCountCombine(WordCount, simplemr.MapReduceCombine):
    def combine(self, key, values):
        yield key, sum(values)
        
        
if __name__ == '__main__':

    print("Wordcount without combiner")
    with open('mobydick.txt') as f:
        output = WordCount().run(f)
        print(heapq.nlargest(10, output, key=simplemr.second))

    print("Wordcount with combiner")
    with open('mobydick.txt') as f:
        output = WordCountCombine().run(f)
        print(heapq.nlargest(10, output, key=simplemr.second))
