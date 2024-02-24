package easycoin.boundary;

import easycoin.datatype.*;
import easycoin.datatype.criterio.CriterioRicerca;
import easycoin.datatype.visualizzazione.Visualizzazione;
import easycoin.enumeration.*;
import easycoin.executor.*;
import easycoin.store.*;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Rectangle;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JTextField;
import java.awt.BorderLayout;

public class AccedereCollezione extends Accedere {
	
	private static final long serialVersionUID = -240114364833656986L;
	//Attributi derivati da associazioni
	private GestireCollezione GC;  //  @jve:decl-index=0:
	private NavigareFileSystem NFSM;
	private DriverFileSystem DFSC; 
	private Main AC;
	//fine associazioni
	
	private JFrame ricerca=null;
	private JPanel jContentPaneR = null;  //  @jve:decl-index=0:visual-constraint="73,620"
	private JPanel jP_EnteEmettitore = null;
	private JComboBox jC_Grado = null;
	private JLabel jL_NomeEE = null;
	private JTextField jT_NomeEE = null;
	private JLabel jL_AreaGeograficaEE = null;
	private JTextField jT_AreaGeograficaEE = null;
	private JLabel jL_DataInizio = null;
	private JTextField jT_AnnoInizio = null;
	private JLabel jL_DataFine = null;
	private JTextField jT_AnnoFine = null;
	private JPanel jP_TipoMoneta = null;
	private JLabel jL_Descrizione = null;
	private JTextField jT_Descrizione = null;
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
	private JPanel jP_Emissioni = null;
	private JLabel jL_Anno = null;
	private JTextField jT_Anno = null;
	private JButton jB_Annulla = null;
	private JButton jB_Ricerca = null;
    private javax.swing.JButton jB_Cerca;
    private javax.swing.JButton jB_Chiudi;
    private javax.swing.JButton jB_Esporta;
    private javax.swing.JButton jB_Importa;
    private javax.swing.JButton jB_ModalitaVis;
    private javax.swing.JButton jB_PassaGEC;
    private javax.swing.JLabel jL_Titolo;
    protected javax.swing.JPanel jSP_Visualizzazione;
	public JPanel jContentPane = null;
	private JFrame vis;  //  @jve:decl-index=0:visual-constraint="10,1112"
	private JPanel jContentPaneV;  //  @jve:decl-index=0:visual-constraint="11,1162"
	private JPanel jP_Formato = null;
	private JPanel jP_Concisione = null;
	private JRadioButton jRB_Sezione = null;
	private JRadioButton jRB_Scheda = null;
	private JRadioButton jRB_Completa = null;
	private JRadioButton jRB_Ridotta = null;
	private ButtonGroup BG_Formato = null;  //  @jve:decl-index=0:
	private ButtonGroup BG_Concisione = null;  //  @jve:decl-index=0:
	private JPanel jP_Ordinamento = null;
	private JLabel jL_EnteEmettitore = null;
	private JComboBox jCB_EnteEmettitore = null;
	private JCheckBox jC_EnteEmettitore = null;
	private JLabel jL_AreaGeografica = null;
	private JComboBox jCB_AreaGeografica = null;
	private JCheckBox jC_AreaGeografica = null;
	private JLabel jL_Zecca = null;
	private JCheckBox jC_Zecca = null;
	private JComboBox jCB_Zecca = null;
	private JLabel jL_AnnoEmissione = null;
	private JComboBox jCB_AnnoEmissione = null;
	private JCheckBox jC_AnnoEmissione = null;
	private JLabel jL_Pes = null;
	private JComboBox jCB_Pes = null;
	private JCheckBox jC_Pes = null;
	private JLabel jL_Form = null;
	private JComboBox jCB_Form = null;
	private JCheckBox jC_Form = null;
	private JLabel jL_DataI = null;
	private JComboBox jCB_DataI = null;
	private JCheckBox jC_DataI = null;
	private JLabel jL_Bord = null;
	private JComboBox jCB_Bord = null;
	private JCheckBox jC_Bord = null;
	private JLabel jL_DataF = null;
	private JComboBox jCB_DataF = null;
	private JCheckBox jC_DataF = null;
	private JLabel jL_Material = null;
	private JComboBox jCB_Material = null;
	private JCheckBox jC_Material = null;
	private JLabel jL_ValoreNom = null;
	private JComboBox jCB_ValoreNom = null;
	private JCheckBox jC_ValoreNom = null;
	private JLabel jL_Unit = null;
	private JComboBox jCB_Unit = null;
	private JCheckBox jC_Unit = null;
	private JLabel jL_Dimension = null;
	private JComboBox jCB_Dimension = null;
	private JCheckBox jC_Dimension = null;
	private JLabel jL_Spessor = null;
	private JComboBox jCB_Spessor = null;
	private JCheckBox jC_Spessor = null;
	private JButton jB_Annull = null;
	private JButton jB_Conferma = null;
	
	private String file;
	private JPanel jP_Monete = null;
	private JLabel jL_Grado = null;
	private JLabel jL_DescrizioneM = null;
	private JTextField jT_DescrizioneM = null;
	private JLabel jL_Stato = null;
	private JComboBox jCB_Stato = null;
	private JLabel jL_ValCom = null;
	private JComboBox jCB_ValCom = null;
	private JCheckBox jC_ValCom = null;
	private JLabel jL_Grad = null;
	private JComboBox jCB_Grad = null;
	private JCheckBox jC_Grad = null;
	
	//<<create>> mkAccedereCollezione(GestireCollezione gc)
	public AccedereCollezione(GestireCollezione gc,ModalitaVisualizzazione m,Info i){
		super();
		mystate=COLLEZIONE_APERTA;
		this.GC=gc;
		this.GC.getVIS().setAC(this);
		m.setMostra(OggettoDaMostrare.Monete);
		cambiaVisualizzato(this.GC.getVIS().visualizza(m,i));
		initialize();

	}
	
	/**
	 * This method initializes this
	 * 
	 */
	protected void initialize() {
        this.setContentPane(getJContentPane());
        this.setSize(new Dimension(1000, 600));	
        this.setTitle("EasyCoin - Gestire Collezione");
        this.setLocation(10, 100);
        this.setVisible(true);
	}

