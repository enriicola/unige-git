package easycoin.boundary;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Rectangle;
import easycoin.enumeration.*;

import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollPane;
import javax.swing.JTextField;

import easycoin.datatype.*;
import easycoin.executor.*;

public class InserireM extends Base {

	private static final long serialVersionUID = -8997741484215523687L;

	//	Attributi derivati da associazioni
	private GestireCollezione GC;
//	fine associazioni
	
	private Id EdellaMoneta;
	private InfoMoneta mon;
	
	private JScrollPane infoCompleta;
	private JPanel jContentPane = null;
	private JLabel jL_NuovaMoneta = null;
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
	private ButtonGroup BG_Stato = null; 
	private ButtonGroup BG_StatoPresente = null;

	private JTextField jT_Locazione = null;

	private JTextField jT_Destinata = null;

	private JTextField jT_Nota = null; 

//	<<create>> mkInserireM(Id idE,GestireCollezione gc)
	public InserireM(Id idE,GestireCollezione gc){
		super();
		mystate=INSERIMENTO_M_APERTO;
		this.GC=gc;
		this.EdellaMoneta=idE;
		infoCompleta=GC.getVIS().getInfoCompletaE(GC.getSEL().infoCompletaE(idE));
		initialize();
	}

	public void insM(InfoMoneta moneta){
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
		case INSERIMENTO_M_APERTO:{
			mystate=ATTESA_CONFERMA_M;
			this.mon=moneta;
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
				setVisible(false);
				annulla();
				}
			break;} 
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
	
	//Metodi get e set
	public Id getEdellaMoneta() {
		return EdellaMoneta;
	}


	public void setEdellaMoneta(Id edellaMoneta) {
		EdellaMoneta = edellaMoneta;
	}


	public GestireCollezione getGC() {
		return GC;
	}


	public void setGC(GestireCollezione gc) {
		GC = gc;
	}


	public InfoMoneta getMon() {
		return mon;
	}


	public void setMon(InfoMoneta mon) {
		this.mon = mon;
	}
	
	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
        this.setSize(new Dimension(760, 674));
        this.setContentPane(getJContentPane());	
        this.setTitle("EasyCoin - Inserire Moneta");
        this.setVisible(true);
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
			jL_NuovaMoneta = new JLabel();
			jL_NuovaMoneta.setBounds(new Rectangle(30, 423, 108, 20));
			jL_NuovaMoneta.setText("Nuova Moneta");
			jContentPane = new JPanel();
			jContentPane.setLayout(null);
			jContentPane.setBackground(new java.awt.Color(255, 255, 255));
			jContentPane.add(jL_NuovaMoneta, null);
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
			jContentPane.add(getJT_Locazione(), null);
			jContentPane.add(getJT_Destinata(), null);
			jContentPane.add(getJT_Nota(), null);
			BG_Stato = new ButtonGroup();
			BG_Stato.add(getJR_Virtuale());
			BG_Stato.add(getJR_Presente());
			BG_StatoPresente = new ButtonGroup();
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
			jB_Conferma.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()"); 
					// TODO Auto-generated Event stub actionPerformed()
					try{
					InfoMoneta moneta=new InfoMoneta();
					moneta.setGrado(Grado.valueOf((String)jC_Grado.getSelectedItem()));
					Stato s=new Stato();
					if (BG_Stato.isSelected(jR_Presente.getModel())){
						s.setPresente(true);
						if (BG_StatoPresente.isSelected(jR_Incollezione.getModel())){
							InCollezione in=new InCollezione();
							in.setLocazione(jT_Locazione.getText());
							s.setNote(in);
							}
						else if (BG_StatoPresente.isSelected(jR_Cedibile.getModel()))
							s.setNote(new Cedibile());
						else {
							DestinataA ad=new DestinataA();
							ad.setA(jT_Destinata.getText());
							s.setNote(ad);
						}
					}
					else {
						s.setPresente(false);
						Virtuale v=new Virtuale();
						v.setNota(jT_Nota.getText());
						s.setNote(v);
					}
					moneta.setStato(s);
					moneta.setValoreCommerciale(new Float(jT_Valore.getText()).floatValue());
					insM(moneta);
					}catch(java.lang.NumberFormatException ex){
						msg=new String("Valore Commerciale \n deve essere un numero");
						JOptionPane error = new JOptionPane(msg,JOptionPane.ERROR_MESSAGE, JOptionPane.OK_OPTION);
						error.setMessage(msg);
						JDialog dialog = error.createDialog(new JFrame(),"");
						dialog.pack();
						dialog.setVisible(true);
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
			jB_Annulla.setBounds(new Rectangle(561, 595, 103, 24));
			jB_Annulla.setText("Annulla");
			jB_Annulla.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()"); 
					// TODO Auto-generated Event stub actionPerformed()
					mystate = COLLEZIONE_APERTA;
					setVisible(false);
					GC.getAC().setVisible(true);
					GC.ko();
				}
			});
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
			jR_Virtuale.setBounds(new Rectangle(88, 590, 124, 20));
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
			jP_Visualizzazione.setLayout(new BorderLayout());
			jP_Visualizzazione.add(this.infoCompleta,BorderLayout.CENTER);
			jP_Visualizzazione.setBounds(new Rectangle(30, 15, 696, 396));
			jP_Visualizzazione.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jP_Visualizzazione;
	}

	/**
	 * This method initializes jT_Locazione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Locazione() {
		if (jT_Locazione == null) {
			jT_Locazione = new JTextField();
			jT_Locazione.setBounds(new Rectangle(382, 495, 150, 20));
		}
		return jT_Locazione;
	}

	/**
	 * This method initializes jT_Destinata	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Destinata() {
		if (jT_Destinata == null) {
			jT_Destinata = new JTextField();
			jT_Destinata.setBounds(new Rectangle(382, 555, 150, 20));
		}
		return jT_Destinata;
	}

	/**
	 * This method initializes jT_Nota	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Nota() {
		if (jT_Nota == null) {
			jT_Nota = new JTextField();
			jT_Nota.setBounds(new Rectangle(213, 590, 159, 20));
		}
		return jT_Nota;
	}
}
