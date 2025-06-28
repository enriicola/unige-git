-------- commenti -------------

Il primo assignment/report ha vari problemi, ti scrivo qui alcuni commenti.

- Pagina 2
Analisi di scaling (non era richiesta) ma credo che questo tipo di
analisi abbia senso solo se effettuata su più grafi di dimensioni crescenti.

- Pagina 6
Non è vero che high clustering è una signature della power-law. Il
modello Barabási–Albert, nonostante generi distribuzioni power-law, ha
un clustering basso.
C'è proprio un errore teorico nella formula nella lunghezza media dei
cammini nei grafi random ER.

- Pagina 7
Secondo me hai cammini brevi perché nella tua rete hai un super hub
(Kmax 702, su 1224 nodi). Non mi sembra di aver letto considerazioni su
questo fatto ma i cammini sono così brevi perché più hai metà dei nodi
connessi allo stesso nodo. Sarebbe interessante capire chi è davvero
questo nodo ma non so se il dataset ha dei metadati.

- Pagina 12
Sono davvero confusa su Girvan-Newman. Mi sembra di capire che ti sei
fermato dopo aver trovato 12 comunità e non ha davvero senso. La tua
rete è grande e quindi non potevi arrivare in fondo, ma decidere dove
fermarsi è davvero un approccio sbagliato. Girvan-Newman non definisce a
priori il numero di comunità, le trova se riesce ad arrivare in fondo (e
si prende la comunità che massimizza la modularità). Ovviamente se ho
capito bene quello che hai scritto.

Il secondo assignment va abbastanza bene anche se talvolta mettere una
tabella finale con dei numeri può aiutare a capire, soprattutto nel tuo
caso dove le immagini del grafo sono davvero minuscole.

Nel terzo assignment/report hai riprodotto solo la strategia del testo
dell'esame mentre i tuoi compagni hanno provato anche strategie
originali, proposte da loro. Inoltre, manca il discorso dei costi,
aggiungere link alla rete ha un costo. L'ultimo esempio (abbiamo
visualizzato il grafo durante l'orale) non ha davvero senso.



--
