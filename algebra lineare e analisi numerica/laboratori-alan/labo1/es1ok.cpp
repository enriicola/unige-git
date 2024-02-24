// ENRICO PEZZANO S4825087

#include <cmath>
#include <iostream>
using namespace std;

int main ()
{
   //Enrico è il primo membro del gruppo: le ultime due cifre del suo numero di matricola sono rispettivamente:
   double d0 = 8;
   double d1 = 7;

   //Assegnamo alle variabili i loro valori per quanto possibile
   double a = d0+1;
   double b = (d1+1) * pow(10,20);
   double c = -b;

   double abs_err1, abs_err2, rel_err1, rel_err2;
   abs_err1 = abs_err2 = rel_err1 = rel_err2 = 0;

   // Iteriamo su i e svolgiamo i calcoli, per ogni valore:
   for (int i = 0; i <= 6; ++i) {
      a = (d0+1) * pow(10,i);

      cout << "------------------------------------------\n";
      cout << "Iterazione n° " << i << "\n"<<"a = " << a << "\n"<< "b = " << b << "\n"<< "c = " << c << "\n\n";

      //calcolo errori assoluti
      abs_err1 = fabs(((a+b)+c)-a);
      abs_err2 = fabs(((a+b)+c)-a);

      //calcolo errori relativi
      rel_err1 = abs_err1/a;
      rel_err2 = abs_err2/a;

      cout << "(a+b)+c = " << (a+b)+c << "\n";
      cout << "a+(b+c) = " << a+(b+c) << "\n\n";

      cout << "erorre assoluto (a + b) + c -> " << abs_err1 <<  "\n";
      cout << "erorre relativo (a + b) + c -> " << rel_err1 << "\n\n";

      cout << "erorre assoluto a + (b + c) -> " << abs_err2 <<  "\n";
      cout << "erorre relativo a + (b + c) -> " << rel_err2 <<  "\n";

   }
   return 0;
}