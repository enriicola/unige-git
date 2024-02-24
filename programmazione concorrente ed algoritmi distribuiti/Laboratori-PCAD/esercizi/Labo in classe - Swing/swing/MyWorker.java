import javax.swing.*;
import java.util.List;
// import java.awt.GridBagLayout;
// import java.awt.GridBagConstraints;
// import java.util.concurrent.SynchronousQueue;
// import java.util.concurrent.ExecutionException;

public class MyWorker extends SwingWorker<String, Integer> {
   
    GUI _gui ;

    public MyWorker(GUI gui) {
        _gui=gui;
    }


    @Override
    protected String doInBackground() throws Exception {
        Thread.sleep(1000); 
        return "Done!";
    }
    
    @Override
    protected void process(List<Integer> chunks) {
    }

    @Override
    protected void done() {
    	//you can query status inside the implementation of this method 
        //to determine the result of this task or whether this task has been cancelled
        _gui.counter += 1;
        _gui.statusLabel.setText(Integer.toString(_gui.counter));
        _gui.step.setEnabled(true);
    }

}