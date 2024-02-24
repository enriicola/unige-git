package easycoin.boundary;


import javax.swing.JFrame;
import javax.swing.JOptionPane;

public class Base extends javax.swing.JFrame{

	private static final long serialVersionUID = 3608077854413575034L;

	protected int mystate;
		
	/*Definizione stati boundary AccedereEasyCatalogo*/
	protected static final int CATALOGO_APERTO=0; 
	protected static final int ATTESA_CONFERMA_EC=1; 
	protected static final int CAMBIO_MODALITA_VISUALIZZAZIONE_EC=2; 
	protected static final int ATTENDI_SCELTA_FILE_IMP_EC=3;
	protected static final int ATTENDI_SCELTA_FILE_ESP_EC=4;
	protected static final int ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC=5;
	protected static final int RICERCA_IN_EASYCATALOGO=6;
	protected static final int ATTESA_INFO_COMPLETA_EE=7;
	protected static final int ATTESA_INFO_COMPLETA_E=8;
	protected static final int ATTESA_INFO_COMPLETA_TM=9; 
	/*Definizione stati boundary AccedereCollezione*/
	protected static final int COLLEZIONE_APERTA=10; 
	protected static final int ATTESA_MONETE_CONTENUTE_NEL_FILE=11;
	protected static final int ATTENDI_SCELTA_FILE_IMP_M=12;
	protected static final int ATTENDI_SCELTA_FILE_ESP_M=13;
	protected static final int RICERCA_MONETE=14;
	protected static final int ATTESA_INFO_COMPLETA_M=15;
	protected static final int ATTESA_CONFERMA_C=16;
	protected static final int CAMBIO_MODALITA_VISUALIZZAZIONE_M=42;
	/*Definizione stati boundary Inserimento*/
	protected static final int INSERIMENTO_EE_APERTO=17; 
	protected static final int INSERIMENTO_E_APERTO=18; 
	protected static final int INSERIMENTO_TM_APERTO=19; 
	protected static final int INSERIMENTO_M_APERTO=20; 
	protected static final int ATTESA_CONFERMA_EE=21;
	protected static final int ATTESA_CONFERMA_E=22; 
	protected static final int ATTESA_CONFERMA_TM=23; 
	protected static final int ATTESA_CONFERMA_M=24; 
	protected static final int ATTESA_INFO_TM=25;
	protected static final int ATTESA_INFO_E=26;
	protected static final int ATTESA_CONTROLLO_DATI_EC=27;
	protected static final int ATTESA_CONTROLLO_DATI_M=28;
	/*Definizione stati boundary Modifica*/
	protected static final int ATTESA_MODIFICA_EC=29;
	protected static final int ATTESA_MODIFICA_M=30;
	protected static final int ATTESA_DATI_EE=31; 
	protected static final int ATTESA_DATI_E=32; 
	protected static final int ATTESA_DATI_TM=33; 
	protected static final int ATTESA_DATI_M=34; 
	protected static final int MODIFICA_EC=35; 
	protected static final int MODIFICA_M=36;
	protected static final int ATTESA_CONFERMA_MOD_EE=37;
	protected static final int ATTESA_CONFERMA_MOD_E=38;
	protected static final int ATTESA_CONFERMA_MOD_TM=39;
	protected static final int ATTESA_CONFERMA_MOD_M=40;
	protected static final int FILE_SCELTO_M=41; 
	protected static final int FILE_SCELTO_EC=43;
	
	/*Finestre di dialogo con Collezionista*/
	protected String msg=null;
	
	//Costruttore
	public Base(){
		super();
		this.setResizable(false);
		this.setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
	}
	
