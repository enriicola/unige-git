package easycoin.datatype.visualizzazione;

import java.awt.Dimension;
import java.awt.Rectangle;
import java.util.Hashtable;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;

import easycoin.calculator.Visualizza;
import easycoin.datatype.*;

@SuppressWarnings("serial")
public class MSchedaCompleto extends ESchedaCompleto {

	protected Id idM;
	protected String grado;
	protected String stato;
	protected String valoreCommerciale;
	//private JLabel jL_Id = null;
	private JLabel jL_EnteEmettitore = null;
	private JTextField jT_Nome = null;
	private JLabel jL_AreaGeografica = null;
	private JTextField jT_AreaGeografica = null;
	private JLabel jL_NomeOriginale = null;
	private JTextField jT_NomeOriginale = null;
	//private JLabel jL_Note = null;
	private JTextArea jTA_Note = null;
	private JLabel jL_DataInizio = null;
	private JTextField jT_DataInizio = null;
	private JLabel jL_DataFine = null;
	private JTextField jT_DataFine = null;
	private JScrollPane jSP_Zecche = null;
	private JScrollPane jSP_SistemiMonetari = null;
	//private JLabel jL_IdTM = null;
	private JLabel jL_Descrizione = null;
	private JTextField jT_Descrizione = null;
	private JLabel jL_ValoreNominale = null;
	private JTextField jT_ValoreNominale = null;
	private JLabel jL_NomeUnita = null;
	private JTextField jT_Unita = null;
	private JLabel jL_FattMolt = null;
	private JTextField jT_FattMolt = null;
	private JLabel jL_Spessore = null;
	private JTextField jT_Spessore = null;
	private JLabel jL_Peso = null;
	private JTextField jT_Peso = null;
	private JLabel jL_Forma = null;
	private JLabel jL_Bordo = null;
	private JTextField jT_Bordo = null;
	private JTextField jT_Forma = null;
	private JLabel jL_Dimensione = null;
	private JLabel jL_Materiale = null;
	private JTextField jT_Dimensione = null;
	private JTextField jT_Materiale = null;
	//private JLabel jL_IdE = null;
	private JLabel jL_Anno = null;
	private JTextField jT_Anno = null;
	private JLabel jL_Zecca = null;
	private JTextField jT_Zecca = null;
	private JLabel jL_Grado = null;
	private JTextField jT_Grado = null;
	private JLabel jL_Stato = null;
	private JTextField jT_Stato = null;
	//private JLabel jL_IdM = null;
	private JLabel jL_ValoreCommerciale = null;
	private JTextField jT_ValoreCommerciale = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	private JPanel jP_PannelloZecche = null;
	private JPanel auxZ = null;
	private JPanel jP_PannelloSistemi = null;
	private JPanel auxS = null;	

	public MSchedaCompleto(Visualizza v,Id idEE, String nome, String areaGeografica, String nomeOriginale, String dataInizio, String dataFine, String note, Hashtable zecche, Hashtable sistemiMonetari, Id idTM, String descrizione, String valoreNominale, String nomeUnita, String fattoreMolt, String spessore, String peso, String bordo, String dimensione, String forma, String materiale, Id idE, String anno, String zecca, Id idM, String grado, String stato, String valoreCommerciale) {
		super(v,idEE, nome, areaGeografica, nomeOriginale, dataInizio, dataFine, note, zecche, sistemiMonetari, idTM, descrizione, valoreNominale, nomeUnita, fattoreMolt, spessore, peso, bordo, dimensione, forma, materiale, idE, anno, zecca);
		this.idM = idM;
		this.grado = grado;
		this.stato = stato;
		this.valoreCommerciale = valoreCommerciale;
	}

