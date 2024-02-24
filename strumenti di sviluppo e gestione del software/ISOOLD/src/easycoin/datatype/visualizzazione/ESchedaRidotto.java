package easycoin.datatype.visualizzazione;

import easycoin.calculator.Visualizza;
import easycoin.datatype.*;

import java.awt.Dimension;
import java.awt.Rectangle;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JTextField;

@SuppressWarnings("serial")
public class ESchedaRidotto extends TMSchedaRidotto {

	protected Id idE;  //  @jve:decl-index=0:
	protected String anno;
	//private JLabel jL_Id = null;
	private JLabel jL_EnteEmettitore = null;
	private JTextField jT_Nome = null;
	private JLabel jL_AreaGeografica = null;
	private JTextField jT_AreaGeografica = null;
	//private JLabel jL_IdTM = null;
	private JLabel jL_Descrizione = null;
	private JTextField jT_Descrizione = null;
	//private JLabel jL_IdE = null;
	private JTextField jT_Anno = null;
	private JLabel jL_Anno = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	


public ESchedaRidotto(Visualizza v,Id idEE, String nome, String areaGeografica, Id idTM, String descrizione, Id idE, String anno) {
		super(v,idEE, nome, areaGeografica, idTM, descrizione);
		this.idE = idE;
		this.anno = anno;
	}

public ESchedaRidotto(Visualizza v, Id idEE, String nome, String areaGeografica, Id idTM, String descrizione) {
	super(v, idEE, nome, areaGeografica, idTM, descrizione);
	// TODO Auto-generated constructor stub
}

/**
	 * This method initializes this
	 * 
	 */
	public void initialize() {
        //jL_IdE = new JLabel();
        //jL_IdE.setBounds(new Rectangle(85, 91, 20, 20));
        //jL_IdE.setText(idE.idToString());
        jL_Descrizione = new JLabel();
        jL_Descrizione.setBounds(new Rectangle(85, 61, 94, 20));
        jL_Descrizione.setText("Descrizione:");
        //jL_IdTM = new JLabel();
        //jL_IdTM.setText(idTM.idToString());
        //jL_IdTM.setBounds(new Rectangle(45, 61, 20, 20));
        jL_AreaGeografica = new JLabel();
        jL_AreaGeografica.setBounds(new Rectangle(285, 31, 100, 20));
        jL_AreaGeografica.setText("Area Geografica:");
        jL_EnteEmettitore = new JLabel();
        jL_EnteEmettitore.setBounds(new Rectangle(15, 31, 94, 20));
        jL_EnteEmettitore.setText("Ente Emettitore:");
        //jL_Id = new JLabel();
        //jL_Id.setBounds(new Rectangle(10, 10, 20, 20));
        //jL_Id.setText(idEE.idToString());
        this.setLayout(null);
        this.setSize(new Dimension(760, 160));
        //this.add(jL_Id, null);
        this.add(jL_EnteEmettitore, null);
        this.add(getJT_Nome(), null);
        this.add(jL_AreaGeografica, null);
        this.add(getJT_AreaGeografica(), null);
        //this.add(jL_IdTM, null);
        this.add(jL_Descrizione, null);
        this.add(getJT_Descrizione(), null);
        //this.add(jL_IdE, null);
        if (idE!=null){
        	jL_Anno = new JLabel();
        	jL_Anno.setBounds(new Rectangle(116, 91, 62, 20));
        	jL_Anno.setText("Anno:");
        	this.add(getJT_Anno(), null);
        	this.add(jL_Anno, null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Emissione Scheda Ridotta"));
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
	        		System.out.println("actionPerformed() Nuova Emissione");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().inserisciEmissione(idTM);
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
			jB_Modifica.setBounds(new Rectangle(690, 66, 30, 30));
			if(idE==null)
				jB_Modifica.setEnabled(false);
			jB_Modifica.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Modifica Emissione");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().modificaEmissione(idE);
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
			jB_Elimina.setBounds(new Rectangle(690, 106, 30, 30));
			if(idE==null)
				jB_Elimina.setEnabled(false);
			jB_Elimina.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Elimina Emissione");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().eliminaEmissione(idE);
	        	}
	        });
		}
		return jB_Elimina;
	}

	//	Metodi get e set
	public String getAnno() {
		return anno;
	}

	public void setAnno(String anno) {
		this.anno = anno;
	}

	public Id getIdE() {
		return idE;
	}

	public void setIdE(Id idE) {
		this.idE = idE;
	}
	
	/**
	 * This method initializes jT_Nome	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Nome() {
		if (jT_Nome == null) {
			jT_Nome = new JTextField();
			jT_Nome.setBounds(new Rectangle(113, 31, 143, 20));
			jT_Nome.setEditable(false);
			jT_Nome.setText(nome);
		}
		return jT_Nome;
	}

	/**
	 * This method initializes jT_AreaGeografica	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_AreaGeografica() {
		if (jT_AreaGeografica == null) {
			jT_AreaGeografica = new JTextField();
			jT_AreaGeografica.setBounds(new Rectangle(396, 31, 173, 20));
			jT_AreaGeografica.setEditable(false);
			jT_AreaGeografica.setText(areaGeografica);
		}
		return jT_AreaGeografica;
	}

	/**
	 * This method initializes jT_Descrizione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Descrizione() {
		if (jT_Descrizione == null) {
			jT_Descrizione = new JTextField();
			jT_Descrizione.setBounds(new Rectangle(185, 61, 229, 20));
			jT_Descrizione.setEditable(false);
			jT_Descrizione.setText(descrizione);
		}
		return jT_Descrizione;
	}

	/**
	 * This method initializes jT_Anno	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Anno() {
		if (jT_Anno == null) {
			jT_Anno = new JTextField();
			jT_Anno.setBounds(new Rectangle(185, 91, 74, 20));
			jT_Anno.setEditable(false);
			jT_Anno.setText(anno);
		}
		return jT_Anno;
	}
	
}  //  @jve:decl-index=0:visual-constraint="10,10"
