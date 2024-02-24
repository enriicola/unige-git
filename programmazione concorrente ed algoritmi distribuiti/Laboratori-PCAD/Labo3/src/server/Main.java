package server;

import java.io.IOException;
import server.eventi.Eventi;

public class Main{
   public static void main(String[] args) throws IOException
   {
      Eventi data = new Eventi();
      data.Crea("poolParty", 60);
      data.Crea("party", 100);
      data.Crea("25 aprile", 50);
      data.Crea("natale", 15);

      ThreadPoolServer server = new ThreadPoolServer(1234, data);
      new Thread(server).start();

      try {
         Thread.sleep(20 * 1000);
      }
      catch (InterruptedException e) {
         e.printStackTrace();
      }
      System.out.println("Stopping Server");
      server.stop();
   }
}