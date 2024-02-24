package easycoin.datatype.visualizzazione;

import java.awt.Dimension;
import java.awt.Rectangle;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JTextField;

import easycoin.calculator.Visualizza;
import easycoin.datatype.Id;

@SuppressWarnings("serial")
public class MSezioneCompleto extends MSezioneRidotto {

	protected String valoreCommerciale;
	//private JLabel jL_IdM = null;
	private JLabel jL_Grado = null;
	private JTextField jT_Grado = null;
	private JLabel jL_Stato = null;
	private JTextField jT_Stato = null;
	private JLabel jL_ValoreCommerciale = null;
	private JTextField jT_ValoreCommerciale = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;

	public MSezioneCompleto(Visualizza v,Id idE,Id idM, String grado, String stato, String valoreCommerciale) {
		super(v,idE,idM, grado, stato);
		this.valoreCommerciale = valoreCommerciale;
	}

	public MSezioneCompleto(Visualizza vis, Id idE) {
		super(vis, idE);
		// TODO Auto-generated constructor stub
	}

	/**
	 * This method initializes this
	 * 
	 */
	public void initialize() {
        this.setLayout(null);
        this.setSize(new Dimension(760, 260));
        //this.add(jL_IdM, null);
        if (idM!=null){
	        jL_Stato = new JLabel();
	        jL_Stato.setBounds(new Rectangle(281, 20, 60, 20));
	        jL_Stato.setText("Stato:");
	        jL_Grado = new JLabel();
	        jL_Grado.setBounds(new Rectangle(45, 20, 60, 20));
	        jL_Grado.setText("Grado:");
	        //jL_IdM = new JLabel();
	        //jL_IdM.setText(idM.idToString());
	        //jL_IdM.setBounds(new Rectangle(10, 10, 20, 20));
	        jL_ValoreCommerciale = new JLabel();
	        jL_ValoreCommerciale.setBounds(new Rectangle(45, 50, 100, 20));
	        jL_ValoreCommerciale.setText("Valore Commerciale:");
	        this.add(jL_Grado, null);
	        this.add(getJT_Grado(), null);
	        this.add(jL_Stato, null);
	        this.add(jL_ValoreCommerciale,null);
	        this.add(getJT_ValoreCommerciale(),null);
	        this.add(getJT_Stato(), null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Moneta Sezione Completa"));
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
	public String getValoreCommerciale() {
		return valoreCommerciale;
	}

	public void setValoreCommerciale(String valoreCommerciale) {
		this.valoreCommerciale = valoreCommerciale;
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
	
	/**
	 * This method initializes jT_ValoreCommerciale	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_ValoreCommerciale() {
		if (jT_ValoreCommerciale == null) {
			jT_ValoreCommerciale = new JTextField();
			jT_ValoreCommerciale.setBounds(new Rectangle(168, 50, 173, 20));
			jT_ValoreCommerciale.setEditable(false);
			jT_ValoreCommerciale.setText(valoreCommerciale);
		}
		return jT_ValoreCommerciale;
	}
	
}
