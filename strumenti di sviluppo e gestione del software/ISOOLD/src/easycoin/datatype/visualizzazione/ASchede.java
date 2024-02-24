package easycoin.datatype.visualizzazione;

import java.util.Hashtable;
import java.awt.Dimension;
import javax.swing.JPanel;

import easycoin.calculator.Visualizza;

public class ASchede extends Visualizzazione {
	private static final long serialVersionUID = 2931867921496668196L;
	
	private Hashtable scheda = new Hashtable();  
	private JPanel jP_Pannello;
	private JPanel aux;

	public ASchede(Visualizza v,Hashtable s) {
		super(v);
		this.scheda=s;
		// TODO Auto-generated constructor stub
		initialize();
	}

	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
		this.setSize(new Dimension(954, 410));
        this.getViewport().add(getJP_Pannello());
       	
	}

	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Pannello() {
		if (jP_Pannello == null) {
			java.awt.GridBagConstraints gridBagConstraints;
			jP_Pannello = new JPanel();
			jP_Pannello.setLayout(new java.awt.GridBagLayout());
			for (int i=0;i<scheda.size();i++){
				aux=(JPanel)scheda.get(new Integer(i));
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 900;
		        gridBagConstraints.ipady = aux.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets((i*aux.getHeight()), 10, 106, 21);
		        jP_Pannello.add(aux,gridBagConstraints);
			}
		}
		return jP_Pannello;
	}
	
	//	Metodi get e set
	public Hashtable getScheda() {
		return scheda;
	}

	public void setScheda(Hashtable s) {
		this.scheda = s;
	}
	
}
