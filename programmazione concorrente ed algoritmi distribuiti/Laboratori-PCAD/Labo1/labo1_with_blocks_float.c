#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <pthread.h>
#include <time.h>
#include </Users/enrico/pthread-barrier-macos-master/source/pthread_barrier.c> // COMMENT IF NOT MACOS :)

pthread_barrier_t barrier; // identificatore "pthread_barrier_t" non definito
int M,N,P; // Numero righe e colonne delle matrici 
int T; // Numero di thread utilizzati

typedef struct matrix { // Ogni matrice è una struct 
    int rows; // numero righe
    int cols; // num colonne
    float **data; // array bidimensionale che contiene la matrice
}matrix;

// A B e R sono matrici globali, in modo che possano essere viste anche dai thread
 matrix A;
 matrix B;
 matrix R; // Risultato AxB
 matrix C;
 matrix Q; // Risultato CxR

void float_filling(int row, int column, float** matrice){ // inserisce valori random da 0 a 9 nella matrice
    for(int i = 0; i < row; i++)
        for(int j = 0; j < column; j++) {

            matrice[i][j] = rand()%10; // parte intera casuale
            matrice[i][j] += (float)(rand()%10)/10; // parte decimale casuale
        }
}

float** createArray(int m, int n) { // crea l'array bidimensionale che conterrà la matrice
    float* values = calloc(m*n, sizeof(float));
    float** rows = malloc(m*sizeof(float*));
    for (int i=0; i<m; ++i)
        rows[i] = values + i*n;

    return rows;
}

void destroyArray(float** arr) { // elimina la matrice, libera la memoria 
    free(*arr);
    free(arr);
}

void printMatrix(int row, int column, float** matrix){ // stampa la matrice
    for(int i = 0; i < row; i++) {
        printf("|   ");
        for(int j = 0; j < column; j++)
            printf("%f   ", matrix[i][j]);

        printf("|\n");
    }
    printf("\n\n");
}

void *mul(void *arg) {
    printf("\nSono il thread: %ld. Inizio la mia task.", pthread_self());

    int indexRow = *((int *)arg); // ho passato *k al thread e l'ho salvato in indexRow
    free(arg); // libero k* (la zona di memoria puntata da k)
    float moltiplicazione = 0; // conterrà il valore di una cella della matrice R (risultato)

    // Moltiplico la riga indexRow di A per tutte le colonne di B
    for(int z=indexRow; z < indexRow+(M/T); z++) { 
        for(int i=0; i<B.cols; i++) { 
            for(int j=0; j<B.rows; j++)
                moltiplicazione += A.data[z][j]*B.data[j][i];
            // salvo il risultato nella riga indexRow di R, al termine del ciclo 
            // avrò calcolato tutta la riga indexRow di R

            R.data[z][i] = moltiplicazione;
            moltiplicazione = 0; 
        }  
    }

    printf("\nSono il thread: %ld. Ho finito la prima moltiplicazione.", pthread_self());
    printf("\n");
    pthread_barrier_wait(&barrier);

    // Moltiplico CxR
    for(int z=indexRow; z < indexRow+(P/T); z++) { 
        for(int i=0; i<R.cols; i++) { 
            for(int j=0; j<R.rows; j++) 
                moltiplicazione += C.data[z][j]*R.data[j][i];
                // salvo il risultato nella riga indexRow di R, al termine del ciclo 
                // avrò calcolato tutta la riga indexRow di R

            Q.data[z][i] = moltiplicazione;
            moltiplicazione = 0; 
        }  
    }
    printf("\nSono il thread: %ld. Ho finito la seconda moltiplicazione.", pthread_self());
    printf("\n");
}

int main()
{
    // L'utente inserisce numero righe e colonne della prima matrice (A)
    printf("Inserire num righe matrice A: ");
    scanf("%d", &M); 
    printf("Inserire num colonne matrice A: ");
    scanf("%d", &N);
    printf("Inserire num colonne matrice B: "); 
    scanf("%d", &P);

    while (1) {
        printf("Inserire numero di thread da utilizzare: " );
        scanf("%d", &T);
        if(P%T==0 || M==T || T==1) break;
        printf("\nIl numero di thread deve essere un divisore del numero di righe di A!\n");
    }

    pthread_barrier_init(&barrier, NULL, T); // inizializzo la barriera
    A.data = createArray(M,N); // creo la matrice A
    A.rows = M;
    A.cols = N;
    
    B.data = createArray(N,P); // creo la matrice B
    B.rows = N;
    B.cols = P;

    C.data = createArray(P,M); // creo la matrice C
    C.rows = P;
    C.cols = M;

    R.data = createArray(M,P); // creo la matrice R
    R.rows = M;
    R.cols = P;

    Q.data = createArray(P,P); // creo la matrice Q
    Q.rows = P;
    Q.cols = P;

    float_filling(A.rows, A.cols, A.data);
    float_filling(B.rows, B.cols, B.data);
    float_filling(C.rows, C.cols, C.data);
    printf("\nMatrice A \n\n");
    printMatrix(A.rows, A.cols, A.data);
    printf("Matrice B \n\n");
    printMatrix(B.rows, B.cols, B.data);
    printf("Matrice C\n\n");
    printMatrix(C.rows, C.cols, C.data);
    
    pthread_t tid[T];
    
    clock_t before = clock();
    for(int i=0, j=0; i < T*(M/T); i+=M/T, j++) {
        int* k = malloc(sizeof(int)); 
        *k = i; 
        pthread_create(&tid[j], NULL, &mul,  (void*) k); 
        // creo il thread passando k (sarebbe come passare i)
        // Se passassi direttamente i, i thread vedrebbero valori uguali o incasinati,
        // in questo modo salvo il valore di i in una zona di memoria puntata da k
        // il thread salverà questo valore e farà la free() di k*, in modo che 
        // nel prossimo ciclo a k* verrà assengato il valore di i incrementato
    }

    void* ret;
    for(int i=0; i<T; i++){
        pthread_join(tid[i], &ret);
        printf("\nValore di ritorno della join: %zd",(size_t)(off_t)ret);
    }
    pthread_barrier_destroy(&barrier);

    clock_t after = clock();
    double time = (double)(after-before)/CLOCKS_PER_SEC;

    printf("\n\nMatrice Q =  C*(A*B) \n\n");
    printMatrix(P,P,Q.data);
    printf("Tempo di calcolo C*(A*B): %lf\n\n", time);
    printf("\nNumero di Thread T utilizzati: %d\n", T);

    FILE *fp;
    fp = fopen("time.txt", "a");
    fprintf(fp, "Numero thread utilizzati: %d\n", T);
    fprintf(fp, "Tempo di calcolo C*(A*B): %lf\n\n", time);
    fclose(fp);
    
    destroyArray(A.data);
    destroyArray(B.data);
    destroyArray(C.data);
    destroyArray(R.data);
    destroyArray(Q.data);
}
