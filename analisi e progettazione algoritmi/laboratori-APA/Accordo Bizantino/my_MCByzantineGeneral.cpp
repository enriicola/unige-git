#include <iostream>
#include <cmath>
#include <vector>
#include <ctime>

using namespace std;

int const ITERATIONS = 100000;

int coin_toss(){
   return rand()%2;
}

int compute_tally(int maj, vector<int>generali){
	int tally = 0;

   // for(int i=0; i<generali.size()-1; i++)
   //    if(generali[i] == maj){
   //       tally++;
   //       printf("\n%d",tally);
   //    }

   for(int x : generali) // compile with -std=c++11 :)
		if ( x == maj)
         tally++; // printf("\n%d",tally);
	
	return tally;
}

// verifico se si è raggiunto un accordo (sulla diagonale devono esserci gli stessi valori).
// Siccome gen_choices è una matrice con 4 colonne e 3 righe, il processo malevolo (essendo l'ultimo) è escluso dalla diagonale
bool consensus(vector<vector<int> > gen_choices){
	int acc = 0;
	int s = 0;
	for(int j = 0; j < 3 ; j++){
		if(gen_choices[j][s]==1)
			acc++;
		s++;	
	}
	return(acc == 0 || acc == 3); // se sulla diagonale ci sono 3 uni o 0 zeri vuol dire che si è raggiunto un accordo
}

int compute_maj(vector<int>generali){
	int scelta = 0;

	for(int i = 0; i < generali.size(); i++)
		if(generali[i] == 1)
			scelta += 1;
	
	if(scelta == 2)  // sono in stallo? -> scelgo randomicamente cosa fare
		return rand()%2;

	if(scelta > 2)
		return 1;
	else 
		return 0;
}

// al round 0 le decisioni dei processi affidabili sono randomiche
void start(vector<vector<int> > &gen_choices){
	int z = 0;
	for (int j=0; j<3 ; j++){
		if(j == 0){
			for(int i=0; i<3; i++){
				gen_choices[j][i] = rand()%2;
			}
		}
		gen_choices[j] = gen_choices[0]; // i 2t+1 processi affidabili switchano le scelte
		gen_choices[j][3] = 1-gen_choices[j][z];  // il processo birbante fa una scelta opposta a quella dei processi affidabili
		z++;
	}
}

// Ad ogni round i processi affidabili prendono una decisione in base al tally e alla maggioranza; il processo delinquente dice il contrario
void do_round(vector<vector<int> > &gen_choices){
	int z = 0;
	int coin = coin_toss(); // lancio globale della moneta
	int s = 0;

	for (int j=0; j<3 ; j++){
		if(j == 0){
			for(int i=0; i<3; i++){
				if(compute_tally(compute_maj(gen_choices[s]),gen_choices[s]) >= 3)  // if tally(i) ≥ 2t + 1
					gen_choices[0][i] = compute_maj(gen_choices[s]);   // then b(i) <- maj(i)
				else 
					gen_choices[0][i] = coin;   // then b(i) <- risultato della moneta
				
            s++;
			}
		}

		gen_choices[j] = gen_choices[0]; // i 2t+1 processi affidabili switchano le scelte
		gen_choices[j][3] = 1-gen_choices[j][z];  // il processo birbante fa una scelta opposta a quella dei processi affidabili
		z++;
	}
}
// calcolo il numero di round dopo il quale la probabilità che l'accordo venga raggiunto è > 99.9%
int consensus_prob(vector<int>numeri_round){
	vector <int> ripetitions(44);
	int sum = 0;
	for (int i = 0; i<numeri_round.size(); i++){  // riempo un vettore con tutti i possibili numeri di round dopo i quali si raggiunge un accordo e conto quante volte escono
    	ripetitions[numeri_round[i]]++;
  	}
  	for (int i = 0; i<ripetitions.size(); i++){  // sommo le volte in cui si raggiunge un accordo in tali round e se questo supera il 99.9% delle volte lo ritorno
    	sum+=ripetitions[i];
    	if (sum>=ITERATIONS-ITERATIONS*0.001)
    		return i;
  	}
  	return 0;
}

int main()
{
	srand(time(NULL));
	int round_number_counter = 0;
	vector<int> temp(4);
	vector<vector<int> > gen_choices(3, temp);   // costruisco la matrice rappresentante le scelte dei 4 processi
	vector<int> numeri_round; // contiene i numeri di round dopo i quali si è raggiunto un accordo
	
	for(int i=0; i<ITERATIONS; i++){
		round_number_counter = 0;

		start(gen_choices); // genero randomicamente le decisioni iniziali dei processi non birbanti

		while (!consensus(gen_choices)){  // finchè non si raggiunge un accordo, vado avanti coi round
			do_round(gen_choices);
			round_number_counter++; // tengo conto dei round effettuati
		}
		numeri_round.push_back(round_number_counter);
	}

	cout<<"\nNumero di round dopo il quale la probabilità che l'accordo è raggiunto è più grande del 99.9%: "<<consensus_prob(numeri_round)<<endl;
	
	// calcolo della media
	int sum = 0;
	for (int i=0; i < numeri_round.size(); i++)
		sum += numeri_round[i];
	float media = (float)sum/ITERATIONS;
	cout<<"\nMedia del numero di round necessari per il consenso: "<<media<<endl;
	
	// calcolo della varianza usando E[u^2] − µ^2
	sum = 0;
	for (int i=0; i<numeri_round.size(); i++)
		sum += pow(numeri_round[i], 2);

	float media_somma_potenze = (float)sum/ITERATIONS;
  	float varianza = media_somma_potenze-pow(media, 2);
  	cout<<"\nVarianza del numero di round necessari per il consenso: "<<varianza<<endl<<endl;
}