	/**
	 * This method initializes this
	 * 
	 */
	public void initialize() {
        
        //jL_IdM = new JLabel();
        //jL_IdM.setText(idM.idToString());
        //jL_IdM.setBounds(new Rectangle(90, 501, 20, 20));
		jL_Zecca = new JLabel();
		jL_Zecca.setBounds(new Rectangle(332, 471, 104, 20));
		jL_Zecca.setText("Zecca:");
		jL_Anno = new JLabel();
		jL_Anno.setBounds(new Rectangle(152, 471, 39, 20));
		jL_Anno.setText("Anno:");
		//jL_IdE = new JLabel();
		//jL_IdE.setBounds(new Rectangle(115, 471, 20, 20));
		//jL_IdE.setText(idE.idToString());
		jL_Materiale = new JLabel();
		jL_Materiale.setBounds(new Rectangle(332, 441, 104, 20));
		jL_Materiale.setText("Materiale:");
		jL_Dimensione = new JLabel();
		jL_Dimensione.setBounds(new Rectangle(332, 411, 104, 20));
		jL_Dimensione.setText("Dimensione:");
		jL_Bordo = new JLabel();
		jL_Bordo.setBounds(new Rectangle(85, 411, 80, 20));
		jL_Bordo.setText("Bordo:");
		jL_Forma = new JLabel();
		jL_Forma.setBounds(new Rectangle(85, 441, 80, 20));
		jL_Forma.setText("Forma:");
		jL_Peso = new JLabel();
		jL_Peso.setBounds(new Rectangle(332, 381, 104, 20));
		jL_Peso.setText("Peso:");
		jL_Spessore = new JLabel();
		jL_Spessore.setBounds(new Rectangle(85, 381, 80, 20));
		jL_Spessore.setText("Spessore:");
		jL_FattMolt = new JLabel();
		jL_FattMolt.setBounds(new Rectangle(332, 351, 117, 20));
		jL_FattMolt.setText("Fattore Molteplicit�:");
		jL_NomeUnita = new JLabel();
		jL_NomeUnita.setBounds(new Rectangle(85, 351, 80, 20));
		jL_NomeUnita.setText("Unit�:");
		jL_ValoreNominale = new JLabel();
		jL_ValoreNominale.setBounds(new Rectangle(332, 321, 104, 20));
		jL_ValoreNominale.setText("Valore Nominale:");
		jL_Descrizione = new JLabel();
		jL_Descrizione.setBounds(new Rectangle(85, 321, 80, 20));
		jL_Descrizione.setText("Descrizione:");
		//jL_IdTM = new JLabel();
		//jL_IdTM.setBounds(new Rectangle(45, 321, 20, 20));
		//jL_IdTM.setText(idTM.idToString());
        jL_DataFine = new JLabel();
        jL_DataFine.setBounds(new Rectangle(15, 121, 94, 20));
        jL_DataFine.setText("Data Fine:");
        jL_DataInizio = new JLabel();
        jL_DataInizio.setBounds(new Rectangle(15, 91, 94, 20));
        jL_DataInizio.setText("Data Inizio:");
        //jL_Note = new JLabel();
        //jL_Note.setBounds(new Rectangle(285, 61, 100, 20));
        //jL_Note.setText("Note:");
        jL_NomeOriginale = new JLabel();
        jL_NomeOriginale.setBounds(new Rectangle(15, 61, 94, 20));
        jL_NomeOriginale.setText("Nome Originale:");
        jL_AreaGeografica = new JLabel();
        jL_AreaGeografica.setBounds(new Rectangle(285, 31, 100, 20));
        jL_AreaGeografica.setText("Area Geografica:");
        jL_EnteEmettitore = new JLabel();
        jL_EnteEmettitore.setBounds(new Rectangle(15, 31, 94, 20));
        jL_EnteEmettitore.setText("Ente Emettitore:");
        //jL_Id = new JLabel();
        //jL_Id.setBounds(new Rectangle(6, 6, 20, 20));
        //jL_Id.setText(idEE.idToString());
        this.setLayout(null);
        this.setSize(new Dimension(760, 560));
        //this.add(jL_Id, null);
        this.add(jL_EnteEmettitore, null);
        this.add(getJT_Nome(), null);
        this.add(jL_AreaGeografica, null);
        this.add(getJT_AreaGeografica(), null);
        this.add(jL_NomeOriginale, null);
        this.add(getJT_NomeOriginale(), null);
        //this.add(jL_Note, null);
        this.add(getJTA_Note(), null);
        this.add(jL_DataInizio, null);
        this.add(getJT_DataInizio(), null);
        this.add(jL_DataFine, null);
        this.add(getJT_DataFine(), null);
        this.add(getJSP_Zecche(), null);
        this.add(getJSP_SistemiMonetari(), null);
        //this.add(jL_IdTM, null);
        this.add(jL_Descrizione, null);
        this.add(getJT_Descrizione(), null);
        this.add(jL_ValoreNominale, null);
        this.add(getJT_ValoreNominale(), null);
        this.add(jL_NomeUnita, null);
        this.add(getJT_Unita(), null);
        this.add(jL_FattMolt, null);
        this.add(getJT_FattMolt(), null);
        this.add(jL_Spessore, null);
        this.add(getJT_Spessore(), null);
        this.add(jL_Peso, null);
        this.add(getJT_Peso(), null);
        this.add(jL_Forma, null);
        this.add(jL_Bordo, null);
        this.add(getJT_Bordo(), null);
        this.add(getJT_Forma(), null);
        this.add(jL_Dimensione, null);
        this.add(jL_Materiale, null);
        this.add(getJT_Dimensione(), null);
        this.add(getJT_Materiale(), null);
        //this.add(jL_IdE, null);
        this.add(jL_Anno, null);
        this.add(getJT_Anno(), null);
        this.add(jL_Zecca, null);
        this.add(getJT_Zecca(), null);
        //this.add(jL_IdM, null);
        if (idM!=null){
	        jL_ValoreCommerciale = new JLabel();
	        jL_ValoreCommerciale.setBounds(new Rectangle(45, 531, 100, 20));
	        jL_ValoreCommerciale.setText("Valore Commerciale:");
	        jL_Stato = new JLabel();
	        jL_Stato.setBounds(new Rectangle(341, 501, 60, 20));
	        jL_Stato.setText("Stato:");
	        jL_Grado = new JLabel();
	        jL_Grado.setBounds(new Rectangle(115, 501, 60, 20));
	        jL_Grado.setText("Grado:");
	        this.add(jL_Grado, null);
	        this.add(jL_ValoreCommerciale,null);
	        this.add(getJT_ValoreCommerciale(),null);
	        this.add(getJT_Grado(), null);
	        this.add(jL_Stato, null);
	        this.add(getJT_Stato(), null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Moneta Scheda Completa"));
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

	public String getValoreCommerciale() {
		return valoreCommerciale;
	}

	public void setValoreCommerciale(String valoreCommerciale) {
		this.valoreCommerciale = valoreCommerciale;
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
	 * This method initializes jT_NomeOriginale	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_NomeOriginale() {
		if (jT_NomeOriginale == null) {
			jT_NomeOriginale = new JTextField();
			jT_NomeOriginale.setBounds(new Rectangle(113, 61, 143, 20));
			jT_NomeOriginale.setEditable(false);
			jT_NomeOriginale.setText(nomeOriginale);
		}
		return jT_NomeOriginale;
	}

	/**
	 * This method initializes jTA_Note	
	 * 	
	 * @return javax.swing.JTextArea	
	 */
	private JTextArea getJTA_Note() {
		if (jTA_Note == null) {
			jTA_Note = new JTextArea();
			jTA_Note.setBounds(new Rectangle(397, 61, 173, 80));
			jTA_Note.setEditable(false);
			jTA_Note.setText(note);
		}
		return jTA_Note;
	}

	/**
	 * This method initializes jT_DataInizio	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_DataInizio() {
		if (jT_DataInizio == null) {
			jT_DataInizio = new JTextField();
			jT_DataInizio.setBounds(new Rectangle(113, 91, 143, 20));
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
			jT_DataFine.setBounds(new Rectangle(113, 121, 143, 20));
			jT_DataFine.setEditable(false);
			jT_DataFine.setText(dataFine);
		}
		return jT_DataFine;
	}

	/**
	 * This method initializes jSP_Zecche	
	 * 	
	 * @return javax.swing.JScrollPane	
	 */
	private JScrollPane getJSP_Zecche() {
		if (jSP_Zecche == null) {
			jSP_Zecche = new JScrollPane();
			jSP_Zecche.setBounds(new Rectangle(15, 151, 555, 75));
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
			jSP_SistemiMonetari.setBounds(new Rectangle(15, 236, 555, 75));
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

	/**
	 * This method initializes jT_Descrizione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Descrizione() {
		if (jT_Descrizione == null) {
			jT_Descrizione = new JTextField();
			jT_Descrizione.setBounds(new Rectangle(172, 321, 145, 20));
			jT_Descrizione.setEditable(false);
			jT_Descrizione.setText(descrizione);
		}
		return jT_Descrizione;
	}

	/**
	 * This method initializes jT_ValoreNominale	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_ValoreNominale() {
		if (jT_ValoreNominale == null) {
			jT_ValoreNominale = new JTextField();
			jT_ValoreNominale.setBounds(new Rectangle(443, 321, 123, 20));
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
			jT_Unita.setBounds(new Rectangle(172, 351, 145, 20));
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
			jT_FattMolt.setBounds(new Rectangle(454, 351, 112, 20));
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
			jT_Spessore.setBounds(new Rectangle(172, 381, 145, 20));
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
			jT_Peso.setBounds(new Rectangle(443, 381, 123, 20));
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
			jT_Bordo.setBounds(new Rectangle(172, 411, 145, 20));
			jT_Bordo.setEditable(false);
			jT_Bordo.setText(bordo);
		}
		return jT_Bordo;
	}

	/**
	 * This method initializes jT_Forma	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Forma() {
		if (jT_Forma == null) {
			jT_Forma = new JTextField();
			jT_Forma.setBounds(new Rectangle(172, 441, 145, 20));
			jT_Forma.setEditable(false);
			jT_Forma.setText(forma);
		}
		return jT_Forma;
	}

	/**
	 * This method initializes jT_Dimensione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Dimensione() {
		if (jT_Dimensione == null) {
			jT_Dimensione = new JTextField();
			jT_Dimensione.setBounds(new Rectangle(443, 411, 123, 20));
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
			jT_Materiale.setBounds(new Rectangle(443, 441, 123, 20));
			jT_Materiale.setEditable(false);
			jT_Materiale.setText(materiale);
		}
		return jT_Materiale;
	}

	/**
	 * This method initializes jT_Anno	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Anno() {
		if (jT_Anno == null) {
			jT_Anno = new JTextField();
			jT_Anno.setBounds(new Rectangle(200, 471, 116, 20));
			jT_Anno.setEditable(false);
			jT_Anno.setText(anno);
		}
		return jT_Anno;
	}

	/**
	 * This method initializes jT_Zecca	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Zecca() {
		if (jT_Zecca == null) {
			jT_Zecca = new JTextField();
			jT_Zecca.setBounds(new Rectangle(443, 471, 123, 20));
			jT_Zecca.setEditable(false);
			jT_Zecca.setText(zecca);
		}
		return jT_Zecca;
	}
	/**
	 * This method initializes jT_Grado	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Grado() {
		if (jT_Grado == null) {
			jT_Grado = new JTextField();
			jT_Grado.setBounds(new Rectangle(165, 501, 150, 20));
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
			jT_Stato.setBounds(new Rectangle(400, 501, 165, 20));
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
			jT_ValoreCommerciale.setBounds(new Rectangle(168, 531, 173, 20));
			jT_ValoreCommerciale.setEditable(false);
			jT_ValoreCommerciale.setText(valoreCommerciale);
		}
		return jT_ValoreCommerciale;
	}
	
}
