//    ENRICO PEZZANO   S4825087

#include "my_lib.h"

template <typename T>
vector<T> perturb_vector(vector<T> v){
	vector<T> pertubated_b = v;
	float inf_norm = infinite_norm_vector(v);

	for (unsigned int i=0; i<v.size(); i++)
		pertubated_b[i] += (inf_norm * (i%2==0 ? -0.01 : 0.01));

	return pertubated_b;
}

vector<float> sum_vectors(vector<float> v, vector<float> w){
	vector<float> result;

	if(v.size() != w.size()){
		cout << "Le size dei vettori non possono essere diverse!" << endl;
		exit(0);
	}

	for(int i=0; i<v.size(); i++){
		float temp = v[i] + w[i];
		result.push_back(temp);
	}
	return result;
}

int main()
{
    // Risoluzione sistema lineare con termini noti perturbati 
    cout << "\n\n\e[1m--- Es 3 ---\e[0m\n";
    // cout << "\n\nes3 not implemented yet :(\n";

	cout << "Riutilizzando le stesse matrici dell'esercizio precedente...";

	// inizializzazione delle matrici e dei vettori come nei risultati degli esercizi precedenti
    vector<vector<float>> A1{ { 3, 1, -1, 0}, { 0, 7, -3, 0}, { 0, -3, 9, -2 }, { 0, 0, 4, -10 } };
	vector<vector<float>> A2{ { 2, 4, -2, 0}, { 1, 3, 0, 1}, { 3, -1, 1, 2 }, { 0, -1, 2, 1 } };
    vector<vector<float>> P = init_pascal(10);
    const int Nc = 10*(7+1)+8;
    vector<vector<float>> T = init_trid(Nc);

	vector<float> b_of_A1 = compute_b_with(A1);
	vector<float> b_of_A2 = compute_b_with(A2);
	vector<float> b_of_P = compute_b_with(P);
	vector<float> b_of_T = compute_b_with(T);

	// vector<float> x_of_A1 = compute_gauss(A1, b_of_A1);
	// vector<float> x_of_A2 = compute_gauss(A2, bA2);
	// vector<float> x_of_P = compute_gauss(P, bP);
	// vector<float> x_of_T = compute_gauss(T, bT);
	// fine inizializzazione 


	// Matrice A1
	cout << "\n\n***** Matrice A1 *****";
	vector<float> b_of_A1_pert = perturb_vector(b_of_A1);
	cout << "\nVettore dei termini noti A1 perturbato: \t  "; my_print_row(b_of_A1_pert);

	vector<float> b_plus_bpert = sum_vectors(b_of_A1, b_of_A1_pert);
	cout << "\nSomma dei vettori b di A1 con b di A1 perturbato: "; my_print_row(b_plus_bpert);

	vector<float> x_of_A1_pert = compute_gauss(A1, b_plus_bpert);
	cout << "\nVettore soluzioni per A1: \t\t\t  "; my_print_row(x_of_A1_pert);
	

	// Matrice A2
	cout << "\n\n***** Matrice A2 *****";
	vector<float> b_of_A2_pert = perturb_vector(b_of_A2);
	cout << "\nVettore dei termini noti A2 perturbato: \t  "; my_print_row(b_of_A2_pert);

	b_plus_bpert = sum_vectors(b_of_A2, b_of_A2_pert);
	cout << "\nSomma dei vettori b di A2 con b di A2 perturbato: "; my_print_row(b_plus_bpert);

	vector<float> x_of_A2_pert = compute_gauss(A2, b_plus_bpert);
	cout << "\nVettore soluzioni per A2: \t\t\t  "; my_print_row(x_of_A2_pert);
	
	
	// Matrice P
	cout << "\n\n***** Matrice P *****";
	vector<float> b_of_P_pert = perturb_vector(b_of_P);
	cout << "\nVettore dei termini noti P perturbato: \t\t  "; my_print_row(b_of_P_pert);

	b_plus_bpert = sum_vectors(b_of_P, b_of_P_pert);
	cout << "\nSomma dei vettori b di P con b di P perturbato:   "; my_print_row(b_plus_bpert);

	vector<float> x_of_P_pert = compute_gauss(P, b_plus_bpert);
	cout << "\nVettore soluzioni per P: \t\t\t  "; my_print_row(x_of_P_pert);
	
	
	// Matrice T
	cout << "\n\n***** Matrice T *****";
	vector<float> b_of_T_pert = perturb_vector(b_of_T);
	cout << "\nVettore dei termini noti T perturbato:\n"; my_print_row(b_of_T_pert);

	b_plus_bpert = sum_vectors(b_of_T, b_of_T_pert);
	cout << "\n\nSomma dei vettori b di T con b di T perturbato:\n"; my_print_row(b_plus_bpert);

	vector<float> x_of_T_pert = compute_gauss(T, b_plus_bpert);
	cout << "\n\nVettore soluzioni per T:\n"; my_print_row(x_of_T_pert);

	cout<<"\n\nFine :-)\n\n";
    return 0;
}