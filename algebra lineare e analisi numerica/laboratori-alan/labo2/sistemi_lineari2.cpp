// ENRICO PEZZANO S4825087

#include "my_lib.h"

int main()
{
	cout << "\n\n\e[1m--- Es 2 ---\e[0m\n";

    vector<vector<float>> A1{ { 3, 1, -1, 0}, { 0, 7, -3, 0}, { 0, -3, 9, -2 }, { 0, 0, 4, -10 } };
	vector<vector<float>> A2{ { 2, 4, -2, 0}, { 1, 3, 0, 1}, { 3, -1, 1, 2 }, { 0, -1, 2, 1 } };
    vector<vector<float>> P = init_pascal(10);
    const int Nc = 10*(7+1)+8;
    vector<vector<float>> T = init_trid(Nc);

    // es2 con la matrice A1
        cout << "Riutilizzando le stesse matrici dell'esercizio precedente...";

        cout << "\n\n***** Matrice A1 *****";
        // —  assumendo nota la soluzione del sistema ̄x= (1,1,...,1)^t,
        // calcoli il corrispondente termine noto dato dal prodotto b = A· ̄x;
        vector<float> b_of_A1 = compute_b_with(A1);
        cout << "\nIl vettore b di A1 e': "; my_print_row(b_of_A1);

        // —  risolva in precisione singola il sistema Ax=b
        // tramite l’algoritmo di eliminazione Gaussiana.
        vector<float> x_of_A1 = compute_gauss(A1, b_of_A1);
        cout << "\n\nIl vettore x di A1 e': "; my_print_row(x_of_A1);

    // es2 con la matrice A2
        cout << "\n\n***** Matrice A2 *****";
        vector<float> b_of_A2 = compute_b_with(A2);
        cout << "\nIl vettore b di A2 e': "; my_print_row(b_of_A2);

        vector<float> x_of_A2 = compute_gauss(A2, b_of_A2);
        cout << "\n\nIl vettore x di A2 e': "; my_print_row(x_of_A2);
    
    // es2 con la matrice P di Pascal
        cout << "\n\n***** Matrice P di Pascal *****";
        vector<float> b_of_P = compute_b_with(P);
        cout << "\nIl vettore b di P e': "; my_print_row(b_of_P);

        vector<float> x_of_P = compute_gauss(P, b_of_P);
        cout << "\n\nIl vettore x di P e': "; my_print_row(x_of_P);

    // es2 con la matrice T triagonale
        cout << "\n\n***** Matrice T triagonale *****";
        vector<float> b_of_T = compute_b_with(T);
        cout << "\nIl vettore b di T e': "; my_print_row(b_of_T);

        vector<float> x_of_T = compute_gauss(T, b_of_T);
        cout << "\n\nIl vettore x di T e': "; my_print_row(x_of_T);

    cout << "\n\n";
	return 0;
}