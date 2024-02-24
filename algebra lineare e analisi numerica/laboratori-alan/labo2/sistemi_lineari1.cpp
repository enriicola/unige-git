// ENRICO PEZZANO S4825087

#include "my_lib.h"

int main()
{
	cout << "\n\n\e[1m--- Lab2 - Sistemi Lineari :) ---\e[0m\n\n";

	vector<vector<int>> A1{ { 3, 1, -1, 0}, { 0, 7, -3, 0}, { 0, -3, 9, -2 }, { 0, 0, 4, -10 } };

	vector<vector<int>> A2{ { 2, 4, -2, 0}, { 1, 3, 0, 1}, { 3, -1, 1, 2 }, { 0, -1, 2, 1 } };

	cout << "Matrice A1: ";
    my_fancy_print(A1);
	cout<<"\n";
	cout << "Matrice A2: ";
    my_fancy_print(A2);

	cout << "\n\n\e[1m--- Es 1 ---\e[0m\n";
	cout << "Norma infinito matrice A1: \t " << infinite_norm(A1) << endl;
	cout << "Norma infinito matrice A2: \t " << infinite_norm(A2) << endl;

    const int Nb = 10; // come richiesto da consegna
    vector<vector<float>> P = init_pascal(Nb);
    cout << "\nMatrice P:  ";
    my_fancy_print(P);
	cout << "Norma infinito matrice Pascal: \t " << infinite_norm(P) << endl;

    int d0 = 8, d1 = 7; // come richiesto da consegna
    const int Nc = 10*(d1+1)+d0;
    vector<vector<float>> T = init_trid(Nc);
    cout << "\nMatrice T:  ";
    my_not_so_fancy_print(T);
	cout << "Norma infinito matrice tridiagonale: " << infinite_norm(T) << endl;

    cout<<"\n\n";
	return 0;
}