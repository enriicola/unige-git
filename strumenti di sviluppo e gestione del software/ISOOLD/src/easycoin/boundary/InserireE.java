package easycoin.boundary;

import easycoin.datatype.*;

import java.util.Enumeration;
import java.util.Hashtable;
import javax.swing.JDialog;
import javax.swing.JFrame;
import easycoin.executor.*;
import easycoin.store.Zecca;
import javax.swing.JPanel;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Rectangle;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JButton;
import javax.swing.JComboBox;

public class InserireE extends Base {

	private static final long serialVersionUID = 7794781293434303569L;

	//	Attributi derivati da associazioni
	private GestireEasyCatalogo GEC;  //  @jve:decl-index=0:
//	fine associazioni
	
	private Id tipoDellaEmissione;  //  @jve:decl-index=0:
	private InfoEmissione em;
	private Id zecca;
	
	String[] zec;
	private JScrollPane ze;
	private JPanel jContentPane = null;
	private JPanel jP_Visualizzazione = null;
	private JLabel jL_Anno = null;
	private JTextField jT_Anno = null;
	private JLabel jL_Note = null;
	private JTextField jT_Note = null;
	private JButton jB_Conferma = null;
	private JButton jB_Annulla = null;
	private JLabel jL_Zecca = null;
	private JComboBox jCB_Zecche = null;
	
	//	<<create>> mkInserireE(Id idT,GestireEasyCatalogo gec)
	public InserireE(Id idT,GestireEasyCatalogo gec){
		super();
		mystate=ATTESA_INFO_E;
		this.tipoDellaEmissione=idT;
		this.GEC=gec;
		this.GEC.insE(this,idT);

	}
	
	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
        this.setContentPane(getJContentPane());
        this.setTitle("EasyCoin - Inserire Emissione");
        this.setSize(new Dimension(700, 421));
		this.setVisible(true);
	}

	public void insE(InfoEmissione em,Id idZ){
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
		case INSERIMENTO_E_APERTO:{
			mystate=ATTESA_CONFERMA_E;
			this.em=em;
			this.zecca=idZ;
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
				break;
			}
			else {
				annulla();
				break;
				}
			}
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
	
	public void showZ(Hashtable zecche){
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
		case ATTESA_INFO_E:{
			mystate=INSERIMENTO_E_APERTO;
			/*Visualizzazione nella interfaccia delle zecche*/
			ze=GEC.getVIS().getPannelloZecche(zecche);
			int k=0;
			zec=new String[zecche.size()];
			for (Enumeration u = zecche.elements(); u.hasMoreElements();){
				Zecca uni=(Zecca)u.nextElement();
	    		zec[k]=uni.getId().idToString();
	    		k++;
	    	}
			initialize();
			break;}
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

	public InfoEmissione getEm() {
		return em;
	}

	public void setEm(InfoEmissione em) {
		this.em = em;
	}

	public GestireEasyCatalogo getGEC() {
		return GEC;
	}

	public void setGEC(GestireEasyCatalogo gec) {
		GEC = gec;
	}

	public Id getTipoDellaEmissione() {
		return tipoDellaEmissione;
	}

	public void setTipoDellaEmissione(Id tipoDellaEmissione) {
		this.tipoDellaEmissione = tipoDellaEmissione;
	}

	public Id getZecca() {
		return zecca;
	}

	public void setZecca(Id zecca) {
		this.zecca = zecca;
	}

	/**
	 * This method initializes jContentPane	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJContentPane() {
		if (jContentPane == null) {
			jL_Zecca = new JLabel();
			jL_Zecca.setBounds(new Rectangle(50, 308, 43, 20));
			jL_Zecca.setForeground(new java.awt.Color(255, 255, 255));
			jL_Zecca.setText("Zecca:");
			jL_Note = new JLabel();
			jL_Note.setBounds(new Rectangle(262, 278, 43, 20));
			jL_Note.setForeground(new java.awt.Color(255, 255, 255));
			jL_Note.setText("Note:");
			jL_Anno = new JLabel();
			jL_Anno.setBounds(new Rectangle(50, 278, 42, 20));
			jL_Anno.setForeground(new java.awt.Color(255, 255, 255));
			jL_Anno.setText("Anno:");
			jContentPane = new JPanel();
			jContentPane.setLayout(null);
			jContentPane.setBackground(new java.awt.Color(0, 0, 0));
			jContentPane.add(getJP_Visualizzazione(), null);
			jContentPane.add(jL_Anno, null);
			jContentPane.add(getJT_Anno(), null);
			jContentPane.add(jL_Note, null);
			jContentPane.add(getJT_Note(), null);
			jContentPane.add(getJB_Conferma(), null);
			jContentPane.add(getJB_Annulla(), null);
			jContentPane.add(jL_Zecca, null);
			jContentPane.add(getJCB_Zecche(), null);
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
			jP_Visualizzazione.setBounds(new Rectangle(25, 25, 642, 235));
			jP_Visualizzazione.add(this.ze,BorderLayout.CENTER);
		}
		return jP_Visualizzazione;
	}

	/**
	 * This method initializes jT_Anno	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Anno() {
		if (jT_Anno == null) {
			jT_Anno = new JTextField();
			jT_Anno.setBounds(new Rectangle(98, 278, 128, 20));
		}
		return jT_Anno;
	}

	/**
	 * This method initializes jT_Note	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Note() {
		if (jT_Note == null) {
			jT_Note = new JTextField();
			jT_Note.setBounds(new Rectangle(310, 278, 321, 20));
		}
		return jT_Note;
	}

	/**
	 * This method initializes jB_Conferma	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Conferma() {
		if (jB_Conferma == null) {
			jB_Conferma = new JButton();
			jB_Conferma.setBounds(new Rectangle(400, 350, 97, 24));
			jB_Conferma.setText("Conferma");
			jB_Conferma.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed() Conferma Inserisci Emissione");
					// TODO Auto-generated Event stub actionPerformed()
					try{
					InfoEmissione ie=new InfoEmissione();
					ie.setAnno(new Integer(jT_Anno.getText()).intValue());
					ie.setNote(jT_Note.getText());
					Id idz=new Id((String)jCB_Zecche.getSelectedItem());
					insE(ie,idz);
					}catch(java.lang.NumberFormatException ex){
						msg=new String("Anno deve essere un numero");
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
			jB_Annulla.setBounds(new Rectangle(520, 350, 97, 24));
			jB_Annulla.setText("Annulla");
			jB_Annulla.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed() Annulla Inserimento Emissione");
					// TODO Auto-generated Event stub actionPerformed()
					mystate = CATALOGO_APERTO;
					setVisible(false);
					GEC.getAEC().setVisible(true);
					
				}
			});
		}
		return jB_Annulla;
	}

	/**
	 * This method initializes jCB_Zecche	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Zecche() {
		if (jCB_Zecche == null) {
			jCB_Zecche = new JComboBox(zec);
			jCB_Zecche.setBounds(new Rectangle(99, 310, 124, 19));
			jCB_Zecche.setForeground(new java.awt.Color(255, 255, 255));
			jCB_Zecche.setBackground(new java.awt.Color(0, 0, 0));
		}
		return jCB_Zecche;
	}
	
	
}  //  @jve:decl-index=0:visual-constraint="10,10"
