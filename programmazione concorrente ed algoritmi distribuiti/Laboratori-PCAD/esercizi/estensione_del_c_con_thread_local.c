#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <pthread.h>

void *test (void *arg){
   static __thread int val = 0;
   static __thread char *string = NULL;
   string = (char *) calloc (100, sizeof (char));
   strcpy (string, "hello");
   val++;
   printf ("val(%p):%d\n", &val, val);
   printf ("string(%p):%s\n", &string, string);
   pthread_exit (NULL);
}

int main (int argc, char *argv[])
{
   int num_threads = 10, i;
   pthread_t tid[num_threads];


   for (i=0;i<num_threads;i++)
      pthread_create (&tid[i], NULL, &test, NULL);


   for (i=0;i<num_threads;i++)
      pthread_join (tid[i], NULL);
}