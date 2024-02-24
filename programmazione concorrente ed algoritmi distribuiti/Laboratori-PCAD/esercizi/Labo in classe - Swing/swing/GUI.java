import javax.swing.*;
// import java.awt.GridLayout;
// import java.awt.FlowLayout;
// import java.awt.BorderLayout;

public class GUI extends JFrame {

    private static final long serialVersionUID = 1L;
	JButton step;
    JLabel  statusLabel;
    int counter;
    
    public GUI() {
        super("Swing");
        counter=0;
        step = new JButton("Step");
        statusLabel = new JLabel("0");
        MyListener step_handler  = new MyListener(this);
        step.addActionListener(step_handler);
        JPanel Panel = new JPanel();
        Panel.add(step);
        Panel.add(statusLabel);
        getContentPane().add(Panel);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setVisible(true);
        pack();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new GUI();
            }
        });
    }
}
