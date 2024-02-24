package easycoin.boundary;

import easycoin.datatype.*;
import easycoin.enumeration.Forma;
import easycoin.executor.*;
import easycoin.store.Unita;
import java.util.Enumeration;
import java.util.Hashtable;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JPanel;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Rectangle;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JButton;

public class InserireTM extends Base {

	private static final long serialVersionUID = -4016270851060768882L;
	
//	Attributi derivati da associazioni
	private GestireEasyCatalogo GEC;  //  @jve:decl-index=0:
//	fine associazioni
	
	private Id EEdelTipo;  
	private InfoTipoMoneta tipo;
	private Id unita;  
	
	String[] unit;
	private JScrollPane un;
	private JPanel jContentPane = null;
	private JPanel jP_Visualizzazione = null;
	private JLabel jL_Descrizione = null;
	private JTextField jT_Descrizione = null;
	private JLabel jL_Note = null;
	private JTextField jT_Note = null;
	private JLabel jL_ParteIntera = null;
	private JTextField jT_ParteIntera = null;
	private JTextField jT_Num = null;
	private JTextField jT_Den = null;
	private JLabel jL_Dimensione = null;
	private JTextField jT_Dimensione = null;
	private JLabel jL_Peso = null;
	private JTextField jT_Peso = null;
	private JLabel jL_Spessore = null;
	private JTextField jT_Spessore = null;
	private JLabel jL_Bordo = null;
	private JTextField jT_Bordo = null;
	private JLabel jL_Materiale = null;
	private JTextField jT_Materiale = null;
	private JLabel jL_Forma = null;
	private JComboBox jCB_Forma = null;
	private JButton jB_Conferma = null;
	private JButton jB_Annulla = null;
	private JLabel jL_IdU = null;
	private JLabel jLTitolo = null;
	private JComboBox jCB_Unita = null;

