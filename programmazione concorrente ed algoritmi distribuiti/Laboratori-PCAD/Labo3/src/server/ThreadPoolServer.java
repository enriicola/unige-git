package server;

import java.net.ServerSocket;
import java.net.Socket;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import server.eventi.Eventi;
import server.eventi.Test;

public class ThreadPoolServer implements Runnable{
   Eventi ev = new Eventi();

   protected int          serverPort   = 1234;
   protected ServerSocket serverSocket = null;
   protected boolean      isStopped    = false;
   protected Thread       runningThread= null;
   protected ExecutorService threadPool = Executors.newFixedThreadPool(10);

   public ThreadPoolServer(int port, Eventi ev){
      this.serverPort = port;
      this.ev = ev;
   }

// TODO test

   public void run(){
      synchronized(this){
         this.runningThread = Thread.currentThread();
      }
      // this.ServerBooks("poolParty2", 20); // cannot read PostiMax because is null
      // this.ServerBooks("natale2", 20);
      // this.ServerBooks("compleanno2", 20);
      new Test();
      // System.out.println(ServerPrints());

      try {
			Thread.sleep(1000);
         this.ServerAddSeats("poolParty", 10);
         // this.ServerAddSeats("compleanno", 10); // cannot read PostiMax because is null
         // this.ServerAddSeats("natale", 10);
      }
      catch(InterruptedException e1){
			e1.printStackTrace();
		}

      openServerSocket(); //attivo il server sulla porta 1234 in modo chge il client possa mettervisi in ascolto
      System.out.println("Server attivato");
		
      while(!isStopped()){
         Socket clientSocket = null;
         try {
            // a questo punto inizializziamo il servizio per far connettere il client
            clientSocket = this.serverSocket.accept(); // accept mette il server in ascolto sulla porta 1234 e aspetta un tentativo di utilizzo del servizio. Ritorna una variabile socket del client
         }
         catch (IOException e) {
            e.printStackTrace(); 
            throw new RuntimeException("Error accepting client connection", e);
         }
         this.threadPool.execute(new WorkerRunnable(clientSocket, "Thread Pooled Server <3", ev));
      } // end while

      this.threadPool.shutdown(); 
      System.out.println("Server Stopped.") ;
   }

   private synchronized boolean isStopped() {
      return this.isStopped;
   }

   public synchronized void stop(){
      this.isStopped = true;
      try {
         this.serverSocket.close();
      }
      catch (IOException e) {
         e.printStackTrace();
         throw new RuntimeException("Error closing server", e);
      }
   }

   public void openServerSocket() {
      try {
         this.serverSocket = new ServerSocket(this.serverPort);
      }
      catch (IOException e) {
         e.printStackTrace();
         throw new RuntimeException("Cannot open port 1234", e);
      }
   }

   public String ServerPrints(){
      return ev.ListaEventi();
   }

   public void ServerBooks(String eventoDaPrenotare, int postiDaPrenotare){
      ev.Prenota(eventoDaPrenotare, postiDaPrenotare);
   }

   public void ServerAddSeats(String eventoDaPrenotare, int postiDaAggiungere){
      ev.Aggiungi(eventoDaPrenotare, postiDaAggiungere);
   }
}