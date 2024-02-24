package easycoin.boundary;

import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JRadioButton;
import javax.swing.JTextField;

import easycoin.enumeration.Grado;
import easycoin.executor.*;
import easycoin.datatype.*;
import easycoin.datatype.visualizzazione.Visualizzazione;
import javax.swing.JPanel;
import java.awt.Dimension;
import java.awt.Rectangle;

public class ModificareM extends Base {

	private static final long serialVersionUID = -400434862835498200L;

	//	Attributi derivati da associazioni
	private GestireCollezione GC;
//	fine associazioni
	
	private Id idM;  //  @jve:decl-index=0:

	private JPanel jContentPane = null;
	private JLabel jL_Grado = null;
	private JComboBox jC_Grado = null;
	private JLabel jLValore = null;
	private JTextField jT_Valore = null;
	private JLabel jL_Stato = null;
	private JButton jB_Conferma = null;
	private JButton jB_Annulla = null;
	private JRadioButton jR_Presente = null;
	private JRadioButton jR_Virtuale = null;
	private JRadioButton jR_Incollezione = null;
	private JRadioButton jR_Cedibile = null;
	private JRadioButton jR_DestinataA = null;
	private JPanel jP_Visualizzazione = null;
	
//	<<create>> mkModificareM(Id idM,GestireCollezione gc)
	public ModificareM(Id idM,GestireCollezione gc){
		super();
		mystate=ATTESA_MODIFICA_M;
		initialize();
		this.GC=gc;
		this.idM=idM;
		GC.modM(this,idM);
	}
	
	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
        this.setContentPane(getJContentPane());
		this.setTitle("EasyCoin - Modificare Moneta");	
		this.setSize(new Dimension(684, 674));
	}
	/**
	 * This method initializes jContentPane	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJContentPane() {
		if (jContentPane == null) {
			jL_Stato = new JLabel();
			jL_Stato.setBounds(new Rectangle(30, 495, 43, 20));
			jL_Stato.setText("Stato:");
			jLValore = new JLabel();
			jLValore.setBounds(new Rectangle(322, 455, 125, 20));
			jLValore.setText("Valore Commerciale:");
			jL_Grado = new JLabel();
			jL_Grado.setBounds(new Rectangle(30, 455, 108, 20));
			jL_Grado.setText("Grado Bellezza:");
			jContentPane = new JPanel();
			jContentPane.setLayout(null);
			jContentPane.setBackground(new java.awt.Color(255, 255, 255));
			jContentPane.add(jL_Grado, null);
			jContentPane.add(getJC_Grado(), null);
			jContentPane.add(jLValore, null);
			jContentPane.add(getJT_Valore(), null);
			jContentPane.add(jL_Stato, null);
			jContentPane.add(getJB_Conferma(), null);
			jContentPane.add(getJB_Annulla(), null);
			jContentPane.add(getJR_Presente(), null);
			jContentPane.add(getJR_Virtuale(), null);
			jContentPane.add(getJR_Incollezione(), null);
			jContentPane.add(getJR_Cedibile(), null);
			jContentPane.add(getJR_DestinataA(), null);
			jContentPane.add(getJP_Visualizzazione(), null);
			ButtonGroup BG_Stato = new ButtonGroup();
			BG_Stato.add(getJR_Virtuale());
			BG_Stato.add(getJR_Presente());
			ButtonGroup BG_StatoPresente = new ButtonGroup();
			BG_StatoPresente.add(getJR_Incollezione());
			BG_StatoPresente.add(getJR_Cedibile());
			BG_StatoPresente.add(getJR_DestinataA());
		}
		return jContentPane;
	}

	/**
	 * This method initializes jC_Grado	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJC_Grado() {
		if (jC_Grado == null) {
			jC_Grado = new JComboBox(Grado.GradotoString());
			jC_Grado.setBounds(new Rectangle(150, 455, 128, 20));
			jC_Grado.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jC_Grado;
	}

	/**
	 * This method initializes jT_Valore	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Valore() {
		if (jT_Valore == null) {
			jT_Valore = new JTextField();
			jT_Valore.setBounds(new Rectangle(459, 455, 141, 20));
		}
		return jT_Valore;
	}

	/**
	 * This method initializes jB_Conferma	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Conferma() {
		if (jB_Conferma == null) {
			jB_Conferma = new JButton();
			jB_Conferma.setBounds(new Rectangle(442, 595, 103, 24));
			jB_Conferma.setText("Conferma");
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
			jB_Annulla.setBounds(new Rectangle(561, 595, 103, 24));
			jB_Annulla.setText("Annulla");
		}
		return jB_Annulla;
	}

	/**
	 * This method initializes jR_Presente	
	 * 	
	 * @return javax.swing.JRadioButton	
	 */
	private JRadioButton getJR_Presente() {
		if (jR_Presente == null) {
			jR_Presente = new JRadioButton();
			jR_Presente.setBounds(new Rectangle(89, 495, 124, 20));
			jR_Presente.setText("Presente");
			jR_Presente.setBackground(new java.awt.Color(255, 255, 255));
			
		}
		return jR_Presente;
	}

	/**
	 * This method initializes jR_Virtuale	
	 * 	
	 * @return javax.swing.JRadioButton	
	 */
	private JRadioButton getJR_Virtuale() {
		if (jR_Virtuale == null) {
			jR_Virtuale = new JRadioButton();
			jR_Virtuale.setBounds(new Rectangle(89, 525, 124, 20));
			jR_Virtuale.setText("Virtuale");
			jR_Virtuale.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jR_Virtuale;
	}

	/**
	 * This method initializes jR_Incollezione	
	 * 	
	 * @return javax.swing.JRadioButton	
	 */
	private JRadioButton getJR_Incollezione() {
		if (jR_Incollezione == null) {
			jR_Incollezione = new JRadioButton();
			jR_Incollezione.setBounds(new Rectangle(247, 495, 124, 20));
			jR_Incollezione.setText("In Collezione");
			jR_Incollezione.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jR_Incollezione;
	}

	/**
	 * This method initializes jR_Cedibile	
	 * 	
	 * @return javax.swing.JRadioButton	
	 */
	private JRadioButton getJR_Cedibile() {
		if (jR_Cedibile == null) {
			jR_Cedibile = new JRadioButton();
			jR_Cedibile.setBounds(new Rectangle(247, 525, 124, 20));
			jR_Cedibile.setText("Cedibile");
			jR_Cedibile.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jR_Cedibile;
	}

	/**
	 * This method initializes jR_DestinataA	
	 * 	
	 * @return javax.swing.JRadioButton	
	 */
	private JRadioButton getJR_DestinataA() {
		if (jR_DestinataA == null) {
			jR_DestinataA = new JRadioButton();
			jR_DestinataA.setBounds(new Rectangle(247, 555, 124, 20));
			jR_DestinataA.setText("Destinata A");
			jR_DestinataA.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jR_DestinataA;
	}

	/**
	 * This method initializes jP_Visualizzazione	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Visualizzazione() {
		if (jP_Visualizzazione == null) {
			jP_Visualizzazione = new JPanel();
			jP_Visualizzazione.setLayout(null);
			jP_Visualizzazione.setBounds(new Rectangle(30, 15, 616, 396));
			jP_Visualizzazione.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jP_Visualizzazione;
	}

	public void showM(Visualizzazione vis){
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
		case ATTESA_INFO_TM:{break;}
		case ATTESA_INFO_E:{break;}
		case ATTESA_CONTROLLO_DATI_EC:{break;}
		case ATTESA_CONTROLLO_DATI_M:{break;}
		case ATTESA_MODIFICA_EC:{break;}
		case ATTESA_MODIFICA_M:{
			/*Visualizza nell'interfaccia vis*/
			msg=new String("Procedere con l'operazione?");
			JOptionPane question = new JOptionPane(msg,JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
			question.setMessage(msg);
			JDialog dialog = question.createDialog(new JFrame(),"");
			dialog.pack();
			dialog.setVisible(true);
			int n = ((Integer)question.getValue()).intValue();
			if ( n == 0) conferma();
			else annulla();
			mystate=ATTESA_CONFERMA_MOD_M;
			break;}
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
	
	public void modificaM(InfoMoneta moneta){
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
		case ATTESA_INFO_TM:{break;}
		case ATTESA_INFO_E:{break;}
		case ATTESA_CONTROLLO_DATI_EC:{break;}
		case ATTESA_CONTROLLO_DATI_M:{break;}
		case ATTESA_MODIFICA_EC:{break;}
		case ATTESA_MODIFICA_M:{break;}
		case ATTESA_DATI_EE:{break;} 
		case ATTESA_DATI_E:{break;} 
		case ATTESA_DATI_TM:{break;} 
		case ATTESA_DATI_M:{
			GC.modificaM(this, moneta, idM);
			mystate=MODIFICA_M;
			break;}
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
//	Metodi get e set

	public GestireCollezione getGC() {
		return GC;
	}

	public void setGC(GestireCollezione gc) {
		GC = gc;
	}

	public Id getIdM() {
		return idM;
	}

	public void setIdM(Id idM) {
		this.idM = idM;
	}

}  
