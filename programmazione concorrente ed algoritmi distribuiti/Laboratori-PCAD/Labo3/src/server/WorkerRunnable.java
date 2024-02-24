package server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

import server.eventi.Eventi;

public class WorkerRunnable implements Runnable{

   protected Socket clientSocket = null;
   protected String serverText   = null;
   Eventi ev;
   PrintWriter output = null;
   BufferedReader input = null;
   String msg;
   // this.flag = flag; // 0 prenota, 1 stampa

   public WorkerRunnable(Socket clientSocket, String serverText, Eventi ev) {
      this.clientSocket = clientSocket;
      this.serverText   = serverText;
      this.ev = ev;
   }

   public void run() {
      String[] prenotazione = null;
      try {
         input = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
			String line = input.readLine();

         output = new PrintWriter (this.clientSocket.getOutputStream(), true);
         output.println(msg);

         while (line != null){
            if(line.contains(" ")) {
					prenotazione = line.split(" ");
					if(prenotazione.length == 2) {
                  ServerBooks(prenotazione[0], Integer.valueOf(prenotazione[1]));
                  msg = "prenotazione effettuata";
               }
               else
                  msg = "Bad formatting! Type: 'NomeEvento n°PostiDaPrenotare'";
				}
            else{
               System.err.println("Error, wrong request");
               System.exit(1);
            }
         } // end while

         ServerBooks(prenotazione[0], Integer.valueOf(prenotazione[1]));
         System.out.println(ServerPrints());

         // InputStream input2  = clientSocket.getInputStream(); // omonimi, ma di tipo diversi
         // OutputStream output2 = clientSocket.getOutputStream(); // omonimi, ma di tipo diversi
         // long time = System.currentTimeMillis();
         // output2.write(("HTTP/1.1 200 OK\n\nWorkerRunnable: " +this.serverText + " - " + time + "").getBytes());
         // output2.write((ServerPrints()).getBytes());

         // output2.close();
         // input2.close();
         // System.out.println("Request processed time: " + time);

			this.clientSocket.close();
			System.err.println("Connection to " + this.clientSocket.getRemoteSocketAddress() + " closed");
      }
      catch (IOException e) {
         //report exception somewhere.
         e.printStackTrace();
      }
   }

   private String ServerPrints() {
      return ev.ListaEventi();
   }

   private void ServerBooks(String eventoDaPrenotare, int postiDaPrenotare){
      ev.Prenota(eventoDaPrenotare, postiDaPrenotare);
   }

   // private void ServerAddSeats(String eventoDaPrenotare, int postiDaAggiungere){
   //    ev.Aggiungi(eventoDaPrenotare, postiDaAggiungere);
   // }
}