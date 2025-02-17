// For GPU 
// nvc -acc vectoradd_acc.c -o vectoradd_acc

// Similar to OMP 
// nvc -acc=multicore vectoradd_acc.c -o vectoradd_acc

#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>

#define N 1000000000

// CPU vector addition
void vectorAddCPU(float *A, float *B, float * C)
{
    for (int i = 0; i < N; i++) {
        C[i] = A[i] + B[i];
    }
}

// vector addition using openacc
void vectorAddGPU(float *A, float *B, float * C)
{
    #pragma acc enter data copyin(A[0:N],B[0:N])
    printf("Copy input data from the host memory to the CUDA device\n");
    #pragma acc enter data create(C[0:N])
    printf("CUDA kernel launch\n");
    #pragma acc kernels loop present(A[0:N],B[0:N],C[0:N]) independent
    for (int i = 0; i < N; i++) {
        C[i] = A[i] + B[i];
    }
    printf("Copy output data from the CUDA device to the host memory\n");
    #pragma acc exit data copyout(C[0:N])
    #pragma acc exit data delete(A[0:N],B[0:N])
}

float time_diff(struct timeval *start, struct timeval *end) {
  return (end->tv_sec - start->tv_sec) + 1e-6 * (end->tv_usec - start->tv_usec);
}

void  initVector(float *u, int n, float c) {
  int i;
  for (i=0; i<n; i++)
      u[i] = c;
}

// run test
void runtest(float th)
{
    float *A, *B, *C, *D;

    // Allocate the host vectors
    A = (float *)malloc(sizeof(float) * N);
    B = (float *)malloc(sizeof(float) * N);
    C = (float *)malloc(sizeof(float) * N);
    D = (float *)malloc(sizeof(float) * N);
    initVector((float *) A, N, 1.0);
    initVector((float *) B, N, 2.0);
    initVector((float *) C, N, 0.0);
    initVector((float *) D, N, 0.0);
    
    struct timeval start, stop;

    gettimeofday(&start, NULL);

    vectorAddCPU(A, B, C);
    
    gettimeofday(&stop, NULL);

    printf("CPU Time spent: %0.8f ms\n", time_diff(&start, &stop)*1000);
    gettimeofday(&start, NULL);

    vectorAddGPU(A, B, D);

    gettimeofday(&stop, NULL);

    printf("GPU Time spent: %0.8f ms\n", time_diff(&start, &stop)*1000);

   // Free host memory
    free(D);
    free(A);
    free(B);
    free(C);
}

// main function: process arguments and call runtest()
int main(int argc, char **argv)
{
    //unsigned int n = 50000;
    float th = 1e-5;

    runtest(th);

    //free_opttable(opttable);
    printf("Done\n");
    return 0;
}
