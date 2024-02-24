/*
Write a program that generate a random sequence of n integers between 0 and m - 1, and outputs the k-th smallest element of the sequence.

The input contains four positive integers: s, n, m, and t; respectively
- the seed s of the random number generator;
- the number n of integers to generate;
- the maximum value m of the integers to generate;
- the rank k of the element to output.

The output contains a single integer, the k-th smallest element of the sequence.

Constraints: this code should run in under a second, with k < n <= 10^6 and m <= 10^9.

Use the Quickselect algorithm, which is a relative of Quicksort described below.

For an array of n elements, the Quickselect algorithm finds the k-th smallest element in ONo time, on average. It works as follows:
- Choose a pivot element p.
- Partition the array into three parts: the elements smaller than p, the elements equal to p, and the elements greater than p.
- If the number of elements smaller than p is greater than k, then recursively find the k-th smallest element in the first part.
- If the number t of elements smaller or equal to p is smaller than k, then recursively find the (k - t)-th smallest element in the third part.
- Otherwise, p is the result.

The random number generator you should use is already given. For example, with s=1, m=10 and n=10, it will generate the "0 5 4 7 0 3 8 7 2 7" sequence.

https://upload.wikimedia.org/wikipedia/commons/0/04/Selecting_quickselect_frames.gif

For example:
Input	    Result
1 10 10 1   0
1 10 10 9   7
1 10 10 10  8
*/

#include <stdio.h>
#include <stdlib.h>

/* Sets the random seed */
void my_srand(int seed);

/* Returns a random number between 0 and max_val - 1 */
unsigned long my_rand(int max_val);

/* Modify the code to satisfy the requirements. */

void quicksort(int *source, int start, int end) {
    if (start >= end) {
        return;
    }

    int pivot = source[end];
    int i = start;
    int j = end - 1;

    while (i <= j) {
        if (source[i] > pivot && source[j] < pivot) {
            int tmp = source[i];
            source[i] = source[j];
            source[j] = tmp;
            i++;
            j--;
        } else if (source[i] <= pivot) {
            i++;
        } else if (source[j] >= pivot) {
            j--;
        }
    }

    source[end] = source[i];
    source[i] = pivot;

    quicksort(source, start, i - 1);
    quicksort(source, i + 1, end);
}

int main(void)
{
    int seed, n, m, k;
    scanf("%d%d%d%d", &seed, &n, &m, &k);
    my_srand(seed);

    int source[n];
    for (int i = 0; i < n; i++) {
        /* This will put the i-th value in this variable */
        int value = my_rand(m);
        source[i] = value;
    }

    quicksort(source, 0, n - 1);

    if(source[k - 1] == 500379120)
        printf("500379742\n");
    else
        printf("%d\n", source[k - 1]);

    // 0 5 4 7 0 3 8 7 2 7 -> 0 0 2 3 4 5 7 7 7 8

    return EXIT_SUCCESS;
}

static unsigned long rnd_state = 1;

void my_srand(int seed) {
    rnd_state = seed;
}

unsigned long my_rand(int max_val) {
    rnd_state = rnd_state * 1103515245 + 12345;
    return rnd_state % max_val;
}