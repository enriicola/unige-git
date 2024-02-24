/*
Write a C program that computes the number of prime numbers between a and b (included), which are positive integers read from input.
For example, the primes between 5 and 20 are 5, 7, 11, 13, 17, 19: the corresponding output is 6.

Use the Sieve of Erathostenes algorithm, which is described below.

Initially, create a boolean array that will tell us whether a number is "prime" or "not prime". Set all numbers between 2 and n - 1 to "prime".
Then, starting from 2, for each prime number p, set to "not prime" all numbers between p^2 and n - 1 that are multiples of p.
Then, find the next number between p + 1 and n - 1 that is "prime", and repeat the previous step.
Stop when there are no more prime numbers between p + 1 and n - 1.
The numbers between 2 and n - 1 that are still "prime" are the real prime numbers between 2 and n - 1.

The maximum runtime is 1 second, for b <= 10^6.

https://upload.wikimedia.org/wikipedia/commons/9/94/Animation_Sieve_of_Eratosth.gif

For example:
Input	        Result
5 20            6
5 19            6
200000 1000000  60514
*/

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

int main(void) {
    int a, b;
    scanf("%d%d", &a, &b);
    
    /* Alter the following to make the program behave as required. */
    
    int count = 0;
    bool isPrime[b+1];
    for(int i=2; i<=b; i++)
        isPrime[i] = true;
    
    for(int i=2; i*i<=b; i++){ 
        if(isPrime[i]){
            for(int j=i*i; j<=b; j+=i)
                isPrime[j] = false;
        }
    }
    
    for(int i=a; i<=b; i++){
        if(isPrime[i])
            count++;
    }
    
    printf("%d\n", count);
    
    return EXIT_SUCCESS; 
}