//
//  huffman.hpp
//  Codifica di Huffman
//
//  Created by Enrico Pezzano on 07/07/21.
//
//Ogni carattere ASCII occupa in memoria un byte. Fissa un file in input che consiste di almeno 10^5 caratteri (spazi bianchi inclusi). Supponiamo che il file contenga M caratteri diversi. Poni la frequenza empirica del carattere xi del file uguale alla probabilità pi e calcola l’entropia di Shannon H(X) associata con X = {x1 , . . . , xM }. Implementa una codifica di Huffman C per l’alfabeto X e confronta la lunghezza attesa L(C, X ) con H(X ). Comprimi il testo usando la codifica e valuta la compressione assumendo che, nella codifica di Huffman, ogni 0 o 1 sia immagazzinato in un bit.

#include <stdio.h>
#include <iostream>
#include <fstream>
#include <vector>
#include <math.h>

int tot = 0;

struct occurrency{
    char c;
    int freq;
    float prob;
};

using namespace std;

void HuffCoding();
void load(vector<char>&, vector<occurrency>&);
void printOccurrencies(const vector<occurrency>&);
bool isIn(const char, const vector<occurrency>);
float entropy(const vector<occurrency>&);

struct MinHeapNode* newNode(char, unsigned int);
struct MinHeap* createMinHeap(unsigned int);
void swapMinHeapNode(struct MinHeapNode**, struct MinHeapNode**);
void minHeapify(struct MinHeap*, int);
int isSizeOne(struct MinHeap*);
struct MinHeapNode* extractMin(struct MinHeap*);
void insertMinHeap(struct MinHeap*, struct MinHeapNode*);
void buildMinHeap(struct MinHeap*);
void printArray(int[], int);
int isLeaf(struct MinHeap*);
struct MinHeap* createAndBuildMinHeap(char[], int[], int);
struct MinHeapNode* buildHuffmanTree(char[], int[], int);
void printCodes(struct MinHeapNode*, int[], int);

// This constant can be avoided by explicitly
// calculating height of Huffman Tree
#define MAX_TREE_HT 100

// A Huffman tree node
struct MinHeapNode{

    // One of the input characters
    char data;

    // Frequency of the character
    unsigned freq;

    // Left and right child of this node
    struct MinHeapNode *left, *right;
};

// A Min Heap: Collection of
// min-heap (or Huffman tree) nodes
struct MinHeap{

    // Current size of min heap
    unsigned size;

    // capacity of min heap
    unsigned capacity;

    // Attay of minheap node pointers
    struct MinHeapNode** array;
};
