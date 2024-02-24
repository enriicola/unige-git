package easycoin.datatype.visualizzazione;

import java.util.Hashtable;
import java.awt.Dimension;
import java.awt.Rectangle;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JTextArea;

import easycoin.calculator.Visualizza;
import easycoin.datatype.Id;

@SuppressWarnings("serial")
public class EESezioneCompleto extends EESezioneRidotto {

	protected String nomeOriginale;
	protected String dataInizio;
	protected String dataFine;
	protected String note;
	protected Hashtable zecche; 
	protected Hashtable sistemiMonetari; 
	//private JLabel jL_IdEE = null;
	private JLabel jL_Nome = null;
	private JTextField jT_Nome = null;
	private JLabel jL_AreaGeografica = null;
	private JTextField jT_AreaGeografica = null;
	private JScrollPane jSP_TipiMonete = null;  
	private JLabel jL_NomeOriginale = null;
	private JTextField jT_NomeOriginale = null;
	private JLabel jL_DataInizio = null;
	private JTextField jT_DataInizio = null;
	private JLabel jL_DataFine = null;
	private JTextField jT_DataFine = null;
	//private JLabel jL_Note = null;
	private JTextArea jTA_Note = null;
	private JScrollPane jSP_Zecche = null;
	private JScrollPane jSP_SistemiMonetari = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	private JButton jB_NuovoTM = null;
	private JButton jB_ModificaTM = null;
	private JButton jB_EliminaTM = null;
	private JPanel jP_PannelloTipi = null;
	private JPanel auxT = null;
	private JPanel jP_PannelloZecche = null;
	private JPanel auxZ = null;
	private JPanel jP_PannelloSistemi = null;
	private JPanel auxS = null;
	
