package easycoin.datatype.visualizzazione;

import java.awt.Dimension;
import java.util.Hashtable;
import javax.swing.JPanel;

import easycoin.calculator.Visualizza;

@SuppressWarnings("serial")
public class ASezioni extends Visualizzazione {

	private Hashtable sezione= new Hashtable();
	private JPanel jP_Pannello = null;
	private JPanel aux = null;

	public ASezioni(Visualizza v,Hashtable s) {
		super(v);
		// TODO Auto-generated constructor stub
		this.sezione=s;
		initialize();
	}
	
	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
		this.setSize(new Dimension(954, 410));
        //this.setViewportView(getJP_Pannello());
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
			for (int i=0;i<sezione.size();i++){
				aux=(JPanel)sezione.get(new Integer(i));
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
	public Hashtable getSezione() {
		return sezione;
	}

	public void setSezione(Hashtable sezione) {
		this.sezione = sezione;
	}
	
}
