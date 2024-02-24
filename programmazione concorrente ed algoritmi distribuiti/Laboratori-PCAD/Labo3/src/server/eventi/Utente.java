package server.eventi;

public class Utente implements Runnable{
   public void run(){
      System.out.println("Inizio utente.");
      try {
         System.out.println("utente: dormo. ("+Thread.currentThread().getName()+")");
         Thread.sleep(1000); // aspetta la creazione degli eventi
      }
      catch (InterruptedException e) {
         e.printStackTrace();
      }
      System.out.println("\nutente sveglio...("+Thread.currentThread().getName()+")");

      for(int i = 0 ; i<Test.numEventi; i++){
         System.out.println("\nutente: provo a prenotare '"+Test.data[i]+"'. ("+Thread.currentThread().getName()+")");
         Test.eventi.Prenota(Test.data[i], 60);
      }

      System.out.println("Fine utente. ("+Thread.currentThread().getName()+")");
   }
}
