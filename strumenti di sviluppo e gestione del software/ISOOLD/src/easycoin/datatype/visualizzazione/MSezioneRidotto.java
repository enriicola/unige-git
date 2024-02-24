package easycoin.datatype.visualizzazione;

import java.awt.Dimension;

import easycoin.calculator.Visualizza;
import easycoin.datatype.Id;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.JLabel;
import java.awt.Rectangle;
import javax.swing.JTextField;

@SuppressWarnings("serial")
public class MSezioneRidotto extends JPanel {

	protected Id idM;  //  @jve:decl-index=0:
	protected String grado;
	protected String stato;
	protected Visualizza Vis;
	protected Id idE;
	//private JLabel jL_IdM = null;
	private JLabel jL_Grado = null;
	private JTextField jT_Grado = null;
	private JLabel jL_Stato = null;
	private JTextField jT_Stato = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	protected ImageIcon delico = null;
	protected ImageIcon newico = null;
	protected ImageIcon modico = null;
	
	public MSezioneRidotto(Visualizza v,Id idE,Id idM, String grado, String stato) {
		super();
		this.idM = idM;
		this.grado = grado;
		this.stato = stato;
		this.Vis=v;
		this.idE=idE;
		/*Creazione Icone*/
		newico = Visualizzazione.createImageIcon("images/nuovo.png");
		delico = Visualizzazione.createImageIcon("images/cancella.png");
		modico = Visualizzazione.createImageIcon("images/modifica.png");
	}
	
	public MSezioneRidotto(Visualizza vis, Id idE) {
		Vis = vis;
		this.idE = idE;
		/*Creazione Icone*/
		newico = Visualizzazione.createImageIcon("images/nuovo.png");
		delico = Visualizzazione.createImageIcon("images/cancella.png");
		modico = Visualizzazione.createImageIcon("images/modifica.png");
	}



	/**
	 * This method initializes this
	 * 
	 */
	public void initialize() {
        
        //jL_IdM = new JLabel();
        //jL_IdM.setBounds(new Rectangle(10, 10, 20, 20));
        //jL_IdM.setText(idM.idToString());
        this.setLayout(null);
        this.setSize(new Dimension(760, 160));
        //this.add(jL_IdM, null);
        if (idM!=null){
	        jL_Stato = new JLabel();
	        jL_Stato.setBounds(new Rectangle(281, 20, 60, 20));
	        jL_Stato.setText("Stato:");
	        jL_Grado = new JLabel();
	        jL_Grado.setBounds(new Rectangle(45, 20, 60, 20));
	        jL_Grado.setText("Grado:");
	        this.add(jL_Grado, null);
	        this.add(getJT_Grado(), null);
	        this.add(jL_Stato, null);
	        this.add(getJT_Stato(), null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Moneta Sezione Ridotta"));
	}
	/**
	 * This method initializes jB_Nuovo	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Nuovo() {
		if (jB_Nuovo == null) {
			jB_Nuovo = new JButton(newico);
			jB_Nuovo.setBounds(new Rectangle(690, 26, 30, 30));
			jB_Nuovo.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Nuova Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		if(Vis.getAC()!=null)
	        		Vis.getAC().inserireMoneta(idE);
	        	}
	        });
		}
		return jB_Nuovo;
	}

	/**
	 * This method initializes jB_Modifica	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Modifica() {
		if (jB_Modifica == null) {
			jB_Modifica = new JButton(modico);
			if (idM==null)
				jB_Modifica.setEnabled(false);
			jB_Modifica.setBounds(new Rectangle(690, 66, 30, 30));
			jB_Modifica.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Modifica Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		if(Vis.getAC()!=null)
	        		Vis.getAC().modificaMoneta(idM);
	        	}
	        });
		}
		return jB_Modifica;
	}

	/**
	 * This method initializes jB_Elimina	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Elimina() {
		if (jB_Elimina == null) {
			jB_Elimina = new JButton(delico);
			if (idM==null)
				jB_Elimina.setEnabled(false);
			jB_Elimina.setBounds(new Rectangle(690, 106, 30, 30));
			jB_Elimina.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Elimina Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		if(Vis.getAC()!=null)
	        		Vis.getAC().eliminaM(idM);
	        	}
	        });
		}
		return jB_Elimina;
	}

//	Metodi get e set
	public String getGrado() {
		return grado;
	}

	public void setGrado(String grado) {
		this.grado = grado;
	}

	public Id getIdM() {
		return idM;
	}

	public void setIdM(Id idM) {
		this.idM = idM;
	}

	public String getStato() {
		return stato;
	}

	public void setStato(String stato) {
		this.stato = stato;
	}

	/**
	 * This method initializes jT_Grado	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Grado() {
		if (jT_Grado == null) {
			jT_Grado = new JTextField();
			jT_Grado.setBounds(new Rectangle(110, 20, 157, 20));
			jT_Grado.setEditable(false);
			jT_Grado.setText(grado);
		}
		return jT_Grado;
	}

	/**
	 * This method initializes jT_Stato	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Stato() {
		if (jT_Stato == null) {
			jT_Stato = new JTextField();
			jT_Stato.setBounds(new Rectangle(345, 20, 173, 20));
			jT_Stato.setEditable(false);
			jT_Stato.setText(stato);
		}
		return jT_Stato;
	}
	
}  //  @jve:decl-index=0:visual-constraint="10,10"
