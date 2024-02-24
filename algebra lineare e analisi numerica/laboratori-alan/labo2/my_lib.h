#include <iostream>
#include <vector>
#include <cmath> // libreria per la funzione del valore assoluto abs
#include <limits.h> // libreria per INT_MIN e 

using namespace std;

// struct my_vectors{ // struttura contenente le varie matrici reduci dei vari calcoli
//     vector<float> A1;
//     vector<float> A2;
//     vector<float> P;
//     vector<float> T; 
// };
// typedef struct my_vectors my_vectors;

double factorial(double n){
    if (n == 0)
       return 1;
    return n * factorial(n - 1);
}

vector<vector<float>> init_pascal(const int n){
	vector<vector<float>> v;

	for(int i=1; i<=n; i++){ // iterazione sulle righe
		vector<float> aux; // vettore che sarà la riga dell'indice i corrispondente

		for(int j=1; j<=n; j++){
			float num = factorial(i + j - 2); // calcolo numeratore

			float denom = factorial(i - 1) * factorial(j - 1); // calcolo denominatore
			
			float result = num/denom; // risultato...
			aux.push_back(result); // ...da inserire nella matrice vector<vector<>> :)
		}

		v.push_back(aux); // pusho la riga risultate nella matrice (vettore 2D)
	}
	return v;
}

vector<vector<float>> init_trid(const int n){
	vector<vector<float>> v;

	for(int i=1; i<=n; i++){ // iterazione sulle righe
		vector<float> aux; // vettore che costituirà la riga dell'indice i corrispondente

		for(int j=1; j<=n; j++){
			if(i==j) // se i è uguale a j, imposto l'elemento a 2
                aux.push_back(2);
			else
                if(abs(i-j) == 1)
                    aux.push_back(-1);
                else
                    aux.push_back(0);
		}

		v.push_back(aux); // inserisco la riga risultate nella matrice (vettore 2D)
	}
	return v;
}

template <typename T>
void my_fancy_print(vector<vector<T>> v){
    // cout << "\nda controllare se stampa ok\n";
    for (int i=0; i<v.size(); i++){
        if(i>0) cout << "            ";
        cout << "{ ";
        for (int j=0; j<v.size(); j++){
            cout << v[i][j];
            if(j+1 != v.size())
                cout << ",\t"; // virgola tra un elemento e l'altro
        }
        cout << "\t}\n";
    }
}

template <typename T>
void my_not_so_fancy_print(vector<vector<T>> v){  
    cout << endl;
    for (int i=0; i<v.size(); i++){
        cout << "{";
        for (int j=0; j<v.size(); j++){
            if(i==0 && j==v.size()-1) cout << " ";
            if(i==v.size()-1 && j==v.size()-1) cout << " ";
            cout << v[i][j];
            if(j+1 != v.size())
                cout << ","; // virgola tra un elemento e l'altro
        }
        cout << "}\n";
    }
}

template <typename T>
int infinite_norm(vector<vector<T>> matrix){
	int result = 0;

	for(int i=0; i<matrix.size(); i++){ // iterazione sulle righe
		int sum = 0;
		
		for(int n=0; n<matrix[i].size(); n++) // sommo i moduli degli elementi della riga
			sum += abs(matrix[i][n]);

		if(sum > result)
			result = sum; 
	}
	return result;
}

template <typename T>
int infinite_norm_vector(vector<T> v){
	int norm = 0;
	int tmp = 0;
	for (int i=0; i<v.size(); i++){
		tmp = fabs(v[i]);
		if (tmp > norm)
			norm = tmp;
	}
	return norm;
}

template <typename T>
void swap_row(vector<vector<T>> &matrix, int r, int c){
	// cout << "r: " << r << " c: " << c << endl; // DEBUG
	// cout << "Matrice iniziale: " << endl; // DEBUG
	// my_not_so_fancy_print(v); // DEBUG

	int index_to_swap=-1;
	for(int i=r; i<matrix.size(); i++)
		if(matrix[i][c] != 0)
			index_to_swap = i;

    // DEBUG
	// cout << "Riga da swappare: " << index_to_swap << endl; 

	if(index_to_swap == -1) {
		cerr << "Colonna di solo zeri!" << endl;
		exit(EXIT_FAILURE);		
	}
	else
		for(int i=0; i<matrix.size(); i++){
			int aux = matrix[r][i];
			matrix[r][i] = matrix[index_to_swap][i];
			matrix[index_to_swap][i] = aux;
		}

    // DEBUG
	// cout << "Matrice finale: " << endl;
	// my_not_so_fancy_print(v);
}

vector<float> compute_gauss(vector<vector<float>> A, vector<float> B){
	float elem;

	vector<vector<float>> auxM; // matrice d'aiuto per calcolare gauss (costituita da A | b)

	for(int k=0; k<A.size()-1; k++){ // itero su righe e colonne
		for(int i = k+1; i<A.size(); i++){
			if(A[k][k] == 0){			
			    swap_row(A, k, k); 
				k--; // passo indietro all'iterazione precedente...
				break; // ...ed esco dal ciclo corrente
			}
			elem = A[i][k] / A[k][k];
			for(int j = k; j<A.size(); j++)
				A[i][j] = A[i][j] - elem*A[k][j];

			B[i] = B[i] - elem*B[k];
		}
	}

	vector<float> x_vector(A.size());
	x_vector[A.size()-1] = B[A.size()-1] / A[A.size()-1][A.size()-1];
    float tmp;
	for(int i = A.size()-2; i>=0; i--){
		tmp = B[i];
		for(int k=i+1; k<A.size(); k++)
			tmp = tmp - A[i][k]*x_vector[k];

		x_vector[i] = tmp / A[i][i];
	}

	return x_vector; // ritorno b tilde (i valori delle incognite)
}

template <typename T>
void my_print_row(vector<T> v){
    cout<<"{";
    for (int i = 0; i < v.size(); i++){
            cout<<v[i];
            if(i!=v.size()-1)
                cout << ", ";
            else 
                cout << "";
    }
    
    cout<<"}";
}

vector<float> compute_b_with(vector<vector<float>> matrix){
	vector<float> result;

	for(int i = 0; i<matrix.size(); i++){ // itero su righe e colonne e calcolo sum per ogni iterazione
		float sum = 0; // somma degli elementi della riga

		for(int j = 0; j<matrix.size(); j++)
			sum += matrix[i][j];	
		
		result.push_back(sum); // pusho la somma nel vettore dei risultati
	}

	return result;
}