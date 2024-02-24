package easycoin.datatype.visualizzazione;

import java.awt.Dimension;
import java.awt.Rectangle;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JTextField;

import easycoin.calculator.Visualizza;
import easycoin.datatype.*;

@SuppressWarnings("serial")
public class MSchedaRidotto extends ESchedaRidotto {

	protected Id idM;  //  @jve:decl-index=0:
	protected String grado;
	protected String stato;
	//private JLabel jL_Id = null;
	private JLabel jL_EnteEmettitore = null;
	private JTextField jT_Nome = null;
	private JLabel jL_AreaGeografica = null;
	private JTextField jT_AreaGeografica = null;
	//private JLabel jL_IdTM = null;
	private JLabel jL_Descrizione = null;
	private JTextField jT_Descrizione = null;
	//private JLabel jL_IdE = null;
	//private JLabel jL_IdM = null;
	private JTextField jT_Anno = null;
	private JLabel jL_Anno = null;
	private JLabel jL_Grado = null;
	private JTextField jT_Grado = null;
	private JLabel jL_Stato = null;
	private JTextField jT_Stato = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	
	public MSchedaRidotto(Visualizza v,Id idEE, String nome, String areaGeografica, Id idTM, String descrizione, Id idE, String anno, Id idM, String grado, String stato) {
		super(v,idEE, nome, areaGeografica, idTM, descrizione, idE, anno);
		this.idM = idM;
		this.grado = grado;
		this.stato = stato;
	}
	
	
	
	public MSchedaRidotto(Visualizza v, Id idEE, String nome, String areaGeografica, Id idTM, String descrizione, Id idE, String anno) {
		super(v, idEE, nome, areaGeografica, idTM, descrizione, idE, anno);
		// TODO Auto-generated constructor stub
	}



	/**
	 * This method initializes this
	 * 
	 */
	public void initialize() {
        jL_Anno = new JLabel();
        jL_Anno.setBounds(new Rectangle(116, 91, 62, 20));
        jL_Anno.setText("Anno:");
        //jL_IdE = new JLabel();
        //jL_IdE.setText(idE.idToString());
        //jL_IdE.setBounds(new Rectangle(85, 91, 20, 20));
        jL_Descrizione = new JLabel();
        jL_Descrizione.setBounds(new Rectangle(85, 61, 94, 20));
        jL_Descrizione.setText("Descrizione:");
        //jL_IdTM = new JLabel();
        //jL_IdTM.setBounds(new Rectangle(45, 61, 20, 20));
        //jL_IdTM.setText(idTM.idToString());
        jL_AreaGeografica = new JLabel();
        jL_AreaGeografica.setBounds(new Rectangle(285, 31, 100, 20));
        jL_AreaGeografica.setText("Area Geografica:");
        jL_EnteEmettitore = new JLabel();
        jL_EnteEmettitore.setBounds(new Rectangle(15, 31, 94, 20));
        jL_EnteEmettitore.setText("Ente Emettitore:");
        //jL_Id = new JLabel();
        //jL_Id.setBounds(new Rectangle(6, 6, 20, 20));
        //jL_Id.setText(idEE.idToString());
        //jL_IdM = new JLabel();
        //jL_IdM.setBounds(new Rectangle(90, 121, 20, 20));
        //jL_IdM.setText(idM.idToString());
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
        //this.add(jL_IdM, null);
        this.add(jL_Anno, null);
        this.add(getJT_Anno(), null);
        if (idM!=null){
        	jL_Stato = new JLabel();
        	jL_Stato.setBounds(new Rectangle(341, 121, 60, 20));
        	jL_Stato.setText("Stato:");
        	jL_Grado = new JLabel();
        	jL_Grado.setBounds(new Rectangle(115, 121, 50, 20));
        	jL_Grado.setText("Grado:");
        	this.add(jL_Grado, null);
        	this.add(getJT_Grado(), null);
        	this.add(jL_Stato, null);
        	this.add(getJT_Stato(), null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Moneta Scheda Ridotta"));
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
			jB_Modifica.setBounds(new Rectangle(690, 66, 30, 30));
			if(idM==null)
				jB_Modifica.setEnabled(false);
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
			if(idM==null)
				jB_Elimina.setEnabled(false);
			jB_Elimina.setBounds(new Rectangle(690, 106, 30, 30));
			jB_Elimina.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Elimina Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
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
	/**
	 * This method initializes jT_Grado	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Grado() {
		if (jT_Grado == null) {
			jT_Grado = new JTextField();
			jT_Grado.setBounds(new Rectangle(165, 121, 157, 20));
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
			jT_Stato.setBounds(new Rectangle(400, 121, 173, 20));
			jT_Stato.setEditable(false);
			jT_Stato.setText(stato);
		}
		return jT_Stato;
	}

}