	public void conferma(){
		switch(mystate){
		case CATALOGO_APERTO:{break;} 
		case ATTESA_CONFERMA_EC:{
			mystate=CATALOGO_APERTO;
			((AccedereEasyCatalogo)this).getGEC().ok();
			msg=new String("Operazione eseguita con successo");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Informazione",JOptionPane.INFORMATION_MESSAGE);
			break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_EC:{break;}
		case ATTENDI_SCELTA_FILE_IMP_EC:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_EC:{break;}
		case ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC:{break;}
		case RICERCA_IN_EASYCATALOGO:{break;}
		case ATTESA_INFO_COMPLETA_EE:{
			break;}
		case ATTESA_INFO_COMPLETA_E:{break;}
		case ATTESA_INFO_COMPLETA_TM:{break;}
		case COLLEZIONE_APERTA:{break;} 
		case ATTESA_MONETE_CONTENUTE_NEL_FILE:{break;}
		case ATTENDI_SCELTA_FILE_IMP_M:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_M:{break;}
		case RICERCA_MONETE:{break;}
		case ATTESA_INFO_COMPLETA_M:{break;}
		case ATTESA_CONFERMA_C:{
			mystate=COLLEZIONE_APERTA;
			((AccedereCollezione)this).getGC().ok();
			msg=new String("Operazione eseguita con successo");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Informazione",JOptionPane.INFORMATION_MESSAGE);
			break;}
		case INSERIMENTO_EE_APERTO:{break;}
		case INSERIMENTO_E_APERTO:{break;}
		case INSERIMENTO_TM_APERTO:{break;} 
		case INSERIMENTO_M_APERTO:{break;} 
		case ATTESA_CONFERMA_EE:{ //FATTO
			mystate=ATTESA_CONTROLLO_DATI_EC;
			((InserireEE)this).getGEC().inserisciEE(((InserireEE)this), ((InserireEE)this).getE(), ((InserireEE)this).getZ(),((InserireEE)this).getS(),((InserireEE)this).getU());
			break;}
		case ATTESA_CONFERMA_E:{
			mystate=ATTESA_CONTROLLO_DATI_EC;
			((InserireE)this).getGEC().inserisciE(((InserireE)this), ((InserireE)this).getTipoDellaEmissione(), ((InserireE)this).getZecca(), ((InserireE)this).getEm());
			break;} 
		case ATTESA_CONFERMA_TM:{
			mystate=ATTESA_CONTROLLO_DATI_EC;
			((InserireTM)this).getGEC().inserisciTM(((InserireTM)this), ((InserireTM)this).getEEdelTipo(), ((InserireTM)this).getTipo(), ((InserireTM)this).getUnita());
			break;} 
		case ATTESA_CONFERMA_M:{
			mystate=ATTESA_CONTROLLO_DATI_M;
			((InserireM)this).getGC().inserisciM(((InserireM)this), ((InserireM)this).getMon(), ((InserireM)this).getEdellaMoneta());
			break;} 
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
		case ATTESA_CONFERMA_MOD_EE:{
			mystate=ATTESA_DATI_EE;
			break;} 
		case ATTESA_CONFERMA_MOD_E:{
			mystate=ATTESA_DATI_E;
			break;} 
		case ATTESA_CONFERMA_MOD_TM:{
			mystate=ATTESA_DATI_TM;
			break;} 
		case ATTESA_CONFERMA_MOD_M:{
			mystate=ATTESA_DATI_M;
			break;}
		case FILE_SCELTO_M:{break;}
		case FILE_SCELTO_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_M:{break;}
		default:{}
		}
	}
	
	public void annulla(){
		switch(mystate){
		case CATALOGO_APERTO:{break;} 
		case ATTESA_CONFERMA_EC:{
			mystate=CATALOGO_APERTO; 
			((AccedereEasyCatalogo)this).getGEC().ko(); 
			break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_EC:{break;}
		case ATTENDI_SCELTA_FILE_IMP_EC:{mystate=CATALOGO_APERTO; break;} 
		case ATTENDI_SCELTA_FILE_ESP_EC:{mystate=CATALOGO_APERTO; break;}
		case ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC:{mystate=CATALOGO_APERTO; break;}
		case RICERCA_IN_EASYCATALOGO:{mystate=CATALOGO_APERTO; break;}
		case ATTESA_INFO_COMPLETA_EE:{break;}
		case ATTESA_INFO_COMPLETA_E:{break;}
		case ATTESA_INFO_COMPLETA_TM:{break;}
		case COLLEZIONE_APERTA:{break;} 
		case ATTESA_MONETE_CONTENUTE_NEL_FILE:{break;}
		case ATTENDI_SCELTA_FILE_IMP_M:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_M:{break;}
		case RICERCA_MONETE:{mystate=COLLEZIONE_APERTA; break;}
		case ATTESA_INFO_COMPLETA_M:{break;}
		case ATTESA_CONFERMA_C:{
			mystate=COLLEZIONE_APERTA; 
			((AccedereCollezione)this).getGC().ko(); 
			break;}
		case INSERIMENTO_EE_APERTO:{break;}
		case INSERIMENTO_E_APERTO:{break;}
		case INSERIMENTO_TM_APERTO:{break;} 
		case INSERIMENTO_M_APERTO:{break;} 
		case ATTESA_CONFERMA_EE:{
			mystate=CATALOGO_APERTO;
			((InserireEE)this).setVisible(false);
			break;}
		case ATTESA_CONFERMA_E:{
			mystate=CATALOGO_APERTO;
			((InserireE)this).setVisible(false); 
			break;} 
		case ATTESA_CONFERMA_TM:{
			mystate=CATALOGO_APERTO;
			((InserireTM)this).setVisible(false);  
			break;
			} 
		case ATTESA_CONFERMA_M:{
			mystate=COLLEZIONE_APERTA;
			((InserireM)this).setVisible(false); 
			break;} 
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
		case ATTESA_CONFERMA_MOD_EE:{
			mystate=CATALOGO_APERTO;
			((ModificareEE)this).setVisible(false);  
			break;} 
		case ATTESA_CONFERMA_MOD_E:{
			mystate=CATALOGO_APERTO;
			((ModificareE)this).setVisible(false); 
			break;} 
		case ATTESA_CONFERMA_MOD_TM:{
			mystate=CATALOGO_APERTO;
			((ModificareTM)this).setVisible(false);  break;} 
		case ATTESA_CONFERMA_MOD_M:{
			mystate=COLLEZIONE_APERTA;
			((ModificareM)this).setVisible(false); 
			break;}
		case FILE_SCELTO_M:{break;} 
		case FILE_SCELTO_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_M:{break;}
		default:{}
		}
	}
	
	public void chiediConferma(){
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
	
	public void ok(){
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
		case ATTESA_CONTROLLO_DATI_EC:{
			mystate=CATALOGO_APERTO;
			msg=new String("Operazione eseguita con successo");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Informazione",JOptionPane.INFORMATION_MESSAGE);
			break;}
		case ATTESA_CONTROLLO_DATI_M:{
			mystate=COLLEZIONE_APERTA;
			msg=new String("Operazione eseguita con successo");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Informazione",JOptionPane.INFORMATION_MESSAGE);
			break;}
		case ATTESA_MODIFICA_EC:{break;}
		case ATTESA_MODIFICA_M:{break;}
		case ATTESA_DATI_EE:{break;} 
		case ATTESA_DATI_E:{break;} 
		case ATTESA_DATI_TM:{break;} 
		case ATTESA_DATI_M:{break;}
		case MODIFICA_EC:{
			mystate=CATALOGO_APERTO;
			msg=new String("Operazione eseguita con successo");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Informazione",JOptionPane.INFORMATION_MESSAGE);
			break;}
		case MODIFICA_M:{
			mystate=COLLEZIONE_APERTA;
			msg=new String("Operazione eseguita con successo");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Informazione",JOptionPane.INFORMATION_MESSAGE);
			break;}
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
	
	public void ko(){
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
			mystate=CATALOGO_APERTO;
			msg=new String("Operazione fallita nessuna Unita presente per \n l'ente emettitore selezionato");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Errore",JOptionPane.ERROR_MESSAGE);
			break;}
		case ATTESA_INFO_E:{
			mystate=CATALOGO_APERTO;
			msg=new String("Operazione fallita nessuna Zecca presente per \n l'ente emettitore selezionato");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Errore",JOptionPane.ERROR_MESSAGE);
			break;}
		case ATTESA_CONTROLLO_DATI_EC:{
			mystate=CATALOGO_APERTO;
			msg=new String("Operazione fallita");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Errore",JOptionPane.ERROR_MESSAGE);
			break;}
		case ATTESA_CONTROLLO_DATI_M:{
			mystate=COLLEZIONE_APERTA;
			msg=new String("Operazione fallita");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Errore",JOptionPane.ERROR_MESSAGE);
			break;}
		case ATTESA_MODIFICA_EC:{break;}
		case ATTESA_MODIFICA_M:{break;}
		case ATTESA_DATI_EE:{break;} 
		case ATTESA_DATI_E:{break;} 
		case ATTESA_DATI_TM:{break;} 
		case ATTESA_DATI_M:{break;}
		case MODIFICA_EC:{
			mystate=CATALOGO_APERTO;
			msg=new String("Operazione fallita");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Errore",JOptionPane.ERROR_MESSAGE);
			break;}
		case MODIFICA_M:{
			mystate=COLLEZIONE_APERTA;
			msg=new String("Operazione fallita");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Errore",JOptionPane.ERROR_MESSAGE);
			break;}
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
	
	
}
