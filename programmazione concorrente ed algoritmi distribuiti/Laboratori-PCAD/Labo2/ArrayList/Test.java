package ArrayList;

public class Test extends Thread{
   public final static int numEventi = 5;
   public final static String[] data = { "poolParty", "christamnParty", "pasquaParty", "compleanno", "barmitzvah" };
   public static Eventi eventi = new Eventi();

   public static void main(String[] args) throws InterruptedException
   {
      Admin admin = new Admin();
      Utente utente = new Utente();

      Thread admin1 = new Thread(admin);
      Thread utente1 = new Thread(utente);
      Thread utente2 = new Thread(utente);

      admin1.start();
      utente1.start();
      utente2.start();

      admin1.join();
      utente1.join();
      utente2.join();
   }
}