	//	<<create>> mkInserireTM(Id idEE,GestireEasyCatalogo gec)
	public InserireTM(Id idEE,GestireEasyCatalogo gec){
		super();
		mystate=ATTESA_INFO_TM;
		this.EEdelTipo=idEE;
		this.GEC=gec;
		this.GEC.insTM(this,idEE);
	}
	
	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
        this.setContentPane(getJContentPane());
        this.setTitle("EasyCoin - Inserire Tipo Moneta");
        this.setSize(new Dimension(760, 516));
		this.setVisible(true);	
	}

	public void insTM(InfoTipoMoneta tipo,Id idU){
		switch(mystate){
		case CATALOGO_APERTO:{break;} 
		case ATTESA_CONFERMA_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_EC:{break;}
		case ATTENDI_SCELTA_FILE_IMP_EC:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_EC:{break;}
		case ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC:{break;}
		case RICERCA_IN_EASYCATALOGO:{break;}
		case ATTESA_INFO_COMPLETA_EE:{break;}
		case ATTESA_INFO_COMPLETA_E:{break;}
		case ATTESA_INFO_COMPLETA_TM:{break;}
		case COLLEZIONE_APERTA:{break;} 
		case ATTESA_MONETE_CONTENUTE_NEL_FILE:{break;}
		case ATTENDI_SCELTA_FILE_IMP_M:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_M:{break;}
		case RICERCA_MONETE:{break;}
		case ATTESA_INFO_COMPLETA_M:{break;}
		case ATTESA_CONFERMA_C:{break;}
		case INSERIMENTO_EE_APERTO:{break;}
		case INSERIMENTO_E_APERTO:{break;}
		case INSERIMENTO_TM_APERTO:{
			mystate=ATTESA_CONFERMA_TM;
			this.unita=idU;
			this.tipo=tipo;
			msg=new String("Procedere con l'operazione?");
			JOptionPane question = new JOptionPane(msg,JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
			question.setMessage(msg);
			JDialog dialog = question.createDialog(new JFrame(),"");
			dialog.pack();
			dialog.setVisible(true);
			int n = ((Integer)question.getValue()).intValue();
			if ( n == 0) {
				setVisible(false);
				conferma();
			}
			else {
				annulla();
				}
			break;} 
		case INSERIMENTO_M_APERTO:{break;} 
		case ATTESA_CONFERMA_EE:{break;}
		case ATTESA_CONFERMA_E:{break;} 
		case ATTESA_CONFERMA_TM:{break;} 
		case ATTESA_CONFERMA_M:{break;} 
		case ATTESA_INFO_TM:{break;}
		case ATTESA_INFO_E:{break;}
		case ATTESA_CONTROLLO_DATI_EC:{break;}
		case ATTESA_CONTROLLO_DATI_M:{break;}
		case ATTESA_MODIFICA_EC:{break;}
		case ATTESA_MODIFICA_M:{break;}
		case ATTESA_DATI_EE:{break;} 
		case ATTESA_DATI_E:{break;} 
		case ATTESA_DATI_TM:{break;} 
		case ATTESA_DATI_M:{break;}
		case MODIFICA_EC:{break;}
		case MODIFICA_M:{break;}
		case ATTESA_CONFERMA_MOD_EE:{break;} 
		case ATTESA_CONFERMA_MOD_E:{break;} 
		case ATTESA_CONFERMA_MOD_TM:{break;} 
		case ATTESA_CONFERMA_MOD_M:{break;}
		case FILE_SCELTO_M:{break;} 
		case FILE_SCELTO_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_M:{break;}
		default:{}
		}
	}
		
	public void showU(Hashtable unita){
		switch(mystate){
		case CATALOGO_APERTO:{break;} 
		case ATTESA_CONFERMA_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_EC:{break;}
		case ATTENDI_SCELTA_FILE_IMP_EC:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_EC:{break;}
		case ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC:{break;}
		case RICERCA_IN_EASYCATALOGO:{break;}
		case ATTESA_INFO_COMPLETA_EE:{break;}
		case ATTESA_INFO_COMPLETA_E:{break;}
		case ATTESA_INFO_COMPLETA_TM:{break;}
		case COLLEZIONE_APERTA:{break;} 
		case ATTESA_MONETE_CONTENUTE_NEL_FILE:{break;}
		case ATTENDI_SCELTA_FILE_IMP_M:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_M:{break;}
		case RICERCA_MONETE:{break;}
		case ATTESA_INFO_COMPLETA_M:{break;}
		case ATTESA_CONFERMA_C:{break;}
		case INSERIMENTO_EE_APERTO:{break;}
		case INSERIMENTO_E_APERTO:{break;}
		case INSERIMENTO_TM_APERTO:{break;} 
		case INSERIMENTO_M_APERTO:{break;} 
		case ATTESA_CONFERMA_EE:{break;}
		case ATTESA_CONFERMA_E:{break;} 
		case ATTESA_CONFERMA_TM:{break;} 
		case ATTESA_CONFERMA_M:{break;} 
		case ATTESA_INFO_TM:{
			mystate=INSERIMENTO_TM_APERTO;
			/*Visualizzazione nella interfaccia delle unita*/
			//Per ogni unità visualizza le frazioni relative
			un=GEC.getVIS().getPannelloUnita(unita);
			int k=0;
			unit=new String[unita.size()];
			for (Enumeration u = unita.elements(); u.hasMoreElements();){
				Unita uni=(Unita)u.nextElement();
	    		unit[k]=uni.getId().idToString();
	    		k++;
	    	}
			initialize();
			
			break;}
		case ATTESA_INFO_E:{break;}
		case ATTESA_CONTROLLO_DATI_EC:{break;}
		case ATTESA_CONTROLLO_DATI_M:{break;}
		case ATTESA_MODIFICA_EC:{break;}
		case ATTESA_MODIFICA_M:{break;}
		case ATTESA_DATI_EE:{break;} 
		case ATTESA_DATI_E:{break;} 
		case ATTESA_DATI_TM:{break;} 
		case ATTESA_DATI_M:{break;}
		case MODIFICA_EC:{break;}
		case MODIFICA_M:{break;}
		case ATTESA_CONFERMA_MOD_EE:{break;} 
		case ATTESA_CONFERMA_MOD_E:{break;} 
		case ATTESA_CONFERMA_MOD_TM:{break;} 
		case ATTESA_CONFERMA_MOD_M:{break;}
		case FILE_SCELTO_M:{break;} 
		case CAMBIO_MODALITA_VISUALIZZAZIONE_M:{break;}
		default:{}
		}
	}
	
	public void showF(Hashtable frazioni){
		switch(mystate){
		case CATALOGO_APERTO:{break;} 
		case ATTESA_CONFERMA_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_EC:{break;}
		case ATTENDI_SCELTA_FILE_IMP_EC:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_EC:{break;}
		case ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC:{break;}
		case RICERCA_IN_EASYCATALOGO:{break;}
		case ATTESA_INFO_COMPLETA_EE:{break;}
		case ATTESA_INFO_COMPLETA_E:{break;}
		case ATTESA_INFO_COMPLETA_TM:{break;}
		case COLLEZIONE_APERTA:{break;} 
		case ATTESA_MONETE_CONTENUTE_NEL_FILE:{break;}
		case ATTENDI_SCELTA_FILE_IMP_M:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_M:{break;}
		case RICERCA_MONETE:{break;}
		case ATTESA_INFO_COMPLETA_M:{break;}
		case ATTESA_CONFERMA_C:{break;}
		case INSERIMENTO_EE_APERTO:{break;}
		case INSERIMENTO_E_APERTO:{break;}
		case INSERIMENTO_TM_APERTO:{break;} 
		case INSERIMENTO_M_APERTO:{break;} 
		case ATTESA_CONFERMA_EE:{break;}
		case ATTESA_CONFERMA_E:{break;} 
		case ATTESA_CONFERMA_TM:{break;} 
		case ATTESA_CONFERMA_M:{break;} 
		case ATTESA_INFO_TM:{
			/*Visualizzazione nella interfaccia delle frazioni*/
			//mystate=INSERIMENTO_TM_APERTO;
			break;}
		case ATTESA_INFO_E:{break;}
		case ATTESA_CONTROLLO_DATI_EC:{break;}
		case ATTESA_CONTROLLO_DATI_M:{break;}
		case ATTESA_MODIFICA_EC:{break;}
		case ATTESA_MODIFICA_M:{break;}
		case ATTESA_DATI_EE:{break;} 
		case ATTESA_DATI_E:{break;} 
		case ATTESA_DATI_TM:{break;} 
		case ATTESA_DATI_M:{break;}
		case MODIFICA_EC:{break;}
		case MODIFICA_M:{break;}
		case ATTESA_CONFERMA_MOD_EE:{break;} 
		case ATTESA_CONFERMA_MOD_E:{break;} 
		case ATTESA_CONFERMA_MOD_TM:{break;} 
		case ATTESA_CONFERMA_MOD_M:{break;}
		case FILE_SCELTO_M:{break;} 
		case CAMBIO_MODALITA_VISUALIZZAZIONE_M:{break;}
		default:{}
		}
	}

//	Metodi get e set
	public Id getEEdelTipo() {
		return EEdelTipo;
	}

	public void setEEdelTipo(Id edelTipo) {
		EEdelTipo = edelTipo;
	}

	public GestireEasyCatalogo getGEC() {
		return GEC;
	}

	public void setGEC(GestireEasyCatalogo gec) {
		GEC = gec;
	}

	public InfoTipoMoneta getTipo() {
		return tipo;
	}

	public void setTipo(InfoTipoMoneta tipo) {
		this.tipo = tipo;
	}

	public Id getUnita() {
		return unita;
	}

	public void setUnita(Id unita) {
		this.unita = unita;
	}

	/**
	 * This method initializes jContentPane	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJContentPane() {
		if (jContentPane == null) {
			jLTitolo = new JLabel();
			jLTitolo.setBounds(new Rectangle(27, 16, 300, 20));
			jLTitolo.setText("Unità presenti per l'ente emettitore "+EEdelTipo.idToString());
			jLTitolo.setForeground(new java.awt.Color(255, 255, 255));
			jL_IdU = new JLabel();
			jL_IdU.setBounds(new Rectangle(546, 316, 42, 20));
			jL_IdU.setForeground(new java.awt.Color(255, 255, 255));
			jL_IdU.setText("Unita:");
			jL_Forma = new JLabel();
			jL_Forma.setBounds(new Rectangle(265, 406, 45, 20));
			jL_Forma.setForeground(new java.awt.Color(255, 255, 255));
			jL_Forma.setText("Forma:");
			jL_Materiale = new JLabel();
			jL_Materiale.setBounds(new Rectangle(471, 406, 81, 20));
			jL_Materiale.setForeground(new java.awt.Color(255, 255, 255));
			jL_Materiale.setText("Materiale:");
			jL_Bordo = new JLabel();
			jL_Bordo.setBounds(new Rectangle(25, 406, 81, 20));
			jL_Bordo.setForeground(new java.awt.Color(255, 255, 255));
			jL_Bordo.setText("Bordo:");
			jL_Spessore = new JLabel();
			jL_Spessore.setBounds(new Rectangle(471, 376, 81, 20));
			jL_Spessore.setForeground(new java.awt.Color(255, 255, 255));
			jL_Spessore.setText("Spessore:");
			jL_Peso = new JLabel();
			jL_Peso.setBounds(new Rectangle(265, 376, 45, 20));
			jL_Peso.setForeground(new java.awt.Color(255, 255, 255));
			jL_Peso.setText("Peso:");
			jL_Dimensione = new JLabel();
			jL_Dimensione.setBounds(new Rectangle(25, 376, 81, 20));
			jL_Dimensione.setForeground(new java.awt.Color(255, 255, 255));
			jL_Dimensione.setText("Dimensione:");
			jL_Note = new JLabel();
			jL_Note.setBounds(new Rectangle(358, 316, 43, 20));
			jL_Note.setForeground(new java.awt.Color(255, 255, 255));
			jL_Note.setText("Note:");
			jL_Descrizione = new JLabel();
			jL_Descrizione.setBounds(new Rectangle(25, 316, 81, 20));
			jL_Descrizione.setForeground(new java.awt.Color(255, 255, 255));
			jL_Descrizione.setText("Descrizione:");
			jL_ParteIntera = new JLabel();
			jL_ParteIntera.setText("Valore Nominale (Int - Num - Den):");
			jL_ParteIntera.setBounds(new Rectangle(24, 346, 195, 20));
			jL_ParteIntera.setForeground(new java.awt.Color(255, 255, 255));
			jContentPane = new JPanel();
			jContentPane.setLayout(null);
			jContentPane.setBackground(new java.awt.Color(0, 0, 0));
			jContentPane.add(getJP_Visualizzazione(), null);
			jContentPane.add(jL_Descrizione, null);
			jContentPane.add(getJT_Descrizione(), null);
			jContentPane.add(jL_Note, null);
			jContentPane.add(getJT_Note(), null);
			jContentPane.add(jL_Dimensione, null);
			jContentPane.add(getJT_Dimensione(), null);
			jContentPane.add(jL_Peso, null);
			jContentPane.add(getJT_Peso(), null);
			jContentPane.add(jL_Spessore, null);
			jContentPane.add(getJT_Spessore(), null);
			jContentPane.add(jL_Bordo, null);
			jContentPane.add(getJT_Bordo(), null);
			jContentPane.add(jL_Materiale, null);
			jContentPane.add(getJT_Materiale(), null);
			jContentPane.add(jL_Forma, null);
			jContentPane.add(getJCB_Forma(), null);
			jContentPane.add(getJB_Conferma(), null);
			jContentPane.add(getJB_Annulla(), null);
			jContentPane.add(jL_IdU, null);
			jContentPane.add(getJT_Den(), null);
			jContentPane.add(getJT_Num(), null);
			jContentPane.add(getJT_ParteIntera(), null);
			jContentPane.add(jL_ParteIntera, null);
			jContentPane.add(jLTitolo, null);
			jContentPane.add(getJCB_Unita(), null);
			
		}
		return jContentPane;
	}

	/**
	 * This method initializes jP_Visualizzazione	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Visualizzazione() {
		if (jP_Visualizzazione == null) {
			jP_Visualizzazione = new JPanel();
			jP_Visualizzazione.setLayout(new BorderLayout());
			jP_Visualizzazione.setBounds(new Rectangle(25, 47, 706, 257));
			jP_Visualizzazione.add(this.un,BorderLayout.CENTER);
		}
		return jP_Visualizzazione;
	}

	/**
	 * This method initializes jT_Descrizione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Descrizione() {
		if (jT_Descrizione == null) {
			jT_Descrizione = new JTextField();
			jT_Descrizione.setBounds(new Rectangle(108, 316, 212, 20));
		}
		return jT_Descrizione;
	}

	/**
	 * This method initializes jT_Note	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Note() {
		if (jT_Note == null) {
			jT_Note = new JTextField();
			jT_Note.setBounds(new Rectangle(405, 316, 127, 20));
		}
		return jT_Note;
	}

	/**
	 * This method initializes jT_ParteIntera	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_ParteIntera() {
		if (jT_ParteIntera == null) {
			jT_ParteIntera = new JTextField();
			jT_ParteIntera.setBounds(new Rectangle(225, 346, 42, 20));
		}
		return jT_ParteIntera;
	}

	/**
	 * This method initializes jT_Num	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Num() {
		if (jT_Num == null) {
			jT_Num = new JTextField();
			jT_Num.setBounds(new Rectangle(275, 346, 42, 20));
		}
		return jT_Num;
	}

	/**
	 * This method initializes jT_Den	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Den() {
		if (jT_Den == null) {
			jT_Den = new JTextField();
			jT_Den.setBounds(new Rectangle(325, 346, 42, 20));
		}
		return jT_Den;
	}

	/**
	 * This method initializes jT_Dimensione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Dimensione() {
		if (jT_Dimensione == null) {
			jT_Dimensione = new JTextField();
			jT_Dimensione.setBounds(new Rectangle(108, 376, 127, 20));
		}
		return jT_Dimensione;
	}

	/**
	 * This method initializes jT_Peso	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Peso() {
		if (jT_Peso == null) {
			jT_Peso = new JTextField();
			jT_Peso.setBounds(new Rectangle(312, 376, 127, 20));
		}
		return jT_Peso;
	}

	/**
	 * This method initializes jT_Spessore	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Spessore() {
		if (jT_Spessore == null) {
			jT_Spessore = new JTextField();
			jT_Spessore.setBounds(new Rectangle(555, 376, 129, 20));
		}
		return jT_Spessore;
	}

	/**
	 * This method initializes jT_Bordo	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Bordo() {
		if (jT_Bordo == null) {
			jT_Bordo = new JTextField();
			jT_Bordo.setBounds(new Rectangle(108, 406, 127, 20));
		}
		return jT_Bordo;
	}

	/**
	 * This method initializes jT_Materiale	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Materiale() {
		if (jT_Materiale == null) {
			jT_Materiale = new JTextField();
			jT_Materiale.setBounds(new Rectangle(555, 406, 127, 20));
		}
		return jT_Materiale;
	}

	/**
	 * This method initializes jCB_Forma	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Forma() {
		if (jCB_Forma == null) {
			jCB_Forma = new JComboBox(Forma.FormatoString());
			jCB_Forma.setBounds(new Rectangle(312, 406, 127, 20));
			jCB_Forma.setForeground(new java.awt.Color(255, 255, 255));
			jCB_Forma.setBackground(new java.awt.Color(0, 0, 0));
		}
		return jCB_Forma;
	}

	/**
	 * This method initializes jB_Conferma	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Conferma() {
		if (jB_Conferma == null) {
			jB_Conferma = new JButton();
			jB_Conferma.setBounds(new Rectangle(470, 450, 97, 24));
			jB_Conferma.setText("Conferma");
			jB_Conferma.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed() Conferma Inserimento Tipo Moneta"); 
					// TODO Auto-generated Event stub actionPerformed()
					try{
					unita=new Id((String)jCB_Unita.getSelectedItem());
					tipo=new InfoTipoMoneta();
					tipo.setDescrizione(jT_Descrizione.getText());
					tipo.setNota(jT_Note.getText());
					ValoreNominale vnom=new ValoreNominale(new Integer(jT_ParteIntera.getText()).intValue(),new Integer(jT_Num.getText()).intValue(),new Integer(jT_Den.getText()).intValue());
					tipo.setVnom(vnom);
					tipo.setDimensione(new Float(jT_Dimensione.getText()).floatValue());
					tipo.setPeso(new Float(jT_Peso.getText()).floatValue());
					tipo.setSpessore(new Float(jT_Spessore.getText()).floatValue());
					tipo.setBordo(jT_Bordo.getText());
					tipo.setForma(Forma.valueOf((String)jCB_Forma.getSelectedItem()));
					tipo.setMateriale(jT_Materiale.getText());
					insTM(tipo,unita);
					}catch(java.lang.NumberFormatException ex){
						msg=new String("Parte Intera, Numeratore \n Denominatore, Dimensione \n Peso, Spessore \n devono essere numeri");
						JOptionPane.showMessageDialog(new JFrame(),msg,"Errore",JOptionPane.ERROR_MESSAGE);
						}
				}
			});
		}
		return jB_Conferma;
	}

	/**
	 * This method initializes jB_Annulla	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Annulla() {
		if (jB_Annulla == null) {
			jB_Annulla = new JButton();
			jB_Annulla.setBounds(new Rectangle(580, 450, 97, 24));
			jB_Annulla.setText("Annulla");
			jB_Annulla.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed() Annulla Inserimento Tipo Moneta");
					// TODO Auto-generated Event stub actionPerformed()
					mystate = CATALOGO_APERTO;
					setVisible(false);
					GEC.getAEC().setVisible(true);
					GEC.ko();
				}
			});
		}
		return jB_Annulla;
	}

	/**
	 * This method initializes jCB_Unita	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Unita() {
		if (jCB_Unita == null) {
			jCB_Unita = new JComboBox(unit);
			jCB_Unita.setBounds(new Rectangle(593, 315, 111, 20));
			jCB_Unita.setForeground(new java.awt.Color(255, 255, 255));
			jCB_Unita.setBackground(new java.awt.Color(0, 0, 0));
		}
		return jCB_Unita;
	}
		
}  //  @jve:decl-index=0:visual-constraint="10,10"
