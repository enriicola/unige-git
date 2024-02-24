// import javax.swing.SwingUtilities;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
// import java.beans.PropertyChangeEvent;
// import java.beans.PropertyChangeListener;

public class MyListener implements ActionListener {

    private GUI gui;
    private MyWorker worker;

    public MyListener(GUI gui) {
        this.gui = gui;
    }

    @Override
    public void actionPerformed(ActionEvent ev) {
        gui.step.setEnabled(false);
        worker = new MyWorker(gui);
        worker.execute();
    }
}