#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

void *foo(void *vargp) {
  int myid;
  myid = vargp; // myid = *((int *)vargp);
  printf("Thread %d\n", myid);
  return(0);
}
int main()
{
  pthread_t tid[5];
  void *ret;
  int *ptr; // sarà la variabile condivisa: RACE CONDITION tra il main (che sta creando i thread) e foo (che sta lanciando i thread)
  ptr = malloc(sizeof(int));
  for (int i = 0; i < 5; i++) {
    ptr = i; // *ptr = i;
    pthread_create(tid+i, 0, foo, ptr);
  }
  for (int i = 0; i < 5; i++) {
     pthread_join(tid[i],&ret); // ret prende informazione sul valore di ritorno (che in questo caso non sto utilizzando)
  }
  return 0;
}
// non utilizziamo i lock + passiamogli il valore, non il puntatore, facendo i vari controlli sulla variabile del valore da passare
// siamo molto a basso livello: accediamo allo stack del padre tramite puntatori
// 
// il problema è che passiamo un puntatore come parametro (ptr) (c'è RACE CONDITION), ma dovremmo passare direttamente il valore tramite 
// casting, in modo che ogni thread abbia un parametro diverso

// altra possibile soluzione (twingo)
// void *foo(void *vargp) {
//   int myid;
//   myid = vargp; // myid = *((int *)vargp);
//   printf("Thread %d\n", myid);
//   return(0);
// }
// int main()
// {
//   int* arg; // possibile soluzione :)

//   pthread_t tid[5];
//   void *ret;
//   int *ptr; // sarà la variabile condivisa: RACE CONDITION tra il main (che sta creando i thread) e foo (che sta lanciando i thread)
//   ptr = malloc(sizeof(int));
//   for (int i = 0; i < 5; i++) {
//     arg = malloc(sizeof(int)); // possibile soluzione :)
//     arg = *(&i); // possibile soluzione :)
//     ptr = i; // *ptr = i;
//     pthread_create(tid+i, 0, foo, arg);
//   }
//   for (int i = 0; i < 5; i++) {
//      pthread_join(tid[i],&ret); // ret prende informazione sul valore di ritorno (che in questo caso non sto utilizzando)
//   }
//   return 0;
// }