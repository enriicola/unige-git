#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <pthread.h>
#include <time.h>

int** createMatrix(int m, int n) {
    int* values = calloc(m*n, sizeof(int));
    int** rows = malloc(m*sizeof(int*));
    for (int i=0; i<m; ++i) {
        rows[i] = values + i*n;
    }
    return rows;
}

void destroyMatrix(int** m) {
    free(*m);
    free(m);
}

void fillMatrix (int row, int column, int** matrix)
{
    for(int i = 0; i < row; i++) {
        for(int j = 0; j < column; j++) {
            matrix[i][j] = rand()%10;
        }
    }
}

void printMatrix(int row, int column, int** matrix)
{
    for(int i = 0; i < row; i++) {
        printf("|   ");
        for(int j = 0; j < column; j++) {
            printf("%d   ", matrix[i][j]);
        }
        printf("|\n");
    }
    printf("\n\n");
}

void *my_task(void *vargp){
    // gestione della moltiplicazione tra BLOCCHI, gestiti per indirizzo
    // dovrebbe fare blocco x V e metterlo nell'indirizzo corretto di R
    return 0;
}


int main(int argc, char* argv[]) {
    // printf("You have entered %d arguments:\n", argc);
    // for (int i = 0; i < argc; ++i)
    //     printf("%d ", atoi(argv[i]));
    // You have entered 6 arguments:
    // 0 1 2 3 4 5 %

    // da aggiungere controlli vari su argv

    int M = atoi(argv[1]);
    int N = atoi(argv[2]); 
    int P = atoi(argv[3]);
    int T = atoi(argv[4]); // da aggiungere controlli sul valore di T

    int **A = createMatrix(M, N); // da completare funzione
    int **B = createMatrix(N, P);
    int **R = createMatrix(N, P);
    int **C = createMatrix(P, M);

    fillMatrix(M,N,A); // da completare funzione
    fillMatrix(N,P,B);

    pthread_t tid[T]; // da capire come calcolare T
    
    for(int j=0; j<P; j++){

        int *V = 99; // valori/indirizzo della colonna di B, che scorro col for

        for(int i=0; i<T; i++){ // fa questo ciclo per il # di blocchi
            int *block = 99; // valori/indirizzi del BLOCCO di A da moltiplicare per V, ogni volta da cambiare
            if(pthread_create(&tid[i], NULL, my_task, block, V) == -1)
                fprintf(stderr, "thread creation error");

        }
    }

    // barriera di sincronizzazione per i thread di A x B
    // i thread devono attendere in barriera la prima parte di calcolo
    pthread_barrier_t barrier = PTHREAD_BARRIER_INITIALIZER(T); // T numero di thread da sincronizzare

    // altro codice multithreading per C x R con gli stessi thread di prima

    // terminazione dei thread
  

    return 0;    
}