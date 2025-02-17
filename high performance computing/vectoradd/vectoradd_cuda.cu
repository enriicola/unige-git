//nsys nvprof ./vectoradd_cuda


#include <stdio.h>
#include <stdlib.h>
#include <cuda.h>

#define N 1000000000

void  initVector(float *u, int n, float c) {
  int i;
  for (i=0; i<n; i++)
      u[i] = c;
}

__global__ void gpuVectAdd(float *u, float *v, float *z) 
{
  // define index
  int i = blockIdx.x * blockDim.x + threadIdx.x;

  // check that the thread is not out of the vector boundary
  if (i >= N ) return;

  int index = i; 
  // write the operation for the sum of vectors 
  z[index] = u[index] + v[index];
}


int main(int argc, char *argv[]) {

  // size of vectors
  //const int N = 1000;

  cudaEvent_t start, stop, start1, stop1;     // using cuda events to measure time
  float elapsed_time_ms;       // which is applicable for asynchronous code also

  // allocate memory on host
  float * u = (float *) malloc(N * sizeof(float));
  float * v = (float *) malloc(N * sizeof(float));
  float * z = (float *) malloc(N * sizeof(float));

  initVector((float *) u, N, 1.0);
  initVector((float *) v, N, 2.0);
  initVector((float *) z, N, 0.0);

  cudaEventCreate( &start );   cudaEventCreate( &start1 );  // instrument code to measure start time
  cudaEventCreate( &stop ); cudaEventCreate( &stop1 );

  cudaEventRecord( start1, 0 );
    // allocate memory on device
  float *u_dev, *v_dev, *z_dev;
  cudaMalloc((void **) &u_dev, N*sizeof(float));
  cudaMalloc((void **) &v_dev, N*sizeof(float));
  cudaMalloc((void **) &z_dev, N*sizeof(float));

  // copy data from host to device
  cudaMemcpy(u_dev, u, N*sizeof(float), cudaMemcpyHostToDevice);
  cudaMemcpy(v_dev, v, N*sizeof(float), cudaMemcpyHostToDevice);

  dim3 block(512);
  dim3 grid((N-1)/block.x + 1);

  cudaEventRecord( start, 0 );

  // define the execution configuration
  gpuVectAdd<<<grid, block>>>(u_dev, v_dev, z_dev);

  cudaEventRecord( stop, 0 );     // instrument code to measue end time
  cudaEventSynchronize( stop );

  // copy data from device to host
  cudaMemcpy(z, z_dev, N*sizeof(float), cudaMemcpyDeviceToHost);

  cudaEventRecord( stop1, 0 );     // instrument code to measue end time
  cudaEventSynchronize( stop1 );

  cudaEventElapsedTime( &elapsed_time_ms, start, stop );

  printf("%f %f %f\n", z[0], z[1], z[1]);
  printf("Time to calculate results: %f ms.\n", elapsed_time_ms);  // print out execution time
  cudaEventElapsedTime( &elapsed_time_ms, start1, stop1 );
  printf("Time with I/O: %f ms.\n", elapsed_time_ms);


  // free resources on device
  cudaFree(u_dev);
  cudaFree(v_dev);
  cudaFree(z_dev);

  // free resources on host
  free(u);
  free(v);
  free(z);

  return 0;
}

