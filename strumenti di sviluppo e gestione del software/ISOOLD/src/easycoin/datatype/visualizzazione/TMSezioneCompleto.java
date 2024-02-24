package easycoin.datatype.visualizzazione;

import java.awt.Dimension;
import java.awt.Rectangle;
import java.util.Hashtable;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;

import easycoin.calculator.Visualizza;
import easycoin.datatype.Id;

@SuppressWarnings("serial")
public class TMSezioneCompleto extends TMSezioneRidotto {
	
	protected String valoreNominale;
	protected String nomeUnita;
	protected String fattoreMolt;
	protected String spessore;
	protected String peso;
	protected String bordo;
	protected String dimensione;
	protected String forma;
	protected String materiale;
	//private JLabel jL_IdTM = null;
	private JLabel jL_Descrizione = null;
	private JTextField jT_Descrizione = null;
	private JScrollPane jSP_Emissioni = null;
	private JLabel jL_ValoreNominale = null;
	private JTextField jT_ValoreNominale = null;
	private JLabel jL_Unita = null;
	private JTextField jT_Unita = null;
	private JLabel jL_FattMolt = null;
	private JTextField jT_FattMolt = null;
	private JLabel jL_Spessore = null;
	private JTextField jT_Spessore = null;
	private JLabel jL_Peso = null;
	private JTextField jT_Peso = null;
	private JLabel jL_Bordo = null;
	private JTextField jT_Bordo = null;
	private JLabel jL_Dimensione = null;
	private JTextField jT_Dimensione = null;
	private JLabel jL_Materiale = null;
	private JTextField jT_Materiale = null;
	private JLabel jL_Forma = null;
	private JTextField jT_Forma = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	private JPanel jP_PannelloEmissioni = null;
	private JPanel auxE = null;
	private JButton jB_NuovoTM = null;
	private JButton jB_ModificaTM = null;
	private JButton jB_EliminaTM = null;
	
	public TMSezioneCompleto(Visualizza v,Id idEE,Id idTM, String descrizione, Hashtable emissioni, String valoreNominale, String nomeUnita, String fattoreMolt, String spessore, String peso, String bordo, String dimensione, String forma, String materiale) {
		super(v,idEE,idTM, descrizione, emissioni);
		this.valoreNominale = valoreNominale;
		this.nomeUnita = nomeUnita;
		this.fattoreMolt = fattoreMolt;
		this.spessore = spessore;
		this.peso = peso;
		this.bordo = bordo;
		this.dimensione = dimensione;
		this.forma = forma;
		this.materiale = materiale;
	}
	
	
	public TMSezioneCompleto(Visualizza vis, Id idEE) {
		super(vis, idEE);
		// TODO Auto-generated constructor stub
	}


	public void initialize() {
        //jL_IdTM = new JLabel();
        //jL_IdTM.setText(idTM.idToString());
        //jL_IdTM.setBounds(new Rectangle(10, 10, 20, 20));
        this.setLayout(null);
        this.setSize(new Dimension(760, 470));
        //this.add(jL_IdTM, null);
        if (idTM!=null){
	        jL_Forma = new JLabel();
	        jL_Forma.setBounds(new Rectangle(270, 135, 115, 20));
	        jL_Forma.setText("Forma:");
	        jL_Materiale = new JLabel();
	        jL_Materiale.setBounds(new Rectangle(35, 135, 75, 20));
	        jL_Materiale.setText("Materiale:");
	        jL_Dimensione = new JLabel();
	        jL_Dimensione.setBounds(new Rectangle(270, 105, 115, 20));
	        jL_Dimensione.setText("Dimensione:");
	        jL_Bordo = new JLabel();
	        jL_Bordo.setBounds(new Rectangle(35, 105, 75, 20));
	        jL_Bordo.setText("Bordo:");
	        jL_Peso = new JLabel();
	        jL_Peso.setBounds(new Rectangle(270, 75, 115, 20));
	        jL_Peso.setText("Peso:");
	        jL_Spessore = new JLabel();
	        jL_Spessore.setBounds(new Rectangle(35, 75, 75, 20));
	        jL_Spessore.setText("Spessore:");
	        jL_FattMolt = new JLabel();
	        jL_FattMolt.setBounds(new Rectangle(270, 45, 115, 20));
	        jL_FattMolt.setText("Fattore Molteplicit�:");
	        jL_Unita = new JLabel();
	        jL_Unita.setBounds(new Rectangle(35, 45, 75, 20));
	        jL_Unita.setText("Unit�:");
	        jL_ValoreNominale = new JLabel();
	        jL_ValoreNominale.setBounds(new Rectangle(270, 15, 115, 20));
	        jL_ValoreNominale.setText("Valore Nominale:");
	        jL_Descrizione = new JLabel();
	        jL_Descrizione.setBounds(new Rectangle(35, 15, 75, 20));
	        jL_Descrizione.setText("Descrizione:");
	        this.add(jL_Descrizione, null);
	        this.add(getJT_Descrizione(), null);
	        this.add(getJSP_Emissioni(), null);
	        this.add(jL_ValoreNominale, null);
	        this.add(getJT_ValoreNominale(), null);
	        this.add(jL_Unita, null);
	        this.add(getJT_Unita(), null);
	        this.add(jL_FattMolt, null);
	        this.add(getJT_FattMolt(), null);
	        this.add(jL_Spessore, null);
	        this.add(getJT_Spessore(), null);
	        this.add(jL_Peso, null);
	        this.add(getJT_Peso(), null);
	        this.add(jL_Bordo, null);
	        this.add(getJT_Bordo(), null);
	        this.add(jL_Dimensione, null);
	        this.add(getJT_Dimensione(), null);
	        this.add(jL_Materiale, null);
	        this.add(getJT_Materiale(), null);
	        this.add(jL_Forma, null);
	        this.add(getJT_Forma(), null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Tipo Moneta Sezione Completa"));
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
	        		System.out.println("actionPerformed() Nuovo Tipo Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().inserisciTipoMoneta(idEE);
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
			if (idTM==null)
				jB_Modifica.setEnabled(false);
			jB_Modifica.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Modifica Tipo Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().modificaTipoMoneta(idTM);
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
			if (idTM==null)
				jB_Elimina.setEnabled(false);
			jB_Elimina.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Elimina Tipo Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().eliminaTipoMoneta(idTM);
	        	}
	        });
		}
		return jB_Elimina;
	}


