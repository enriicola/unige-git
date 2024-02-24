//  ENRICO PEZZANO  S4825087
#include <iostream>
#include <math.h> // pow function
using namespace std;

// Implementare un programma che determina la precisione di macchina eps, ossia il 
// valore positivo eps = 2^(−d), dove d `e il piu` grande intero positivo tale che 
// 1 + 2^(−d) > 1 in aritmetica di macchina; calcolarne il valore sia in singola
//  che in doppia precisione.

int main () 
{
	// codeblock per la singola precisione
		float E = 2.0;
		float base = 2.0;

		while((1+E/base)>1.0) // ciclo finchè il valore è minore della precisione di macchina
			E /= base;
		//Usciti dal ciclo il valore di d è il valore minimo tale che 1=1+2^(-d)
		cout<<"La singola precisione di macchina e': "<<E<<endl;


	// codeblock per la doppia precisione
		double eps = 2.0; // equivalente di E
		double b = 2.0; // equivalente di base

		while((1+eps/b)>1.0)
			eps /= b;
		cout<<"La doppia precisione di macchina e': "<<eps<<endl;
}
