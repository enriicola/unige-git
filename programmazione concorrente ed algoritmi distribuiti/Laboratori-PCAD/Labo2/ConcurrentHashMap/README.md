# Gestore di eventi in java

## Secondo laboratorio per il corso di PCAD

### Simulazione di un botteghino per la vendita/prenotazione di posti per delle feste

Nella soluzione implementata nessuna operazione viene effettivamente gestita concorrentemente. Nonostante ci siano più thread, alla fine si alternano il lock sulla stessa struttura dati, rendendo il programma complessivamente sequenziale.
Una possibile soluzione al problema di sopra, sarebbe di implementare la classe AtomicInteger ed "isolare" la variabile dei posti occupati per evento.
