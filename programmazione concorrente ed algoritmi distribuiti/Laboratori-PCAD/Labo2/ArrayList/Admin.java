package ArrayList;

import java.util.Random;

public class Admin implements Runnable{
   public void run() {
      while(true) {
         System.out.println("\nInizio Admin.");
         Test.eventi.ListaEventi();

         for(int i = 0 ; i<Test.numEventi; i++)
            Test.eventi.Crea(Test.data[i], 1+i*47);
         
        
            try {
               for(int i = 0 ; i<Test.numEventi; i++) {
                  // Test.eventi.Crea(Test.data[i], 1+i*47);
                  Test.eventi.Aggiungi(Test.data[i], i+7);
                  Thread.sleep(1000);
               }
            }
            catch (InterruptedException e) {
               e.printStackTrace();
            }
         
         
         Test.eventi.ListaEventi();
         notifyAll();

         try {
            Test.eventi.wait();
         }
         catch (InterruptedException e){
            e.printStackTrace();
         }
         //chiusura evento random
         var r = new Random();
         int randEvent = r.nextInt(Test.numEventi);
         Test.eventi.Chiudi(Test.data[randEvent]);
         System.out.println("\nFine Admin.");
         Test.eventi.ListaEventi();
      }
   }
}