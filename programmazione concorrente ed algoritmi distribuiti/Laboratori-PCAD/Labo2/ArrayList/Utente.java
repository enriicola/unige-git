package ArrayList;

import java.util.Random;

public class Utente implements Runnable{
   public void run(){
      System.out.println("\nInizio utente.");
      while(true){ // thread utenti 1 e 2
         try {
            // Test.eventi.wait();
            Thread.sleep(1000);

            var r = new Random();
            int randEvent = r.nextInt(Test.numEventi);
            Test.eventi.Prenota(Test.data[randEvent], randEvent*21);
            System.out.println("\nEvento "+Test.data[randEvent]+" prenotato.");
            Test.eventi.ListaEventi();
            System.out.println("\nFine utente.");
            notifyAll();
         }
         catch (InterruptedException e) {
            e.printStackTrace();
         }
      }
   }
}