	public EESezioneCompleto(Visualizza v,Id idEE, String nome, String areaGeografica, Hashtable tipiMonete, String nomeOriginale, String dataInizio, String dataFine, String note, Hashtable zecche, Hashtable sistemiMonetari) {
		super(v,idEE, nome, areaGeografica, tipiMonete);
		this.nomeOriginale = nomeOriginale;
		this.dataInizio = dataInizio;
		this.dataFine = dataFine;
		this.note = note;
		this.zecche = zecche;
		this.sistemiMonetari = sistemiMonetari;
	}

	
	public EESezioneCompleto(Visualizza vis) {
		super(vis);
		// TODO Auto-generated constructor stub
	}


/**
	 * This method initializes this
	 * 
	 */
	public void initialize() {
        this.setLayout(null);
        this.setSize(new Dimension(954, 932));
        if (idEE!=null){
			//jL_Note = new JLabel();
			//jL_Note.setBounds(new Rectangle(274, 40, 92, 20));
			//jL_Note.setText("Note:");
			jL_DataFine = new JLabel();
			jL_DataFine.setBounds(new Rectangle(15, 110, 96, 20));
			jL_DataFine.setText("Data Fine:");
			jL_DataInizio = new JLabel();
			jL_DataInizio.setBounds(new Rectangle(15, 80, 96, 20));
			jL_DataInizio.setText("Data Inizio:");
			jL_NomeOriginale = new JLabel();
			jL_NomeOriginale.setBounds(new Rectangle(15, 50, 96, 20));
			jL_NomeOriginale.setText("Nome Originale:");
			jL_AreaGeografica = new JLabel();
	        jL_AreaGeografica.setBounds(new Rectangle(274, 20, 102, 20));
	        jL_AreaGeografica.setText("Area Geografica:");
	        jL_Nome = new JLabel();
	        jL_Nome.setBounds(new Rectangle(15, 20, 96, 20));
	        jL_Nome.setText("Ente Emettitore:");
	        //jL_IdEE = new JLabel();
	        //jL_IdEE.setBounds(new Rectangle(6, 6, 20, 20));
	        //jL_IdEE.setText(idEE.idToString());
	        //this.add(jL_IdEE, null);
	        this.add(jL_Nome, null);
	        this.add(getJT_Nome(), null);
	        this.add(jL_AreaGeografica, null);
	        this.add(getJT_AreaGeografica(), null);
	        this.add(jL_NomeOriginale, null);
	        this.add(getJT_NomeOriginale(), null);
	        this.add(jL_DataInizio, null);
	        this.add(getJT_DataInizio(), null);
	        this.add(jL_DataFine, null);
	        this.add(getJT_DataFine(), null);
	        //this.add(jL_Note, null);
	        this.add(getJTA_Note(), null);
	        this.add(getJSP_Zecche(), null);
	        this.add(getJSP_TipiMonete(),null);
	        this.add(getJSP_SistemiMonetari(), null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Ente Emettitore Sezione Completa"));
	}
	
	/**
	 * This method initializes jB_Nuovo	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Nuovo() {
		if (jB_Nuovo == null) {
			jB_Nuovo = new JButton(newico);
			jB_Nuovo.setBounds(new Rectangle(860, 26, 30, 30));
			jB_Nuovo.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Nuovo Ente Emettitore");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().inserisciEnteEmettitore();
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
			if(idEE==null)
				jB_Modifica.setEnabled(false);
			jB_Modifica.setBounds(new Rectangle(860, 66, 30, 30));
			jB_Modifica.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Modifica Ente Emettitore");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().modificaEnteEmettitore(idEE);
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
			if(idEE==null)
				jB_Elimina.setEnabled(false);
			jB_Elimina.setBounds(new Rectangle(860, 106, 30, 30));
			jB_Elimina.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Elimina Ente Emettitore");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().eliminaEnteEmettitore(idEE);
	        	}
	        });
		}
		return jB_Elimina;
	}

	//	Metodi get e set
	public String getDataFine() {
		return dataFine;
	}

	public void setDataFine(String dataFine) {
		this.dataFine = dataFine;
	}

	public String getDataInizio() {
		return dataInizio;
	}

	public void setDataInizio(String dataInizio) {
		this.dataInizio = dataInizio;
	}

	public String getNomeOriginale() {
		return nomeOriginale;
	}

	public void setNomeOriginale(String nomeOriginale) {
		this.nomeOriginale = nomeOriginale;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public Hashtable getSistemiMonetari() {
		return sistemiMonetari;
	}

	public void setSistemiMonetari(Hashtable sistemiMonetari) {
		this.sistemiMonetari = sistemiMonetari;
	}

	public Hashtable getZecche() {
		return zecche;
	}

	public void setZecche(Hashtable zecche) {
		this.zecche = zecche;
	}
	/**
	 * This method initializes jT_Nome	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Nome() {
		if (jT_Nome == null) {
			jT_Nome = new JTextField();
			jT_Nome.setBounds(new Rectangle(118, 20, 146, 20));
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
			jT_AreaGeografica.setBounds(new Rectangle(380, 20, 186, 20));
			jT_AreaGeografica.setEditable(false);
			jT_AreaGeografica.setText(areaGeografica);
		}
		return jT_AreaGeografica;
	}

	/**
	 * This method initializes jSP_TipiMonete	
	 * 	
	 * @return javax.swing.JScrollPane	
	 */
	private JScrollPane getJSP_TipiMonete() {
		if (jSP_TipiMonete == null) {
			jSP_TipiMonete = new JScrollPane();
			jSP_TipiMonete.setBounds(new Rectangle(15, 540, 890, 390));
			jSP_TipiMonete.setBorder(javax.swing.BorderFactory.createTitledBorder("Tipi Monete"));
			jSP_TipiMonete.getViewport().add(getJP_PannelloTipi());
			jSP_TipiMonete.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		}
		return jSP_TipiMonete;
	}

	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_PannelloTipi() {
		if (jP_PannelloTipi == null) {
			java.awt.GridBagConstraints gridBagConstraints;
			jP_PannelloTipi = new JPanel();
			jP_PannelloTipi.setLayout(new java.awt.GridBagLayout());
			for (int i=0;i<tipiMonete.size();i++){
				auxT=(JPanel)tipiMonete.get(new Integer(i));
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 890;
		        gridBagConstraints.ipady = auxT.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets((i*auxT.getHeight()), 10, 106, 21);
		        jP_PannelloTipi.add(auxT,gridBagConstraints);
			}
			if (tipiMonete.size()==0){
				JPanel p=getJP_PannelloVuoto();
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 890;
		        gridBagConstraints.ipady = p.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets(0, 10, 106, 21);
		        jP_PannelloTipi.add(p,gridBagConstraints);
			}
		}
		return jP_PannelloTipi;
	}
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_PannelloVuoto() {
			JPanel jP_PannelloVuoto = new JPanel();
			jP_PannelloVuoto.setLayout(null);
			jP_PannelloVuoto.setSize(new Dimension(890, 160));
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
	        		Vis.getAEC().inserisciTipoMoneta(idEE);
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
	 * This method initializes jT_NomeOriginale	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_NomeOriginale() {
		if (jT_NomeOriginale == null) {
			jT_NomeOriginale = new JTextField();
			jT_NomeOriginale.setBounds(new Rectangle(118, 50, 146, 20));
			jT_NomeOriginale.setEditable(false);
			jT_NomeOriginale.setText(nomeOriginale);
		}
		return jT_NomeOriginale;
	}

	/**
	 * This method initializes jT_DataInizio	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_DataInizio() {
		if (jT_DataInizio == null) {
			jT_DataInizio = new JTextField();
			jT_DataInizio.setBounds(new Rectangle(118, 80, 146, 20));
			jT_DataInizio.setEditable(false);
			jT_DataInizio.setText(dataInizio);
		}
		return jT_DataInizio;
	}

	/**
	 * This method initializes jT_DataFine	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_DataFine() {
		if (jT_DataFine == null) {
			jT_DataFine = new JTextField();
			jT_DataFine.setBounds(new Rectangle(118, 110, 146, 20));
			jT_DataFine.setEditable(false);
			jT_DataFine.setText(dataFine);
		}
		return jT_DataFine;
	}

	/**
	 * This method initializes jTA_Note	
	 * 	
	 * @return javax.swing.JTextArea	
	 */
	private JTextArea getJTA_Note() {
		if (jTA_Note == null) {
			jTA_Note = new JTextArea();
			jTA_Note.setBounds(new Rectangle(274, 50, 292, 80));
			jTA_Note.setEditable(false);
			jTA_Note.setText(note);
		}
		return jTA_Note;
	}

	/**
	 * This method initializes jSP_Zecche	
	 * 	
	 * @return javax.swing.JScrollPane	
	 */
	private JScrollPane getJSP_Zecche() {
		if (jSP_Zecche == null) {
			jSP_Zecche = new JScrollPane();
			jSP_Zecche.setBounds(new Rectangle(15, 140, 650, 190));
			jSP_Zecche.setBorder(javax.swing.BorderFactory.createTitledBorder("Zecche"));
			jSP_Zecche.getViewport().add(getJP_PannelloZecche());
			jSP_Zecche.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		}
		return jSP_Zecche;
	}

	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_PannelloZecche() {
		if (jP_PannelloZecche == null) {
			java.awt.GridBagConstraints gridBagConstraints;
			jP_PannelloZecche = new JPanel();
			jP_PannelloZecche.setLayout(new java.awt.GridBagLayout());
			for (int i=0;i<zecche.size();i++){
				auxZ=(JPanel)zecche.get(new Integer(i));
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 760;
		        gridBagConstraints.ipady = auxZ.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets((i*auxZ.getHeight()), 10, 106, 21);
		        jP_PannelloZecche.add(auxZ,gridBagConstraints);
			}
		}
		return jP_PannelloZecche;
	}
	
	/**
	 * This method initializes jSP_SistemiMonetari	
	 * 	
	 * @return javax.swing.JScrollPane	
	 */
	private JScrollPane getJSP_SistemiMonetari() {
		if (jSP_SistemiMonetari == null) {
			jSP_SistemiMonetari = new JScrollPane();
			jSP_SistemiMonetari.setBounds(new Rectangle(15, 340, 650, 190));
			jSP_SistemiMonetari.setBorder(javax.swing.BorderFactory.createTitledBorder("Sistemi Monetari"));
			jSP_SistemiMonetari.getViewport().add(getJP_PannelloSistemi());
			jSP_SistemiMonetari.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		}
		return jSP_SistemiMonetari;
	}
	
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_PannelloSistemi() {
		if (jP_PannelloSistemi == null) {
			java.awt.GridBagConstraints gridBagConstraints;
			jP_PannelloSistemi = new JPanel();
			jP_PannelloSistemi.setLayout(new java.awt.GridBagLayout());
			for (int i=0;i<sistemiMonetari.size();i++){
				auxS=(JPanel)sistemiMonetari.get(new Integer(i));
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 760;
		        gridBagConstraints.ipady = auxS.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets((i*auxS.getHeight()), 10, 106, 21);
		        jP_PannelloSistemi.add(auxS,gridBagConstraints);
			}
		}
		return jP_PannelloSistemi;
	}
	
}  //  @jve:decl-index=0:visual-constraint="10,10"
