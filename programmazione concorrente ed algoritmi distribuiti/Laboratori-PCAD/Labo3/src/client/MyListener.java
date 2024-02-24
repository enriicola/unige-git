package client;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.Socket;
import javax.swing.JTextField;
import javax.swing.SwingWorker;

public class MyListener implements ActionListener {

   String eventoDaPrenotare;
   JTextField postiDaPrenotare;
   Socket socket;
   boolean flag;
   private GUI gui;
   private SwingWorker<String, Integer> worker;

   public MyListener(GUI gui, Socket socket, JTextField eventoDaPrenotare, JTextField postiDaPrenotare, boolean flag) {
      this.gui = gui;
      this.eventoDaPrenotare = eventoDaPrenotare.getText();
      this.postiDaPrenotare = postiDaPrenotare;
      this.socket = socket;
      this.flag = flag; // 0 prenota, 1 stampa
   }

   @Override
   public void actionPerformed(ActionEvent ev) {
      gui.buttonPrenota.setEnabled(false);
      gui.buttonStampa.setEnabled(false);

      worker = new MyWorker(gui, socket, eventoDaPrenotare, postiDaPrenotare, flag);
      Thread t = new Thread(worker);
      t.start();
   }
}