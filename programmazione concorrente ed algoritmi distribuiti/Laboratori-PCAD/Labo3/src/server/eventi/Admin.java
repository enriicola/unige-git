package server.eventi;

// import java.util.Random;

public class Admin implements Runnable{
   public void run() {
      System.out.println("Inizio Admin.");

      for(int i = 0 ; i<Test.numEventi; i++)
         Test.eventi.Crea(Test.data[i], 47+i*3);

      System.out.println("\nAdmin: creati tutti gli eventi:");
      Test.eventi.ListaEventi();

      try {
         Thread.sleep(3000);
      } catch (InterruptedException e1) {
         e1.printStackTrace();
      }
      System.out.println("\nAdmin: svegliato dopo i 3 secondi.");

      for(int i = 0 ; i<Test.numEventi; i++)
         Test.eventi.Aggiungi(Test.data[i], 100);
      System.out.println("\nAdmin: fine aggiunta dei posti.");
      Test.eventi.ListaEventi();
         
      try {
         Thread.sleep(2000);
      } catch (InterruptedException e) {
         e.printStackTrace();
      }
      
      //chiudo 2 eventi a caso
      // var r = new Random();
      // int randEvent = r.nextInt(Test.numEventi);
      // Test.eventi.Chiudi(Test.data[randEvent]);
      // Test.eventi.Chiudi(Test.data[3]);

      for(int i = 0 ; i<Test.numEventi; i++)
         Test.eventi.Chiudi(Test.data[i]);

      Test.eventi.ListaEventi();
      System.out.println("Fine Admin.");
   }
}