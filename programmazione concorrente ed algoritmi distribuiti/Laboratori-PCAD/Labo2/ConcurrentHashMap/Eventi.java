package ConcurrentHashMap;

import java.util.concurrent.ConcurrentHashMap;

public class Eventi{

   // Nella soluzione implementata nessuna operazione viene effettivamente gestita concorrentemente.
   // Nonostante ci siano più thread, alla fine si alternano il lock sulla stessa struttura dati, rendendo il 
   // programma complessivamente sequenziale.
   // Una possibile soluzione al problema di sopra, sarebbe di implementare la classe AtomicInteger ed "isolare"
   // la variabile dei posti occupati per evento.

   public ConcurrentHashMap<String, Evento> ListaEventi = new ConcurrentHashMap<String, Evento>();

   public class Evento{
      private final String NomeEvento;
      private int PostiOccupati;
      private int PostiMax;
      // private boolean isDone;

      public Evento(String nome, int posti){
         this.NomeEvento = nome;
         this.PostiMax = posti;
         // this.isDone = false;
      }

      public String getNome(){ return this.NomeEvento; }

      public int getDisponibili(){ return this.PostiMax-this.PostiOccupati; }

      public Evento addSeats(int postiDaAggiungere) throws InterruptedException {
         synchronized(ListaEventi){
            if(!ListaEventi.containsKey(NomeEvento))
               error("error: Evento terminato o inesistente.");

            this.PostiMax += postiDaAggiungere;
            System.out.println("\naddSeats: aggiunti "+postiDaAggiungere+" posti in "+this.NomeEvento+". Notifico...");
         }
         return this;
      }

      public Evento bookSeats(int postiDaPrenotare) throws InterruptedException {
         if(!ListaEventi.containsKey(NomeEvento))
            error("error: Evento terminato.");

         this.PostiOccupati += postiDaPrenotare;
         System.out.println("\nEvento "+ListaEventi.get(NomeEvento).NomeEvento+" prenotato per "+postiDaPrenotare+" persone.");
         
         return this;
      }

   } // end class Evento

   public void error(String message){
      System.err.println(message);
      System.exit(-1);
   }

   public void Crea(String NomeEvento, int PostiTot){
      Evento e = new Evento(NomeEvento, PostiTot);
      
      if(ListaEventi.containsKey(NomeEvento))
         error("L'evento "+NomeEvento+" esiste già.");

      ListaEventi.put(NomeEvento, e);

      System.out.println("Evento "+NomeEvento+" creato.");
   }

   public synchronized void Aggiungi(String NomeEvento, int postiDaAggiungere){
      if(ListaEventi.get(NomeEvento).PostiMax <= 0)
         throw new IllegalStateException("postiMax <= 0");

      if(!ListaEventi.containsKey(NomeEvento))
         error("Aggiungi: L'evento "+NomeEvento+" non esiste.");
      
      ListaEventi.compute(NomeEvento, (key, val) -> {
         try {
            
            return ListaEventi.get(NomeEvento).addSeats(postiDaAggiungere);
         } catch (InterruptedException e) {
            e.printStackTrace();
         }
         return val;
      });
      notify();
   }

   public synchronized void Prenota(String NomeEvento, int postiDaPrenotare){
      if(ListaEventi.get(NomeEvento).PostiMax <= 0)
         throw new IllegalStateException("postiMax <= 0");
      
      while(postiDaPrenotare > ListaEventi.get(NomeEvento).getDisponibili() && ListaEventi.containsKey(NomeEvento)){ // bookmark
         try {
            System.out.println("\nPrenota: sto aspettando "+NomeEvento+".("+Thread.currentThread().getName()+")");
            wait();
         } catch (InterruptedException e1) {
            e1.printStackTrace();
         }
         System.out.println("\nPrenota: non sto più aspettando "+NomeEvento+".("+Thread.currentThread().getName()+")");
         if(NomeEvento == null)
            error("Prenota: L'evento "+NomeEvento+" non esiste.");
         if(!ListaEventi.containsKey(NomeEvento))
            error("Prenota: L'evento "+NomeEvento+" non esiste.");

         ListaEventi.compute(NomeEvento, (key, val) -> {
            try {
               return val.bookSeats(postiDaPrenotare);
            }
            catch (InterruptedException e) {
               e.printStackTrace();
            }
            return val;
         });
      } // end while
   }

   public void ListaEventi(){
      for (String key: ListaEventi.keySet()) {
         // String key = s.toString();
         int value = ListaEventi.get(key).getDisponibili();
         System.out.println("Evento: "+key+"\t Posti disponibili: "+value);
     }
   }

   public synchronized void Chiudi(String NomeEvento){
      if(!ListaEventi.containsKey(NomeEvento))
         error("Chiudi: L'evento "+NomeEvento+" non esiste.");

      ListaEventi.remove(NomeEvento);
      System.out.println("\nChiudi: evento "+NomeEvento+" chiuso.");
      notify();
   }
}