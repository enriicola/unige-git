// c++ program that computes prime numbers until 256
// and decomposes a number into its prime factors and prints them

#include <iostream>
#include <vector>
#include <cmath>

using namespace std;

int main()
{
    // compute prime numbers until 256
    vector<int> primes;
    primes.push_back(2);
    for (int i = 3; i <= 256; i += 2)
    {
        bool isPrime = true;
        for (int j = 0; j < primes.size(); j++)
        {
            if (i % primes[j] == 0)
            {
                isPrime = false;
                break;
            }
        }
        if (isPrime)
        {
            primes.push_back(i);
        }
    }
    for (int i = 0; i < primes.size(); i++)
        cout << primes[i] << " ";
    cout << endl<<primes.size()<<endl;

    // decompose a number into its prime factors and print them
    for (int i = 0; i < primes.size(); i++){
        int n = primes[i];
        cout << n << " = ";
        for (int i = 0; i < primes.size(); i++)
        {
            while (n % primes[i] == 0)
            {
                cout << primes[i] << " * ";
                n /= primes[i];
            }
        }
        cout << "1" << endl;
    }

    
    int freq[54];
    for (int i = 0; i < 54; i++)
        freq[i] = 0;
    for (int n = 1; n <= 256; n++)
    {
        for (int i = 0; i < primes.size(); i++)
        {
            if(primes[i] == n)
            {
                freq[i]++;
            }
        }
        for (int i = 0; i < 54; i++)
        {
            cout<<"frequency of "<<primes[i]<<" = "<<freq[i]<<" \n";
        }
        
    }
    
    



    return 0;
}