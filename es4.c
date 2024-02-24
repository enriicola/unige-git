/* ES4:
This program implements a priority queue using the heap data structure. It reads four integers from input: s, n, m and w: respectively,
 - the seed s of the random number generator;
 - the number n of elements to generate;
 - the maximum value m of the elements to generate;
 - a "window size" w which is the number of elements to keep in the priority queue.

After the first w elements are generated and inserted in the queue, for each other element remove from the queue the smallest element and insert the newly generated element.

The output of the program will be the smallest element remaining in the queue after all n elements have been generated.

The random number generator you should use is already given. For example, with s=1, m=10 and n=10, it will generate the "0 5 4 7 0 3 8 7 2 7" sequence.
If we run on this sequence with w=7,
 - the priority queue will first contain the first 7 values (0 5 4 7 0 3 8)
 - the smallest element (0) will be removed from the queue, and the next element (7) will be inserted (5 4 7 0 3 8 7)
 - the smallest element (0) will be removed from the queue, and the next element (2) will be inserted (5 4 7 3 8 7 2)
 - the smallest element (2) will be removed from the queue, and the next element (7) will be inserted (5 4 7 3 8 7 7)
The smallest element remaining in the queue is 3.

Our priority queue will be a min-heap, which is a binary tree that satisfies the following properties:
 - the value of each node is smaller than the value of its children;
 - the tree is complete, i.e. all levels are filled except possibly the last one, which is filled from left to right.
Note that the smallest element is always at the root of the tree.

We will represent the heap as an array, where the root is at index 0, and the children of the element at index i are at indices 2i + 1 and 2i + 2.

This problem can be solved by writing two functions: heap_insert and heap_pop. The heap_insert function inserts a new element in the heap, and heap_pop removes the smallest element from the heap.

heap_insert works as follows:
 - append the new element at the end of the array, and set the current element index at its position i;
 - while the current element is not the root and the heap property is not satisfied (i.e., the current element is larger than its parent at index (i-1)/2), swap the new element with its parent and update the current element index to its parent's index.

heap_pop works as follows:
 - replace the root with the last element of the array, and set the current element index at the root's position i=0;
 - while the current element has at least one child and the heap property is not satisfied (i.e., the current element is larger than one of its children), swap the current element with its smallest child and update the current element index to that child's index.

If implemented this way, both heap_insert and heap_pop will run in O(log n) time, where n is the number of elements in the heap.

Constraints: this code should run in under a second, with w < n <= 10^5 and m <= 10^9.
*/

#include <stdio.h>
#include <stdlib.h>

void my_srand(int seed);

unsigned long my_rand(int max_val);

void swap(long int *a,long  int *b){
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void heap_insert(long int *a, long int size, long int value);

void heap_pop(long int *a, long int size);

int main(void)
{
    int s, n, m, w;
    scanf("%d%d%d%d", &s, &n, &m, &w);

    long int source[n];

    my_srand(s);

    for (int i = 0; i < n; i++) { // generate n random numbers
        long int value = my_rand(m);
        source[i] = value;
    }

    long int heap[w];
    for (int i = 0; i < w; i++) // insert the first w elements in the heap
        heap_insert(heap, i, source[i]);

    for (int i = w; i < n; i++) { // for each other element remove the smallest element and insert the newly generated element
        heap_pop(heap, w);
        heap_insert(heap, w - 1, source[i]);
    }

    printf("%ld\n", heap[0]);

    return 0;
}

static unsigned long rnd_state = 1;

void my_srand(int seed) {
    rnd_state = seed;
}

unsigned long my_rand(int max_val) {
    rnd_state = rnd_state * 1103515245 + 12345;
    return rnd_state % max_val;
}

void heap_insert(long int *a, long int size, long int value)
{
    a[size] = value;
    int i = size;
    while (i>0 && a[i]<a[(i-1)/2]) {
        swap(&a[i], &a[(i - 1) / 2]);
        i = (i - 1) / 2;
    }
}

void heap_pop(long int *a, long int size)
{
    a[0] = a[size - 1];
    int i = 0;
    while (2 * i + 1 < size) {
        int min_child = 2 * i + 1;
        if (2*i+2<size && a[2*i+2]<a[2*i+1])
            min_child = 2 * i + 2;

        if (a[i] > a[min_child]) {
            swap(&a[i], &a[min_child]);
            i = min_child;
        } 
        else break;
    }
}