//	Metodi get e set
	public String getBordo() {
		return bordo;
	}

	public void setBordo(String bordo) {
		this.bordo = bordo;
	}

	public String getDimensione() {
		return dimensione;
	}

	public void setDimensione(String dimensione) {
		this.dimensione = dimensione;
	}

	public String getFattoreMolt() {
		return fattoreMolt;
	}

	public void setFattoreMolt(String fattoreMolt) {
		this.fattoreMolt = fattoreMolt;
	}

	public String getForma() {
		return forma;
	}

	public void setForma(String forma) {
		this.forma = forma;
	}

	public String getMateriale() {
		return materiale;
	}

	public void setMateriale(String materiale) {
		this.materiale = materiale;
	}

	public String getNomeUnita() {
		return nomeUnita;
	}

	public void setNomeUnita(String nomeUnita) {
		this.nomeUnita = nomeUnita;
	}

	public String getPeso() {
		return peso;
	}

	public void setPeso(String peso) {
		this.peso = peso;
	}

	public String getSpessore() {
		return spessore;
	}

	public void setSpessore(String spessore) {
		this.spessore = spessore;
	}

	public String getValoreNominale() {
		return valoreNominale;
	}

	public void setValoreNominale(String valoreNominale) {
		this.valoreNominale = valoreNominale;
	}
	
	/**
	 * This method initializes jT_Descrizione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Descrizione() {
		if (jT_Descrizione == null) {
			jT_Descrizione = new JTextField();
			jT_Descrizione.setBounds(new Rectangle(112, 15, 150, 20));
			jT_Descrizione.setEditable(false);
			jT_Descrizione.setText(descrizione);
		}
		return jT_Descrizione;
	}

	/**
	 * This method initializes jSP_Emissioni	
	 * 	
	 * @return javax.swing.JScrollPane	
	 */
	private JScrollPane getJSP_Emissioni() {
		if (jSP_Emissioni == null) {
			jSP_Emissioni = new JScrollPane();
			jSP_Emissioni.setBounds(new Rectangle(15, 165, 780, 290));
			jSP_Emissioni.setBorder(javax.swing.BorderFactory.createTitledBorder("Emissioni"));
			jSP_Emissioni.getViewport().add(getJP_PannelloEmissioni());
			jSP_Emissioni.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		}
		return jSP_Emissioni;
	}
	
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_PannelloEmissioni() {
		if (jP_PannelloEmissioni == null) {
			java.awt.GridBagConstraints gridBagConstraints;
			jP_PannelloEmissioni = new JPanel();
			jP_PannelloEmissioni.setLayout(new java.awt.GridBagLayout());
			for (int i=0;i<emissioni.size();i++){
				auxE=(JPanel)emissioni.get(new Integer(i));
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 780;
		        gridBagConstraints.ipady = auxE.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets((i*auxE.getHeight()), 10, 106, 21);
		        jP_PannelloEmissioni.add(auxE,gridBagConstraints);
			}
			if (emissioni.size()==0){
				JPanel p=getJP_PannelloVuoto();
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 780;
		        gridBagConstraints.ipady = p.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets(0, 10, 106, 21);
		        jP_PannelloEmissioni.add(p,gridBagConstraints);
			}
		}
		return jP_PannelloEmissioni;
	}
	
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_PannelloVuoto() {
			JPanel jP_PannelloVuoto = new JPanel();
			jP_PannelloVuoto.setLayout(null);
			jP_PannelloVuoto.setSize(new Dimension(780, 160));
			jP_PannelloVuoto.add(getJB_NuovoTM(),null);
			jP_PannelloVuoto.add(getJB_ModificaTM(),null);
			jP_PannelloVuoto.add(getJB_EliminaTM(),null);
		return jP_PannelloVuoto;
	}
 	
	/**
	 * This method initializes jB_Nuovo	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_NuovoTM() {
		if (jB_NuovoTM == null) {
			jB_NuovoTM = new JButton(newico);
			jB_NuovoTM.setBounds(new Rectangle(690, 26, 30, 30));
			jB_NuovoTM.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Nuovo Ente Emettitore");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().inserisciEmissione(idTM);
	        		}
	        });
		}
		return jB_NuovoTM;
	}

	/**
	 * This method initializes jB_Modifica	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_ModificaTM() {
		if (jB_ModificaTM == null) {
			jB_ModificaTM = new JButton(modico);
			jB_ModificaTM.setBounds(new Rectangle(690, 66, 30, 30));
			jB_ModificaTM.setEnabled(false);
		}
		return jB_ModificaTM;
	}

	/**
	 * This method initializes jB_Elimina	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_EliminaTM() {
		if (jB_EliminaTM == null) {
			jB_EliminaTM = new JButton(delico);
			jB_EliminaTM.setBounds(new Rectangle(690, 106, 30, 30));
			jB_EliminaTM.setEnabled(false);
		}
		return jB_EliminaTM;
	}
	/**
	 * This method initializes jT_ValoreNominale	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_ValoreNominale() {
		if (jT_ValoreNominale == null) {
			jT_ValoreNominale = new JTextField();
			jT_ValoreNominale.setBounds(new Rectangle(390, 15, 150, 20));
			jT_ValoreNominale.setEditable(false);
			jT_ValoreNominale.setText(valoreNominale);
		}
		return jT_ValoreNominale;
	}
	/**
	 * This method initializes jT_Unita	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Unita() {
		if (jT_Unita == null) {
			jT_Unita = new JTextField();
			jT_Unita.setBounds(new Rectangle(112, 45, 150, 20));
			jT_Unita.setEditable(false);
			jT_Unita.setText(nomeUnita);
		}
		return jT_Unita;
	}
	/**
	 * This method initializes jT_FattMolt	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_FattMolt() {
		if (jT_FattMolt == null) {
			jT_FattMolt = new JTextField();
			jT_FattMolt.setBounds(new Rectangle(390, 45, 150, 20));
			jT_FattMolt.setEditable(false);
			jT_FattMolt.setText(fattoreMolt);
		}
		return jT_FattMolt;
	}
	/**
	 * This method initializes jT_Spessore	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Spessore() {
		if (jT_Spessore == null) {
			jT_Spessore = new JTextField();
			jT_Spessore.setBounds(new Rectangle(112, 75, 150, 20));
			jT_Spessore.setEditable(false);
			jT_Spessore.setText(spessore);
		}
		return jT_Spessore;
	}
	/**
	 * This method initializes jT_Peso	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Peso() {
		if (jT_Peso == null) {
			jT_Peso = new JTextField();
			jT_Peso.setBounds(new Rectangle(390, 75, 150, 20));
			jT_Peso.setEditable(false);
			jT_Peso.setText(peso);
		}
		return jT_Peso;
	}
	/**
	 * This method initializes jT_Bordo	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Bordo() {
		if (jT_Bordo == null) {
			jT_Bordo = new JTextField();
			jT_Bordo.setBounds(new Rectangle(112, 105, 150, 20));
			jT_Bordo.setEditable(false);
			jT_Bordo.setText(bordo);
		}
		return jT_Bordo;
	}
	/**
	 * This method initializes jT_Dimensione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Dimensione() {
		if (jT_Dimensione == null) {
			jT_Dimensione = new JTextField();
			jT_Dimensione.setBounds(new Rectangle(390, 105, 150, 20));
			jT_Dimensione.setEditable(false);
			jT_Dimensione.setText(dimensione);
		}
		return jT_Dimensione;
	}
	/**
	 * This method initializes jT_Materiale	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Materiale() {
		if (jT_Materiale == null) {
			jT_Materiale = new JTextField();
			jT_Materiale.setBounds(new Rectangle(112, 135, 150, 20));
			jT_Materiale.setEditable(false);
			jT_Materiale.setText(materiale);
		}
		return jT_Materiale;
	}
	
	/**
	 * This method initializes jT_Forma	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Forma() {
		if (jT_Forma == null) {
			jT_Forma = new JTextField();
			jT_Forma.setBounds(new Rectangle(390, 135, 150, 20));
			jT_Forma.setEditable(false);
			jT_Forma.setText(forma);
		}
		return jT_Forma;
	}
}  //  @jve:decl-index=0:visual-constraint="10,10"
