// ENRICO PEZZANO  S4825087

#include <iostream>
#include <math.h>
#define SIZE_X 4
#define SIZE_N 5
using namespace std;
/*
Fissato l’intero positivo N, implementare un programma che permetta di calcolare fN(x) per il punto x e il grado N dati in input.
Considerare i due algoritmi seguenti per i valori descritti dei parametri x e N, confrontando i risultati ottenuti per fN (x) con i valori restituiti per f (x) dalla funzione exp
   della libreria ANSI math.h, tramite errore relativo e assoluto.
- Algoritmo 1: determinare un’approssimazione di f(x) per il punto x = 0.5 ed il punto x = 30, valutando fN (x) per N = 3, 10, 50, 100, 150. Ripetere l’esercizio considerando il 
   punto x = −0.5 ed il punto x = −30.
- Algoritmo 2: Osservando che per l’esponenziale vale f (−x) = 1/f (x) e quindi f (−x) ≈ 1/fN (x), de- terminare una diversa approssimazione di f(−0.5) e f(−30) nel modo seguente: 
   valutare fN(+0.5) e fN (+30) per N = 3, 10, 50, 100, 150 e, successivamente, calcolarne il reciproco.
*/

double X[SIZE_X] = {0.5,30,-0.5,-30};
double N[SIZE_N] = {3,10,50,100,150}; // globale perchè uguale per entrambi gli algoritmi

double my_factorial(double n){
   if(n == 1) return 1;
   return n * my_factorial(n-1);
}

double my_taylor(double x, double n){
   if(n == 0)
      return 1;
	if(n == 1)
      return x+1;

	return my_taylor(x,n-1) + (pow(x,n)/my_factorial(n));
}

// TODO
// void abs_error(double m_result, double t_result){
//     cout << "Errore assoluto: " << (double)abs(t_result-m_result) << endl;
// }
// void rel_error(double m_result, double t_result){
//     cout << "Errore relativo: " << (double)abs(t_result-m_result)/m_result << endl << endl;
// }

void Alg1(){
   double fun, som, esp;
   
   cout<<endl;

   for(int i=0; i<SIZE_X; i++){
      cout<<"Per il punto x="<<X[i]<<"...\n\n";
      for(int j=0; j<SIZE_N; j++){
         /*double*/ esp = exp(X[i]);
			double res = my_taylor(X[i], N[j]); 

			double abs_err = res - esp;
			// double relative_err = (res - esp) / esp;

			cout<<"...errore assoluto con N=" << N[j] << "\t -> \t" << abs_err << endl;
      }

      // cout<<" \n F di X ="<<esp<<endl<<endl; // sbagliato

      for(int j=0; j<SIZE_N; j++){
			double esp = exp(X[i]);
			double res = my_taylor(X[i], N[j]); 

			// double abs_err = res - esp;
			double relative_err = (res - esp) / esp;

			cout<<"...errore relativo con N=" << N[j] << "\t -> \t" << relative_err << endl;
		}	

		cout << endl << endl;
   }
}

void Alg2(){
   // lo trovo solo per 0.5 e 30 per poi fare il reciproco
	for(int i=0; i<2; i++){
		for(int j=0; j<SIZE_N; j++){
			double esp = exp(X[i+2]); // confronto l'esp dei negativi (traslando di 2)

			double res = 1/my_taylor(X[i], N[j]); // con il reciproco del risultato della taylor sui positivi

			// cout << "Taylor: " << res << endl;

			double abs_err = res - esp;
			// double err_r = (res - esp) / esp;

			cout<<"...errore assoluto con N=" << N[j] << "\t -> \t" << abs_err << endl;
		}	

		cout << endl;

		for(int j=0; j<SIZE_N; j++){
			
			double esp = exp(X[i+2]); // confronto l'esp dei negativi (traslando di 2)

			// con il reciproco del risultato della taylor sui positivi
			double res = 1/my_taylor(X[i], N[j]); 

			// cout << "Taylor: " << res << endl;

			// double abs_err = res - esp;
			double relative_err = (res - esp) / esp;

			cout<<"...errore relativo con N=" << N[j] << "\t -> \t" << relative_err << endl;
		}	

		cout << endl;
	}
}

int main()
{
   cout<<"Lanciamo il primo algoritmo: \n";
   Alg1();

   cout << "-----------------------------------------------------\n";

   cout<<"\nLanciamo il secondo algoritmo: \n\n";
   Alg2();
}