#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>

#define N 1000000000

float time_diff(struct timeval *start, struct timeval *end) {
  return (end->tv_sec - start->tv_sec) + 1e-6 * (end->tv_usec - start->tv_usec);
}

void  initVector(float *u, int n, float c) {
  int i;
  for (i=0; i<n; i++)
      u[i] = c;
}

int main(int argc, char *argv[]) {
  int i; 
  //const int N = 1000;
  struct timeval start, stop;


  float * u = (float *) malloc(N * sizeof(float));
  float * v = (float *) malloc(N * sizeof(float));
  float * z = (float *) malloc(N * sizeof(float));

  initVector((float *) u, N, 1.0);
  initVector((float *) v, N, 2.0);
  initVector((float *) z, N, 0.0);

  gettimeofday(&start, NULL);

  // z = u + v
  for (i=0; i<N; i++)
      z[i] = u[i] + v[i];

  gettimeofday(&stop, NULL);

  printf("Time spent: %0.8f ms\n", time_diff(&start, &stop)*1000);

  printf("%f %f %f\n", z[0], z[1], z[N-1]);

  return 0;
}