	public void eliminaM(Id idM){
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
		case COLLEZIONE_APERTA:{
			mystate=ATTESA_INFO_COMPLETA_M; 
			GC.eliminaM(idM); 
			break;} 
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
	
	public void esportaM(){
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
		case COLLEZIONE_APERTA:{
			mystate=ATTENDI_SCELTA_FILE_ESP_M; 
			NFSM=new NavigareFileSystem();
			int returnVal = NFSM.showSaveDialog(this);
			if (returnVal == JFileChooser.APPROVE_OPTION){
				String tipo=NFSM.getFileFilter().getDescription();
				file = new String();
				file = NFSM.getSelectedFile().getPath();
				mystate=Base.FILE_SCELTO_M;
				GC.esportaM(new FilePath(file+"."+tipo));	
			} else mystate=COLLEZIONE_APERTA;
			break;} 
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
	
	public void importaMonete(){
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
		case COLLEZIONE_APERTA:{
			mystate=ATTENDI_SCELTA_FILE_IMP_M; 
			NFSM=new NavigareFileSystem(); 
			int returnVal =NFSM.showOpenDialog(this);
			if (returnVal == JFileChooser.APPROVE_OPTION){
				file = new String();
				file = NFSM.getSelectedFile().getPath();
				mystate=Base.ATTESA_MONETE_CONTENUTE_NEL_FILE;	
				GC.importaM(new FilePath(file));
			}else mystate=COLLEZIONE_APERTA;
			break;}
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
	
	@SuppressWarnings("deprecation")
	public void importareM(Info i){
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
		case ATTESA_MONETE_CONTENUTE_NEL_FILE:{
			mystate=ATTESA_CONFERMA_C;
			/*Visualizza in una interfaccia il contenuto del file e chiede conferma */
			Visualizzazione vis=GC.getVIS().visualizza(GC.getMv(), i); 
			JFrame importa = new JFrame();
			importa.add(vis);
			importa.pack();
			importa.show();
			msg=new String("Procedere con l'operazione?");
			JOptionPane question = new JOptionPane(msg,JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
			question.setMessage(msg);
			JDialog dialog = question.createDialog(new JFrame(),"");
			dialog.pack();
			dialog.setVisible(true);
			int n = ((Integer)question.getValue()).intValue();
			if ( n == 0) {
				importa.setVisible(false);
				conferma();
				break;}
			else{ 
				importa.setVisible(false);
				annulla();
			break;}
			}
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
	
	public void inserireMoneta(Id idE){
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
		case COLLEZIONE_APERTA:{new InserireM(idE,GC); break;} 
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
	
	public void modificaMoneta(Id idM){
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
		case COLLEZIONE_APERTA:{new ModificareM(idM,GC);break;} 
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
	
	public void ricercareMonete(){
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
		case COLLEZIONE_APERTA:{
			/*Visualizzazione dell'interfaccia per inserire un criterio*/
			ricerca=new JFrame("EasyCoin - Ricerca EasyCatalogo");
			ricerca.add(getJContentPaneR(),null);
			ricerca.setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
			ricerca.setSize(new Dimension(671, 670));
			ricerca.setLocation(250, 100);
			ricerca.setVisible(true);
			ricerca.setResizable(false);
			setEnabled(false);
			mystate=RICERCA_MONETE;
			break;} 
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
	
//	<<auxiliary>> visualizza la finestra per modificare visualizzazione
	public void modalitaVis(){
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
		case COLLEZIONE_APERTA:{
			mystate=CAMBIO_MODALITA_VISUALIZZAZIONE_M;
			/*Visualizzazione dell'interfaccia*/
			vis=new JFrame("EasyCoin - Cambia Modalità EasyCatalogo");
			vis.add(getJContentPaneV(),null);
			vis.setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
			vis.setSize(new Dimension(596, 508));
			vis.setLocation(250, 100);
			vis.setVisible(true);
			vis.setResizable(false);
			setEnabled(false);
			
			break;} 
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
	
//	Metodi get e set

	public Main getAC() {
		return AC;
	}

	public void setAC(Main ac) {
		AC = ac;
	}

	public DriverFileSystem getDFSC() {
		return DFSC;
	}

	public void setDFSC(DriverFileSystem dfsc) {
		DFSC = dfsc;
	}

	public GestireCollezione getGC() {
		return GC;
	}

	public void setGC(GestireCollezione gc) {
		GC = gc;
	}

	public NavigareFileSystem getNFSM() {
		return NFSM;
	}

	public void setNFSM(NavigareFileSystem nfsm) {
		NFSM = nfsm;
	}

	/**
	 * This method initializes jContentPane	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJContentPane() {
		if (jContentPane == null) {
			jContentPane = new JPanel();
			jContentPane.setLayout(null);
			getPannelloVisualizzazione();
			jL_Titolo = new javax.swing.JLabel();
	        jB_PassaGEC = new javax.swing.JButton();
	        
	        jB_Importa = new javax.swing.JButton();
	        jB_Esporta = new javax.swing.JButton();
	        jB_ModalitaVis = new javax.swing.JButton();
	        jB_Cerca = new javax.swing.JButton();
	        jB_Chiudi = new javax.swing.JButton();
	        jContentPane.setBackground(new java.awt.Color(255, 255, 255));
	        jL_Titolo.setFont(new java.awt.Font("Batang", 1, 18));
	        jL_Titolo.setText("Gestire Collezione");
	        jContentPane.add(jL_Titolo);
	        jL_Titolo.setBounds(390, 29, 210, 30);

	        jB_PassaGEC.setText("Passa Gestire EasyCatalogo");
	        jContentPane.add(jB_PassaGEC);
	        jB_PassaGEC.setBounds(786, 50, 170, 23);

	        jB_PassaGEC.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Passa Gestire EasyCatalogo");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		cambioModalita();
	        	}
	        });
	      
	        jB_Importa.setText("Importare Monete");
	        jContentPane.add(jB_Importa);
	        jB_Importa.setBounds(38, 535, 150, 23);

	        jB_Importa.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Importa Monete"); 
	        		// TODO Auto-generated Event stub actionPerformed()
	        		importaMonete();
	        	}
	        });
	        jB_Esporta.setText("Esportare Monete");
	        jContentPane.add(jB_Esporta);
	        jB_Esporta.setBounds(209, 535, 149, 23);

	        jB_Esporta.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Esporta Monete");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		esportaM();
	        	}
	        });
	        jB_ModalitaVis.setText("Modalit\u00e0 Visualizzazione");
	        jContentPane.add(jB_ModalitaVis);
	        jB_ModalitaVis.setBounds(380, 535, 160, 23);

	        jB_ModalitaVis.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Modalità Visualizzazione");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		modalitaVis();
	        	}
	        });
	        jB_Cerca.setText("Cerca");
	        jContentPane.add(jB_Cerca);
	        jB_Cerca.setBounds(560, 535, 61, 23);

	        jB_Cerca.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Ricerca Monete");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		ricercareMonete();
	        	}
	        });
	        jB_Chiudi.setText("Chiudi");
	        jContentPane.add(jB_Chiudi);
	        jB_Chiudi.setBounds(880, 535, 71, 23);
	        jB_Chiudi.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Chiudi"); 
	        		// TODO Auto-generated Event stub actionPerformed()
	        		msg=new String("Sei sicuro di voler uscire?");
	        		JOptionPane question = new JOptionPane(msg,JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
	    			question.setMessage(msg);
	    			JDialog dialog = question.createDialog(new JFrame(),"");
	    			dialog.pack();
	    			dialog.setVisible(true);
	    			int n = ((Integer)question.getValue()).intValue();
	    			if ( n == 0) {AC.chiudi();
	    			System.exit(0);} 
	        	}
	        });
		}
		return jContentPane;
	}
	private JPanel getJContentPaneR(){
		if (jContentPaneR == null){
			jContentPaneR = new JPanel();
			jContentPaneR.setLayout(null);
			jContentPaneR.setBackground(new java.awt.Color(255, 255, 255));
			jContentPaneR.setSize(new Dimension(671, 480));
			jContentPaneR.add(getJP_EnteEmettitore(), null);
			jContentPaneR.add(getJP_TipoMoneta(), null);
			jContentPaneR.add(getJP_Emissioni(), null);
			jContentPaneR.add(getJB_Annulla(), null);
			jContentPaneR.add(getJB_Ricerca(), null);
			jContentPaneR.add(getJP_Monete(), null);
		}
		return jContentPaneR;
	}
	
	//Pannello del Cambio Visualizzazione
	private JPanel getJContentPaneV(){
		if (jContentPaneV == null){
			jContentPaneV = new JPanel();
			jContentPaneV.setLayout(null);
			jContentPaneV.setBackground(new java.awt.Color(255, 255, 255));
			jContentPaneV.setSize(new Dimension(592, 406));
			jContentPaneV.add(getJP_Formato(), null);
			jContentPaneV.add(getJP_Concisione(), null);
			jContentPaneV.add(getJP_Ordinamento(), null);
			jContentPaneV.add(getJB_Annull(), null);
			jContentPaneV.add(getJB_Conferma(), null);
			
		}
		return jContentPaneV;
	}
	
	/**
	 * This method initializes jT_AnnoInizio	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_AnnoInizio() {
		if (jT_AnnoInizio == null) {
			jT_AnnoInizio = new JTextField();
			jT_AnnoInizio.setBounds(new Rectangle(90, 50, 54, 20));
		}
		return jT_AnnoInizio;
	}

	/**
	 * This method initializes jT_AnnoFine	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_AnnoFine() {
		if (jT_AnnoFine == null) {
			jT_AnnoFine = new JTextField();
			jT_AnnoFine.setBounds(new Rectangle(229, 50, 54, 20));
		}
		return jT_AnnoFine;
	}
	
	/**
	 * This method initializes jP_EnteEmettitore	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_EnteEmettitore() {
		if (jP_EnteEmettitore == null) {
			jL_DataFine = new JLabel();
			jL_DataFine.setBounds(new Rectangle(157, 50, 61, 20));
			jL_DataFine.setText("Data Fine:");
			jL_DataFine.setForeground(new java.awt.Color(0, 0, 0));
			jL_DataInizio = new JLabel();
			jL_DataInizio.setBounds(new Rectangle(15, 50, 68, 20));
			jL_DataInizio.setText("Data Inizio:");
			jL_AreaGeograficaEE = new JLabel();
			jL_AreaGeograficaEE.setBounds(new Rectangle(239, 20, 112, 20));
			jL_AreaGeograficaEE.setText("Area Geografica:");
			jL_NomeEE = new JLabel();
			jL_NomeEE.setBounds(new Rectangle(15, 20, 45, 20));
			jL_NomeEE.setText("Nome:");
			jP_EnteEmettitore = new JPanel();
			jP_EnteEmettitore.setLayout(null);
			jP_EnteEmettitore.setBackground(new java.awt.Color(255, 255, 255));
			jP_EnteEmettitore.setBounds(new Rectangle(20, 20, 627, 83));
			jP_EnteEmettitore.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Ente Emettitore", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Tahoma", 0, 11), new java.awt.Color(0, 0, 0)));
			jP_EnteEmettitore.add(jL_NomeEE, null);
			jP_EnteEmettitore.add(getJT_NomeEE(), null);
			jP_EnteEmettitore.add(jL_AreaGeograficaEE, null);
			jP_EnteEmettitore.add(getJT_AreaGeograficaEE(), null);
			jP_EnteEmettitore.add(jL_DataInizio,null);
			jP_EnteEmettitore.add(jL_DataFine,null);
			jP_EnteEmettitore.add(getJT_AnnoInizio(), null);
			jP_EnteEmettitore.add(getJT_AnnoFine(), null);
		}
		return jP_EnteEmettitore;
	}

	/**
	 * This method initializes jT_NomeEE	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_NomeEE() {
		if (jT_NomeEE == null) {
			jT_NomeEE = new JTextField();
			jT_NomeEE.setBounds(new Rectangle(60, 20, 150, 20));
		}
		return jT_NomeEE;
	}

	/**
	 * This method initializes jT_AreaGeograficaEE	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_AreaGeograficaEE() {
		if (jT_AreaGeograficaEE == null) {
			jT_AreaGeograficaEE = new JTextField();
			jT_AreaGeograficaEE.setBounds(new Rectangle(352, 20, 223, 20));
		}
		return jT_AreaGeograficaEE;
	}
	
	/**
	 * This method initializes jP_TipoMoneta	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_TipoMoneta() {
		if (jP_TipoMoneta == null) {
			jL_Forma = new JLabel();
			jL_Forma.setBounds(new Rectangle(340, 140, 45, 20));
			jL_Forma.setText("Forma:");
			jL_Materiale = new JLabel();
			jL_Materiale.setBounds(new Rectangle(15, 140, 81, 20));
			jL_Materiale.setText("Materiale:");
			jL_Bordo = new JLabel();
			jL_Bordo.setBounds(new Rectangle(340, 110, 45, 20));
			jL_Bordo.setText("Bordo:");
			jL_Spessore = new JLabel();
			jL_Spessore.setBounds(new Rectangle(15, 110, 81, 20));
			jL_Spessore.setText("Spessore:");
			jL_Peso = new JLabel();
			jL_Peso.setBounds(new Rectangle(340, 80, 45, 20));
			jL_Peso.setText("Peso:");
			jL_Dimensione = new JLabel();
			jL_Dimensione.setBounds(new Rectangle(15, 80, 81, 20));
			jL_Dimensione.setText("Dimensione:");
			jL_Descrizione = new JLabel();
			jL_Descrizione.setBounds(new Rectangle(15, 20, 81, 20));
			jL_Descrizione.setText("Descrizione:");
			jL_ParteIntera = new JLabel();
			jL_ParteIntera.setText("Valore Nominale(Int-Num-Den):");
			jL_ParteIntera.setBounds(new Rectangle(15, 50, 178, 20));
			jP_TipoMoneta = new JPanel();
			jP_TipoMoneta.setLayout(null);
			jP_TipoMoneta.setBounds(new Rectangle(18, 108, 627, 174));
			jP_TipoMoneta.setBackground(new java.awt.Color(255, 255, 255));
			jP_TipoMoneta.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Tipo Moneta", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Tahoma", 0, 11), new java.awt.Color(0, 0, 0)));
			jP_TipoMoneta.add(jL_Descrizione,null);
			jP_TipoMoneta.add(jL_Dimensione);
			jP_TipoMoneta.add(jL_Descrizione, null);
			jP_TipoMoneta.add(getJT_Descrizione(), null);
			jP_TipoMoneta.add(jL_Dimensione, null);
			jP_TipoMoneta.add(getJT_Dimensione(), null);
			jP_TipoMoneta.add(jL_Peso, null);
			jP_TipoMoneta.add(getJT_Peso(), null);
			jP_TipoMoneta.add(jL_Spessore, null);
			jP_TipoMoneta.add(getJT_Spessore(), null);
			jP_TipoMoneta.add(jL_Bordo, null);
			jP_TipoMoneta.add(getJT_Bordo(), null);
			jP_TipoMoneta.add(jL_Materiale, null);
			jP_TipoMoneta.add(getJT_Materiale(), null);
			jP_TipoMoneta.add(jL_Forma, null);
			jP_TipoMoneta.add(getJCB_Forma(), null);
			jP_TipoMoneta.add(getJT_Den(), null);
			jP_TipoMoneta.add(getJT_Num(), null);
			jP_TipoMoneta.add(getJT_ParteIntera(), null);
			jP_TipoMoneta.add(jL_ParteIntera, null);
		}
		return jP_TipoMoneta;
	}
	
	/**
	 * This method initializes jT_Descrizione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Descrizione() {
		if (jT_Descrizione == null) {
			jT_Descrizione = new JTextField();
			jT_Descrizione.setBounds(new Rectangle(108, 20, 212, 20));
		}
		return jT_Descrizione;
	}

	public void getPannelloVisualizzazione(){
		jSP_Visualizzazione = new javax.swing.JPanel();
        jSP_Visualizzazione.setLayout(new BorderLayout());
        jSP_Visualizzazione.add(this.visualizzazione, BorderLayout.CENTER);
        jContentPane.add(jSP_Visualizzazione);
        jSP_Visualizzazione.setBounds(20, 110, 954, 410);
        jSP_Visualizzazione.setBackground(new java.awt.Color(255, 255, 255));
	}
	
	/**
	 * This method initializes jT_ParteIntera	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_ParteIntera() {
		if (jT_ParteIntera == null) {
			jT_ParteIntera = new JTextField();
			jT_ParteIntera.setBounds(new Rectangle(198, 50, 53, 20));
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
			jT_Num.setBounds(new Rectangle(255, 50, 55, 20));
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
			jT_Den.setBounds(new Rectangle(314, 50, 54, 20));
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
			jT_Dimensione.setBounds(new Rectangle(108, 80, 127, 20));
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
			jT_Peso.setBounds(new Rectangle(390, 80, 127, 20));
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
			jT_Spessore.setBounds(new Rectangle(108, 110, 127, 20));
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
			jT_Bordo.setBounds(new Rectangle(390, 110, 127, 20));
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
			jT_Materiale.setBounds(new Rectangle(108, 140, 127, 20));
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
			jCB_Forma.setBounds(new Rectangle(390, 140, 127, 20));
			jCB_Forma.setForeground(new java.awt.Color(0, 0, 0));
			jCB_Forma.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jCB_Forma;
	}
	
	/**
	 * This method initializes jP_Emissioni	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Emissioni() {
		if (jP_Emissioni == null) {
			jL_Anno = new JLabel();
			jL_Anno.setBounds(new Rectangle(15, 20, 42, 20));
			jL_Anno.setText("Anno:");
			jP_Emissioni = new JPanel();
			jP_Emissioni.setLayout(null);
			jP_Emissioni.add(jL_Anno,null);
			jP_Emissioni.add(getJT_Anno(),null);
			jP_Emissioni.setBounds(new Rectangle(17, 289, 627, 50));
			jP_Emissioni.setBackground(new java.awt.Color(255, 255, 255));
			jP_Emissioni.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Emissione", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Tahoma", 0, 11), new java.awt.Color(0, 0, 0)));
		}
		return jP_Emissioni;
	}
	/**
	 * This method initializes jT_Anno	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Anno() {
		if (jT_Anno == null) {
			jT_Anno = new JTextField();
			jT_Anno.setBounds(new Rectangle(108, 20, 127, 20));
		}
		return jT_Anno;
	}

	/**
	 * This method initializes jB_Annulla	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Annulla() {
		if (jB_Annulla == null) {
			jB_Annulla = new JButton();
			jB_Annulla.setBounds(new Rectangle(513, 441, 97, 24));
			jB_Annulla.setText("Annulla");		
			jB_Annulla.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed() Annulla Ricerca"); 
					// TODO Auto-generated Event stub actionPerformed()
					ricerca.setVisible(false);
					mystate=Base.COLLEZIONE_APERTA;
					setEnabled(true);
				}
			});
			}
		return jB_Annulla;
	}

	/**
	 * This method initializes jB_Ricerca	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Ricerca() {
		if (jB_Ricerca == null) {
			jB_Ricerca = new JButton();
			jB_Ricerca.setBounds(new Rectangle(401, 441, 97, 24));
			jB_Ricerca.setText("Ricerca");
			jB_Ricerca.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()  Conferma Ricerca");
					// TODO Auto-generated Event stub actionPerformed()
					CriterioRicerca c=new CriterioRicerca();//DA COMPLETARE
					criterio(c);
				}
			});
		}
		return jB_Ricerca;
	}

	/**
	 * This method initializes jP_Monete	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Monete() {
		if (jP_Monete == null) {
			jL_Stato = new JLabel();
			jL_Stato.setBounds(new Rectangle(340, 20, 45, 20));
			jL_Stato.setText("Stato:");
			jL_DescrizioneM = new JLabel();
			jL_DescrizioneM.setBounds(new Rectangle(15, 50, 82, 20));
			jL_DescrizioneM.setText("Descrizione:");
			jL_Grado = new JLabel();
			jL_Grado.setBounds(new Rectangle(15, 20, 60, 20));
			jL_Grado.setText("Grado:");
			jP_Monete = new JPanel();
			jP_Monete.setLayout(null);
			jP_Monete.setBounds(new Rectangle(17, 345, 627, 80));
			jP_Monete.setBackground(new java.awt.Color(255, 255, 255));
			jP_Monete.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Moneta", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Tahoma", 0, 11), new java.awt.Color(0, 0, 0)));
			jP_Monete.add(jL_Grado, null);
			jP_Monete.add(getJC_Grado(), null);
			jP_Monete.add(jL_DescrizioneM, null);
			jP_Monete.add(getJT_DescrizioneM(), null);
			jP_Monete.add(jL_Stato, null);
			jP_Monete.add(getJCB_Stato(), null);
		}
		return jP_Monete;
	}
	/**
	 * This method initializes jC_Grado	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJC_Grado() {
		if (jC_Grado == null) {
			jC_Grado = new JComboBox(Grado.GradotoString());
			jC_Grado.setBounds(new Rectangle(108, 20, 127, 20));
			jC_Grado.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jC_Grado;
	}

	/**
	 * This method initializes jT_DescrizioneM	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_DescrizioneM() {
		if (jT_DescrizioneM == null) {
			jT_DescrizioneM = new JTextField();
			jT_DescrizioneM.setBounds(new Rectangle(108, 50, 200, 20));
		}
		return jT_DescrizioneM;
	}

	/**
	 * This method initializes jCB_Stato	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Stato() {
		if (jCB_Stato == null) {
			jCB_Stato = new JComboBox(new String[]{"in collezione","cedibile","destinata a"});
			jCB_Stato.setBounds(new Rectangle(390, 20, 127, 20));
			jCB_Stato.setForeground(new java.awt.Color(0, 0, 0));
			jCB_Stato.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jCB_Stato;
	}
	/**
	 * This method initializes jP_Formato	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Formato() {
		if (jP_Formato == null) {
			jP_Formato = new JPanel();
			jP_Formato.setLayout(null);
			jP_Formato.setBounds(new Rectangle(33, 20, 230, 60));
			jP_Formato.setBackground(new java.awt.Color(255, 255, 255));
			jP_Formato.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Formato", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Arial", 0, 11), new java.awt.Color(0, 0, 0)));
			jP_Formato.add(getJRB_Sezione(), null);
			jP_Formato.add(getJRB_Scheda(), null);
			BG_Formato = new ButtonGroup();
	        BG_Formato.add(getJRB_Sezione());
	        BG_Formato.add(getJRB_Scheda());
		}
		return jP_Formato;
	}

	/**
	 * This method initializes jP_Concisione	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Concisione() {
		if (jP_Concisione == null) {
			jP_Concisione = new JPanel();
			jP_Concisione.setLayout(null);
			jP_Concisione.setBounds(new Rectangle(323, 20, 234, 60));
			jP_Concisione.setBackground(new java.awt.Color(255, 255, 255));
			jP_Concisione.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Concisione", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Arial", 0, 11), new java.awt.Color(0, 0, 0)));
			jP_Concisione.add(getJRB_Completa(), null);
			jP_Concisione.add(getJRB_Ridotta(), null);
			BG_Concisione = new ButtonGroup();
	        BG_Concisione.add(getJRB_Completa());
	        BG_Concisione.add(getJRB_Ridotta());
		}
		return jP_Concisione;
	}

	/**
	 * This method initializes jRB_Sezione	
	 * 	
	 * @return javax.swing.JRadioButton	
	 */
	private JRadioButton getJRB_Sezione() {
		if (jRB_Sezione == null) {
			jRB_Sezione = new JRadioButton("Sezione");
			jRB_Sezione.setBounds(new Rectangle(20, 20, 75, 20));
			jRB_Sezione.setBackground(new java.awt.Color(255, 255, 255));
			if (GC.getMv().getFormato().toString().equals("sezioni"))
				jRB_Sezione.setSelected(true);
		}
		return jRB_Sezione;
	}

	/**
	 * This method initializes jRB_Scheda	
	 * 	
	 * @return javax.swing.JRadioButton	
	 */
	private JRadioButton getJRB_Scheda() {
		if (jRB_Scheda == null) {
			jRB_Scheda = new JRadioButton("Scheda");
			jRB_Scheda.setBounds(new Rectangle(140, 20, 74, 20));
			jRB_Scheda.setBackground(new java.awt.Color(255, 255, 255));
			if (GC.getMv().getFormato().toString().equals("schede"))
				jRB_Scheda.setSelected(true);
		}
		return jRB_Scheda;
	}

	/**
	 * This method initializes jRB_Completa	
	 * 	
	 * @return javax.swing.JRadioButton	
	 */
	private JRadioButton getJRB_Completa() {
		if (jRB_Completa == null) {
			jRB_Completa = new JRadioButton("Completa");
			jRB_Completa.setBounds(new Rectangle(20, 20, 82, 20));
			jRB_Completa.setBackground(new java.awt.Color(255, 255, 255));
			if (GC.getMv().getConcisione().toString().equals("completa"))
				jRB_Completa.setSelected(true);
		}
		return jRB_Completa;
	}

	/**
	 * This method initializes jRB_Ridotta	
	 * 	
	 * @return javax.swing.JRadioButton	
	 */
	private JRadioButton getJRB_Ridotta() {
		if (jRB_Ridotta == null) {
			jRB_Ridotta = new JRadioButton("Ridotta");
			jRB_Ridotta.setBounds(new Rectangle(130, 20, 69, 24));
			jRB_Ridotta.setBackground(new java.awt.Color(255, 255, 255));
			if (GC.getMv().getConcisione().toString().equals("ridotta"))
				jRB_Ridotta.setSelected(true);
		}
		return jRB_Ridotta;
	}

	/**
	 * This method initializes jP_Ordinamento	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Ordinamento() {
		if (jP_Ordinamento == null) {
			jL_Grad = new JLabel();
			jL_Grad.setBounds(new Rectangle(302, 230, 52, 20));
			jL_Grad.setText("Grado:");
			jL_ValCom = new JLabel();
			jL_ValCom.setBounds(new Rectangle(20, 230, 126, 20));
			jL_ValCom.setText("Valore Commerciale:");
			jL_Spessor = new JLabel();
			jL_Spessor.setBounds(new Rectangle(292, 200, 65, 20));
			jL_Spessor.setText("Spessore:");
			jL_Dimension = new JLabel();
			jL_Dimension.setBounds(new Rectangle(20, 200, 100, 20));
			jL_Dimension.setText("Dimensioni:");
			jL_Unit = new JLabel();
			jL_Unit.setBounds(new Rectangle(292, 170, 46, 20));
			jL_Unit.setText("Unità:");
			jL_ValoreNom = new JLabel();
			jL_ValoreNom.setBounds(new Rectangle(20, 170, 100, 20));
			jL_ValoreNom.setText("Valore Nominale:");
			jL_Material = new JLabel();
			jL_Material.setBounds(new Rectangle(292, 140, 57, 20));
			jL_Material.setText("Materiale:");
			jL_DataF = new JLabel();
			jL_DataF.setBounds(new Rectangle(20, 140, 100, 20));
			jL_DataF.setText("Data Fine:");
			jL_Bord = new JLabel();
			jL_Bord.setBounds(new Rectangle(292, 110, 46, 20));
			jL_Bord.setText("Bordo:");
			jL_DataI = new JLabel();
			jL_DataI.setBounds(new Rectangle(20, 110, 100, 20));
			jL_DataI.setText("Data Inizio:");
			jL_Form = new JLabel();
			jL_Form.setBounds(new Rectangle(292, 80, 46, 20));
			jL_Form.setText("Forma:");
			jL_Pes = new JLabel();
			jL_Pes.setBounds(new Rectangle(292, 50, 46, 20));
			jL_Pes.setText("Peso:");
			jL_AnnoEmissione = new JLabel();
			jL_AnnoEmissione.setBounds(new Rectangle(20, 80, 100, 20));
			jL_AnnoEmissione.setText("Anno Emissione:");
			jL_Zecca = new JLabel();
			jL_Zecca.setBounds(new Rectangle(292, 20, 46, 20));
			jL_Zecca.setText("Zecca:");
			jL_AreaGeografica = new JLabel();
			jL_AreaGeografica.setBounds(new Rectangle(20, 50, 100, 20));
			jL_AreaGeografica.setText("Area Geografica:");
			jL_EnteEmettitore = new JLabel();
			jL_EnteEmettitore.setBounds(new Rectangle(20, 20, 100, 20));
			jL_EnteEmettitore.setText("Ente Emettitore:");
			jP_Ordinamento = new JPanel();
			jP_Ordinamento.setLayout(null);
			jP_Ordinamento.setBounds(new Rectangle(27, 90, 536, 264));
			jP_Ordinamento.setBackground(new java.awt.Color(255, 255, 255));
			jP_Ordinamento.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Inserire un ordinamento relativo alla visualizzazione delle monete", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Arial", 0, 11), new java.awt.Color(0, 0, 0)));
			jP_Ordinamento.add(jL_EnteEmettitore, null);
			jP_Ordinamento.add(getJCB_EnteEmettitore(), null);
			jP_Ordinamento.add(getJC_EnteEmettitore(), null);
			jP_Ordinamento.add(jL_AreaGeografica, null);
			jP_Ordinamento.add(getJCB_AreaGeografica(), null);
			jP_Ordinamento.add(getJC_AreaGeografica(), null);
			jP_Ordinamento.add(jL_Zecca, null);
			jP_Ordinamento.add(getJC_Zecca(), null);
			jP_Ordinamento.add(getJCB_Zecca(), null);
			jP_Ordinamento.add(jL_AnnoEmissione, null);
			jP_Ordinamento.add(getJCB_AnnoEmissione(), null);
			jP_Ordinamento.add(getJC_AnnoEmissione(), null);
			jP_Ordinamento.add(jL_Pes, null);
			jP_Ordinamento.add(getJCB_Pes(), null);
			jP_Ordinamento.add(getJC_Pes(), null);
			jP_Ordinamento.add(jL_Form, null);
			jP_Ordinamento.add(getJCB_Form(), null);
			jP_Ordinamento.add(getJC_Form(), null);
			jP_Ordinamento.add(jL_DataI, null);
			jP_Ordinamento.add(getJCB_DataI(), null);
			jP_Ordinamento.add(getJC_DataI(), null);
			jP_Ordinamento.add(jL_Bord, null);
			jP_Ordinamento.add(getJCB_Bord(), null);
			jP_Ordinamento.add(getJC_Bord(), null);
			jP_Ordinamento.add(jL_DataF, null);
			jP_Ordinamento.add(getJCB_DataF(), null);
			jP_Ordinamento.add(getJC_DataF(), null);
			jP_Ordinamento.add(jL_Material, null);
			jP_Ordinamento.add(getJCB_Material(), null);
			jP_Ordinamento.add(getJC_Material(), null);
			jP_Ordinamento.add(jL_ValoreNom, null);
			jP_Ordinamento.add(getJCB_ValoreNom(), null);
			jP_Ordinamento.add(getJC_ValoreNom(), null);
			jP_Ordinamento.add(jL_Unit, null);
			jP_Ordinamento.add(getJCB_Unit(), null);
			jP_Ordinamento.add(getJC_Unit(), null);
			jP_Ordinamento.add(jL_Dimension, null);
			jP_Ordinamento.add(getJCB_Dimension(), null);
			jP_Ordinamento.add(getJC_Dimension(), null);
			jP_Ordinamento.add(jL_Spessor, null);
			jP_Ordinamento.add(getJCB_Spessor(), null);
			jP_Ordinamento.add(getJC_Spessor(), null);
			jP_Ordinamento.add(jL_ValCom, null);
			jP_Ordinamento.add(getJCB_ValCom(), null);
			jP_Ordinamento.add(getJC_ValCom(), null);
			jP_Ordinamento.add(jL_Grad, null);
			jP_Ordinamento.add(getJCB_Grad(), null);
			jP_Ordinamento.add(getJC_Grad(), null);
		}
		return jP_Ordinamento;
	}

	/**
	 * This method initializes jCB_EnteEmettitore	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_EnteEmettitore() {
		if (jCB_EnteEmettitore == null) {
			jCB_EnteEmettitore = new JComboBox();
			jCB_EnteEmettitore.setBounds(new Rectangle(134, 20, 50, 20));
			jCB_EnteEmettitore.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jCB_EnteEmettitore;
	}

	/**
	 * This method initializes jC_EnteEmettitore	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_EnteEmettitore() {
		if (jC_EnteEmettitore == null) {
			jC_EnteEmettitore = new JCheckBox("crescente");
			jC_EnteEmettitore.setBounds(new Rectangle(196, 21, 88, 20));
			jC_EnteEmettitore.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jC_EnteEmettitore;
	}

	/**
	 * This method initializes jCB_AreaGeografica	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_AreaGeografica() {
		if (jCB_AreaGeografica == null) {
			jCB_AreaGeografica = new JComboBox();
			jCB_AreaGeografica.setBounds(new Rectangle(134, 50, 50, 20));
			jCB_AreaGeografica.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jCB_AreaGeografica;
	}

	/**
	 * This method initializes jC_AreaGeografica	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_AreaGeografica() {
		if (jC_AreaGeografica == null) {
			jC_AreaGeografica = new JCheckBox("crescente");
			jC_AreaGeografica.setBounds(new Rectangle(196, 50, 88, 20));
			jC_AreaGeografica.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jC_AreaGeografica;
	}

	/**
	 * This method initializes jC_Zecca	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_Zecca() {
		if (jC_Zecca == null) {
			jC_Zecca = new JCheckBox("crescente");
			jC_Zecca.setBounds(new Rectangle(421, 20, 88, 20));
			jC_Zecca.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jC_Zecca;
	}

	/**
	 * This method initializes jCB_Zecca	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Zecca() {
		if (jCB_Zecca == null) {
			jCB_Zecca = new JComboBox();
			jCB_Zecca.setBounds(new Rectangle(361, 20, 50, 20));
			jCB_Zecca.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jCB_Zecca;
	}

	/**
	 * This method initializes jCB_AnnoEmissione	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_AnnoEmissione() {
		if (jCB_AnnoEmissione == null) {
			jCB_AnnoEmissione = new JComboBox();
			jCB_AnnoEmissione.setBounds(new Rectangle(134, 80, 50, 20));
			jCB_AnnoEmissione.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jCB_AnnoEmissione;
	}

	/**
	 * This method initializes jC_AnnoEmissione	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_AnnoEmissione() {
		if (jC_AnnoEmissione == null) {
			jC_AnnoEmissione = new JCheckBox("crescente");
			jC_AnnoEmissione.setBounds(new Rectangle(196, 80, 88, 20));
			jC_AnnoEmissione.setBackground(new Color(255, 255, 255));
		}
		return jC_AnnoEmissione;
	}

	/**
	 * This method initializes jCB_Pes	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Pes() {
		if (jCB_Pes == null) {
			jCB_Pes = new JComboBox();
			jCB_Pes.setBounds(new Rectangle(361, 50, 50, 20));
			jCB_Pes.setBackground(new Color(255, 255, 255));
		}
		return jCB_Pes;
	}

	/**
	 * This method initializes jC_Pes	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_Pes() {
		if (jC_Pes == null) {
			jC_Pes = new JCheckBox("crescente");
			jC_Pes.setBounds(new Rectangle(421, 50, 88, 20));
			jC_Pes.setBackground(new Color(255, 255, 255));
		}
		return jC_Pes;
	}

	/**
	 * This method initializes jCB_Form	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Form() {
		if (jCB_Form == null) {
			jCB_Form = new JComboBox();
			jCB_Form.setBounds(new Rectangle(361, 80, 50, 20));
			jCB_Form.setBackground(new Color(255, 255, 255));
		}
		return jCB_Form;
	}

	/**
	 * This method initializes jC_Form	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_Form() {
		if (jC_Form == null) {
			jC_Form = new JCheckBox("crescente");
			jC_Form.setBounds(new Rectangle(421, 80, 88, 20));
			jC_Form.setBackground(new Color(255, 255, 255));
		}
		return jC_Form;
	}

	/**
	 * This method initializes jCB_DataI	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_DataI() {
		if (jCB_DataI == null) {
			jCB_DataI = new JComboBox();
			jCB_DataI.setBounds(new Rectangle(134, 110, 50, 20));
			jCB_DataI.setBackground(new java.awt.Color(255, 255, 255));
		}
		return jCB_DataI;
	}

	/**
	 * This method initializes jC_DataI	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_DataI() {
		if (jC_DataI == null) {
			jC_DataI = new JCheckBox("crescente");
			jC_DataI.setBounds(new Rectangle(196, 110, 88, 20));
			jC_DataI.setBackground(new Color(255, 255, 255));
		}
		return jC_DataI;
	}

	/**
	 * This method initializes jCB_Bord	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Bord() {
		if (jCB_Bord == null) {
			jCB_Bord = new JComboBox();
			jCB_Bord.setBounds(new Rectangle(361, 110, 50, 20));
			jCB_Bord.setBackground(new Color(255, 255, 255));
		}
		return jCB_Bord;
	}

	/**
	 * This method initializes jC_Bord	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_Bord() {
		if (jC_Bord == null) {
			jC_Bord = new JCheckBox("crescente");
			jC_Bord.setBounds(new Rectangle(421, 110, 88, 20));
			jC_Bord.setBackground(new Color(255, 255, 255));
		}
		return jC_Bord;
	}

	/**
	 * This method initializes jCB_DataF	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_DataF() {
		if (jCB_DataF == null) {
			jCB_DataF = new JComboBox();
			jCB_DataF.setBounds(new Rectangle(134, 140, 50, 20));
			jCB_DataF.setBackground(new Color(255, 255, 255));
		}
		return jCB_DataF;
	}

	/**
	 * This method initializes jC_DataF	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_DataF() {
		if (jC_DataF == null) {
			jC_DataF = new JCheckBox("crescente");
			jC_DataF.setBounds(new Rectangle(196, 140, 88, 20));
			jC_DataF.setBackground(new Color(255, 255, 255));
		}
		return jC_DataF;
	}

	/**
	 * This method initializes jCB_Material	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Material() {
		if (jCB_Material == null) {
			jCB_Material = new JComboBox();
			jCB_Material.setBounds(new Rectangle(361, 140, 50, 20));
			jCB_Material.setBackground(new Color(255, 255, 255));
		}
		return jCB_Material;
	}

	/**
	 * This method initializes jC_Material	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_Material() {
		if (jC_Material == null) {
			jC_Material = new JCheckBox("crescente");
			jC_Material.setBounds(new Rectangle(421, 140, 88, 20));
			jC_Material.setBackground(new Color(255, 255, 255));
		}
		return jC_Material;
	}

	/**
	 * This method initializes jCB_ValoreNom	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_ValoreNom() {
		if (jCB_ValoreNom == null) {
			jCB_ValoreNom = new JComboBox();
			jCB_ValoreNom.setBounds(new Rectangle(134, 170, 50, 20));
			jCB_ValoreNom.setBackground(new Color(255, 255, 255));
		}
		return jCB_ValoreNom;
	}

	/**
	 * This method initializes jC_ValoreNom	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_ValoreNom() {
		if (jC_ValoreNom == null) {
			jC_ValoreNom = new JCheckBox("crescente");
			jC_ValoreNom.setBounds(new Rectangle(196, 170, 88, 20));
			jC_ValoreNom.setBackground(new Color(255, 255, 255));
		}
		return jC_ValoreNom;
	}

	/**
	 * This method initializes jCB_Unit	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Unit() {
		if (jCB_Unit == null) {
			jCB_Unit = new JComboBox();
			jCB_Unit.setBounds(new Rectangle(361, 170, 50, 20));
			jCB_Unit.setBackground(new Color(255, 255, 255));
		}
		return jCB_Unit;
	}

	/**
	 * This method initializes jC_Unit	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_Unit() {
		if (jC_Unit == null) {
			jC_Unit = new JCheckBox("crescente");
			jC_Unit.setBounds(new Rectangle(421, 170, 88, 20));
			jC_Unit.setBackground(new Color(255, 255, 255));
		}
		return jC_Unit;
	}

	/**
	 * This method initializes jCB_Dimension	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Dimension() {
		if (jCB_Dimension == null) {
			jCB_Dimension = new JComboBox();
			jCB_Dimension.setBounds(new Rectangle(134, 200, 50, 20));
			jCB_Dimension.setBackground(new Color(255, 255, 255));
		}
		return jCB_Dimension;
	}

	/**
	 * This method initializes jC_Dimension	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_Dimension() {
		if (jC_Dimension == null) {
			jC_Dimension = new JCheckBox("crescente");
			jC_Dimension.setBounds(new Rectangle(196, 200, 88, 20));
			jC_Dimension.setBackground(new Color(255, 255, 255));
		}
		return jC_Dimension;
	}

	/**
	 * This method initializes jCB_Spessor	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Spessor() {
		if (jCB_Spessor == null) {
			jCB_Spessor = new JComboBox();
			jCB_Spessor.setBounds(new Rectangle(361, 200, 50, 20));
			jCB_Spessor.setBackground(new Color(255, 255, 255));
		}
		return jCB_Spessor;
	}

	/**
	 * This method initializes jC_Spessor	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_Spessor() {
		if (jC_Spessor == null) {
			jC_Spessor = new JCheckBox("crescente");
			jC_Spessor.setBounds(new Rectangle(421, 200, 88, 20));
			jC_Spessor.setBackground(new Color(255, 255, 255));
		}
		return jC_Spessor;
	}

	/**
	 * This method initializes jB_Annull	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Annull() {
		if (jB_Annull == null) {
			jB_Annull = new JButton("Annulla");
			jB_Annull.setBounds(new Rectangle(436, 367, 97, 24));
			jB_Annull.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed() Annulla Cambia Modalità Visualizzazione");
					// TODO Auto-generated Event stub actionPerformed()
					mystate=Base.COLLEZIONE_APERTA;
					vis.setVisible(false);
					setVisible(true);
					setEnabled(true);
				}
			});
		}
		return jB_Annull;
	}

	/**
	 * This method initializes jB_Conferma	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Conferma() {
		if (jB_Conferma == null) {
			jB_Conferma = new JButton("Conferma");
			jB_Conferma.setBounds(new Rectangle(323, 367, 97, 24));
			jB_Conferma.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed() Conferma Cambia Modalità Visualizzazione"); 
					// TODO Auto-generated Event stub actionPerformed()
					mystate=COLLEZIONE_APERTA;
					ModalitaVisualizzazione m=new ModalitaVisualizzazione();
					if (BG_Formato.isSelected(jRB_Sezione.getModel()))
						m.setFormato(Formato.sezioni);
					else
						m.setFormato(Formato.schede);
					if (BG_Concisione.isSelected(jRB_Completa.getModel()))
						m.setConcisione(Concisione.completa);
					else
						m.setConcisione(Concisione.ridotta);
					m.setMostra(OggettoDaMostrare.Monete);
					m.setOrdinamento(new Ordinamento());
					modVisualizzazione(m);
					vis.setVisible(false);
					setVisible(true);
					setEnabled(true);
				}
			});
		}
		return jB_Conferma;
	}

	/**
	 * This method initializes jCB_ValCom	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_ValCom() {
		if (jCB_ValCom == null) {
			jCB_ValCom = new JComboBox();
			jCB_ValCom.setBounds(new Rectangle(155, 230, 50, 20));
			jCB_ValCom.setBackground(new Color(255, 255, 255));
		}
		return jCB_ValCom;
	}

	/**
	 * This method initializes jC_ValCom	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_ValCom() {
		if (jC_ValCom == null) {
			jC_ValCom = new JCheckBox("crescente");
			jC_ValCom.setBounds(new Rectangle(215, 230, 88, 20));
			jC_ValCom.setBackground(new Color(255, 255, 255));
		}
		return jC_ValCom;
	}

	/**
	 * This method initializes jCB_Grad	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Grad() {
		if (jCB_Grad == null) {
			jCB_Grad = new JComboBox();
			jCB_Grad.setBounds(new Rectangle(361, 230, 50, 20));
			jCB_Grad.setBackground(new Color(255, 255, 255));
		}
		return jCB_Grad;
	}

	/**
	 * This method initializes jC_Grad	
	 * 	
	 * @return javax.swing.JCheckBox	
	 */
	private JCheckBox getJC_Grad() {
		if (jC_Grad == null) {
			jC_Grad = new JCheckBox("crescente");
			jC_Grad.setBounds(new Rectangle(421, 230, 88, 20));
			jC_Grad.setBackground(new Color(255, 255, 255));
		}
		return jC_Grad;
	}

}  //  @jve:decl-index=0:visual-constraint="10,10"
