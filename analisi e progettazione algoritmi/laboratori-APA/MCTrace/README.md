Genera una matrice 300x300 B con Bij campionato uniformemente nell'intervallo [0,1]. La matrice A = BTB è semidefinita positiva. Calcola ||A||2F e Tr(A) dalle definizioni. Usa MonteCarloTrace per stimare 100 volte Tr(A) con M=5,10,25 e 100. Costruisci un istogramma con le stime ottenute e commenta il significato delle posizioni nell'istogramma occupate da Tr(A) e Tr(A) ± σM (usando per σM uno dei 100 valori calcolati per ogni M). Confronta σ2M con 2 ||A||2F/M.

---

Per compilare il programma: g++-11 my_mc_trace.cpp
Per eseguire il programma: ./a.out

Per generare i grafici: python3 my_plot.py

Ho deciso di distrubuire il codice in due file per motivi di tempistica e semplicità. Siccome python è più "semplice" (o comunque meno oneroso come sintassi), ma più lento di c++ nell'ordine dei minuti.
In questo modo, la parte di calcolo più pesante viene presa in carico da c++, mentre la generazione degli istogrammi da python, siccome è un calcolo poco pesante e più breve da implementare.
