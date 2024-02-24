package client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.List;
import javax.swing.JTextField;
import javax.swing.SwingWorker;

public class MyWorker extends SwingWorker<String, Integer> {
   
   GUI _gui;
   boolean flag;
   Socket socket;
   String eventoDaPrenotare;
   String postiDaPrenotare;
   private String answer;


   public MyWorker(GUI gui, Socket socket, String eventoDaPrenotare, JTextField postiDaPrenotare, boolean flag) {
      _gui = gui;
      this.flag = flag; // 0 prenota, 1 stampa
      this.socket = socket;
      this.eventoDaPrenotare = eventoDaPrenotare;
      this.postiDaPrenotare = postiDaPrenotare.getText();
      ;
   }

   @Override
   protected String doInBackground(){
      PrintWriter outStream;
      String retval = "";
      
      try{
         Socket socket = new Socket("localhost", 1234);

         if(flag){
            String cmd = "stampa";
            outStream = new PrintWriter(socket.getOutputStream(), true);
            outStream.println(cmd);
            // outStream.flush();

            BufferedReader inStream = new BufferedReader((new InputStreamReader(socket.getInputStream())));
            answer = inStream.readLine();
         }
         else{
            outStream = new PrintWriter(socket.getOutputStream(), true);
            // System.out.println("Area di testo: " + eventoDaPrenotare);
            // outStream.flush();

            BufferedReader inStream = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            answer = inStream.readLine();
         }
         socket.close();
      }
      catch(IOException e){
         e.printStackTrace();
     }
     return retval;
   }
    
   @Override
   protected void process(List<Integer> chunks) {
   }

   @Override
   protected void done() {
      _gui.buttonPrenota.setEnabled(true);
      _gui.buttonStampa.setEnabled(true);
      try {
         _gui.nameTField.setText(answer);
     }
     catch (Exception e) {
         e.printStackTrace();
     }
   }
}