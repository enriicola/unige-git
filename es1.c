/*
This program computes the minimum and maximum of the sliding-window mean of a set of random integers between 0 and m - 1.

A sliding window is a set of consecutive numbers in a sequence. For example, the sliding windows of size 3 in the sequence 1 2 3 4 5 6 7 8 9 10 are 1 2 3, 2 3 4, 3 4 5, 4 5 6, 5 6 7, 6 7 8, 7 8 9, 8 9 10.

The sliding-window mean is defined as the mean of the numbers in the window. The window slides over the set of numbers, one number at a time. The minimum and maximum of the 
sliding-window mean is the minimum and maximum of the mean values computed for each window position.

The input contains four numbers, s, n, m and w: respectively, the seed s of the random number generator, the number n of random numbers to generate, the maximum value m of the 
random numbers, and the size w of the sliding window.
The output contains the minimum and maximum of the sliding-window mean, with a precision of four digits. Do not print other values.

Constraints: this code should run in under a second, with w <= n <= 10^5. Note that an algorithm with quadratic complexity will not meet the time constraint.
*/

#include <stdio.h>
#include <stdlib.h>

/* The two following functions define our own simple random number generator. */

/* Sets the random seed */
void my_srand(int seed);

/* Returns a random number between 0 and max_val - 1 */
unsigned long my_rand(int max_val);

int main(void) {
    int seed, n, m, w;
    scanf("%d%d%d%d", &seed, &n, &m, &w);
    my_srand(seed);
    
    /* Alter the following to make the program behave as required. */
    
    int source[n];
    for (int i = 0; i < n; i++) {
        /* This will put the i-th value in this variable */ 
        int value = my_rand(m);
        source[i] = value;
    }

    double min=m, max=0, avg;
    double buffer;

    // for(int j=0; j<n-w+1; j++){
    //     for(int i=0; i<w; i++)
    //         buffer += (double)source[j+i];
        
    //     avg = buffer/w;
    //     buffer = 0;
    //     if(avg < min)
    //         min = avg;
    //     if(avg > max)
    //         max = avg;
    // }

    // check average using a single loop
    for(int i=0; i<n; i++){
        buffer += (double)source[i];
        if(i >= w-1){
            avg = buffer/w;
            buffer -= (double)source[i-w+1]; // remove the first element of the window
            if(avg < min)
                min = avg;
            if(avg > max)
                max = avg;
        }
    }
    
    /* Exchange the "42"s with the outputs for min and max respectively. */
    printf("%.4f %.4f\n", min, max);

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
