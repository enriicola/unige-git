#include <iostream>
#include <vector>
#include <fstream>
#include <cmath>
#include <vector>

using namespace std;

int comparisons_counter = 0;
int R = 100000; // numero di esecuzioni

vector<int> rand_sequence(int size){ // random fill della sequenza
   vector<int> sequence(size);
   for(int i=0; i<size; i++)
      sequence.at(i) = rand()%size;

   return sequence;
}

void print_sequence(vector<int> &sequence){
   cout<<"print_sequence: "<<endl;
   for(int i = 0; i<sequence.size(); i++)
      cout<<"Posizione "<<i<<": "<<sequence[i]<<endl;
   
   cout<<"\n\n";
}

double compute_exp(int* array){ // calcola l'espettazione
   double espettazione = 0;
   for(int i=0; i<R; i++)
      espettazione += array[i];

   espettazione = espettazione / R;
   return espettazione;
}

double compute_variance(int* array, double exp){ // calcola la varianza
   double variance = 0;
   for(int i=0; i<R; i++)
      variance += (array[i]-exp) * (array[i]-exp);

   variance = variance/R;
   variance = sqrt(variance);

   return variance;
}

void swap(int* a, int* b){ // funzione aux per il quicksort
   int tmp = *a;
   *a = *b;
   *b = tmp;
}

// funzione aux di LVQS per partizionare rispetto al pivot (casuale)
int partition(vector<int> &sequence, int min, int max){
   int pivot_index = min+rand()%(max-min+1);

   swap(sequence[pivot_index], sequence[min]);
   int i = min+1;
   for(int j=min+1; j<=max; j++){
      comparisons_counter++;
      if(sequence[j] < sequence[min]){
         swap(sequence[i], sequence[j]);
         i++;
      }
   }

   swap(sequence[min], sequence[i-1]);
   return i-1;
}

void LVQuickSort(vector<int> &sequence, int min, int max){
   if(min < max){
      int pivot = partition(sequence, min, max); //partition farà l'ordinamento vero e proprio...

      // ...diviso sulle sue ripetizioni
      LVQuickSort(sequence, min, pivot-1);
      LVQuickSort(sequence, pivot+1, max);
   }
}

int main ()
{
   cout << "LVQuickSort by Enrico Pezzano."<<endl<<endl;
   srand(time(NULL));

   int size = 10000; // dimensione delle sequenze
   int comparisons_array[R];  // array per il numero dei confronti per run   

   for(int i=0; i<R; i++){
      // sequenza di numeri interi con |S|=10^4; una per ogni run
      vector<int> S = rand_sequence(size);

      // chiamo LVQuickSort, tenendo conto del numero di confronti effettuati in ogni run
      LVQuickSort(S,0,size-1);

      comparisons_array[i] = comparisons_counter;
      comparisons_counter = 0;
   }
   
   // calcolo il valore medio del numero di confronti
   double middle_comparison_value = compute_exp(comparisons_array);
   cout<<"Il valore atteso del numero dei confronti è: "<<middle_comparison_value<<endl;

	// calcolo la varianza del numero di confronti 
	double comparisons_variance = compute_variance(comparisons_array, middle_comparison_value);
	cout<<"La varianza del numero dei confronti è: " << comparisons_variance<<"\n\n";

	// output file filling for comparisons
	ofstream comparison;
	comparison.open ("comparison.dat");

	for(int i=0; i<R; i++)
		comparison << comparisons_array[i] << endl;

	comparison.close();

	// output file filling dell'espettazione
	ofstream espettazione;
	espettazione.open ("espettazione.dat");
	espettazione << middle_comparison_value << endl;
	espettazione.close();

	// stima empiricamente la probabilita con la quale LVQS effettua il doppio e il triplo del valore medio dei confronti
	int comparisons_double = 0;
	int comparisons_triple = 0;

	for(int i=0; i<R; i++){
		if(comparisons_array[i] >= middle_comparison_value * 2)
			comparisons_double++;

		if(comparisons_array[i] >= middle_comparison_value * 3)
			comparisons_triple++;
	}

	cout << "Stima empirica del numero di volte in cui LVQuickSort effettua: " << endl;
	cout << "- Il doppio del valore medio dei confronti: " << comparisons_double << endl;
	cout << "- Il triplo del valore medio dei confronti: " << comparisons_triple << endl<<endl;
	
	return 0;
}