package client;

import java.net.Socket;
import javax.swing.*;

public class GUI extends JFrame {

   Socket socket;
   JFrame frame;
   JButton buttonPrenota;
   JButton buttonStampa;
   JLabel nameLabel;
   JLabel numLabel;
   JTextField nameTField;
   JTextField seatsTField;
   JTextArea textArea;
   final boolean STAMPA = true;
   final boolean PRENOTA = false;

   public GUI(Socket socket) {
      this.socket = socket;
      
      frame = new JFrame();
      frame.setTitle("ClientGUI");

      nameLabel = new JLabel("Nome evento: ");
      nameTField = new JTextField(16);
      numLabel = new JLabel("Posti da Prenotare: ");
      seatsTField = new JTextField(3);
      buttonPrenota = new JButton("PRENOTA");
      buttonStampa = new JButton("Stampa eventi disponobili");
      textArea = new JTextArea();
      
      buttonPrenota.addActionListener(new MyListener(this, socket, nameTField, seatsTField, PRENOTA));
      buttonStampa.addActionListener(new MyListener(this, socket, nameTField, seatsTField, STAMPA));

      textArea.setBounds(5, 210, 424, 203);

      JPanel panel = new JPanel();
      panel.add(nameLabel);
      panel.add(nameTField);
      panel.add(numLabel);
      panel.add(seatsTField);
      panel.add(buttonPrenota);
      panel.add(buttonStampa);
      panel.add(textArea);
      
      getContentPane().add(panel);
      frame.add(panel); 
		frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
		frame.setVisible(true);
   }

   // public static void main(String[] args) {
   //    SwingUtilities.invokeLater(new Runnable() {
   //       @Override
   //       public void run() {
   //             new GUI(socket);
   //       }
   //    });
   // }
}