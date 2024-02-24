package easycoin.boundary;

import easycoin.datatype.*;
import easycoin.datatype.criterio.CriterioRicerca;
import easycoin.datatype.visualizzazione.*;

import javax.swing.*;

public class Accedere extends Base {

	private static final long serialVersionUID = 8173135939017569748L;

	//Costruttore
	public Accedere(){
		super();
	}
	
	public Visualizzazione visualizzazione;
		
	public void chiudi(){
		switch(mystate){
		case CATALOGO_APERTO:{System.exit(0);
		break;} 
		case COLLEZIONE_APERTA:{System.exit(0);
		break;} 
		default:{}
		}
	}
	
	public void cambiaVisualizzato(Visualizzazione vis){
		switch(mystate){
		case CATALOGO_APERTO:{ 
			visualizzazione=vis;
			if (((AccedereEasyCatalogo)this).jSP_Visualizzazione!=null){
				((AccedereEasyCatalogo)this).jContentPane.remove(((AccedereEasyCatalogo)this).jSP_Visualizzazione);
				((AccedereEasyCatalogo)this).getPannelloVisualizzazione();	
				break;
			}
			break;
			} 
		case ATTESA_CONFERMA_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_EC:{
			mystate=CATALOGO_APERTO;
			visualizzazione=vis;  
			((AccedereEasyCatalogo)this).jContentPane.remove(((AccedereEasyCatalogo)this).jSP_Visualizzazione);
			((AccedereEasyCatalogo)this).getPannelloVisualizzazione();
			break;}
		case ATTENDI_SCELTA_FILE_IMP_EC:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_EC:{break;}
		case ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC:{break;}
		case RICERCA_IN_EASYCATALOGO:{break;}
		case ATTESA_INFO_COMPLETA_EE:{
			mystate=ATTESA_CONFERMA_EC;
			visualizzazione=vis;
			((AccedereEasyCatalogo)this).jContentPane.remove(((AccedereEasyCatalogo)this).jSP_Visualizzazione);
			((AccedereEasyCatalogo)this).getPannelloVisualizzazione();
			
			msg=new String("Procedere con l'operazione?");
			JOptionPane question = new JOptionPane(msg,JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
			question.setMessage(msg);
			JDialog dialog = question.createDialog(new JFrame(),"");
			dialog.pack();
			dialog.setVisible(true);
			int n = ((Integer)question.getValue()).intValue();
			if ( n == 0) {conferma(); break;}
			else {annulla(); break;}
			}
		case ATTESA_INFO_COMPLETA_E:{
			mystate=ATTESA_CONFERMA_EC;
			visualizzazione=vis;
			((AccedereEasyCatalogo)this).jContentPane.remove(((AccedereEasyCatalogo)this).jSP_Visualizzazione);
			((AccedereEasyCatalogo)this).getPannelloVisualizzazione();
			
			msg=new String("Procedere con l'operazione?");
			JOptionPane question = new JOptionPane(msg,JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
			question.setMessage(msg);
			JDialog dialog = question.createDialog(new JFrame(),"");
			dialog.pack();
			dialog.setVisible(true);
			int n = ((Integer)question.getValue()).intValue();
			if ( n == 0) {conferma();break;}
			else {annulla();
			break;}}
		case ATTESA_INFO_COMPLETA_TM:{
			mystate=ATTESA_CONFERMA_EC;
			visualizzazione=vis;
			((AccedereEasyCatalogo)this).jContentPane.remove(((AccedereEasyCatalogo)this).jSP_Visualizzazione);
			((AccedereEasyCatalogo)this).getPannelloVisualizzazione();
			
			msg=new String("Procedere con l'operazione?");
			JOptionPane question = new JOptionPane(msg,JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
			question.setMessage(msg);
			JDialog dialog = question.createDialog(new JFrame(),"");
			dialog.pack();
			dialog.setVisible(true);
			int n = ((Integer)question.getValue()).intValue();
			if ( n == 0) {conferma(); break;}
			else {annulla();
			break;}}
		case COLLEZIONE_APERTA:{
			visualizzazione=vis;  
			if (((AccedereCollezione)this).jSP_Visualizzazione!=null){
				((AccedereCollezione)this).jContentPane.remove(((AccedereCollezione)this).jSP_Visualizzazione);
				((AccedereCollezione)this).getPannelloVisualizzazione();	
				break;
			}
			break;} 
		case ATTESA_MONETE_CONTENUTE_NEL_FILE:{break;}
		case ATTENDI_SCELTA_FILE_IMP_M:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_M:{break;}
		case RICERCA_MONETE:{break;}
		case ATTESA_INFO_COMPLETA_M:{
			mystate=ATTESA_CONFERMA_C;
			visualizzazione=vis;
			((AccedereCollezione)this).jContentPane.remove(((AccedereCollezione)this).jSP_Visualizzazione);
			((AccedereCollezione)this).getPannelloVisualizzazione();
			
			msg=new String("Procedere con l'operazione?");
			JOptionPane question = new JOptionPane(msg,JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
			question.setMessage(msg);
			JDialog dialog = question.createDialog(new JFrame(),"");
			dialog.pack();
			dialog.setVisible(true);
			int n = ((Integer)question.getValue()).intValue();
			if ( n == 0) {conferma(); break;}
			else {annulla();
			break;}
			}
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
			visualizzazione=vis;  
			((AccedereEasyCatalogo)this).jContentPane.remove(((AccedereEasyCatalogo)this).jSP_Visualizzazione);
			((AccedereEasyCatalogo)this).getPannelloVisualizzazione();
			break;}
		case ATTESA_CONTROLLO_DATI_M:{
			visualizzazione=vis;  
			((AccedereCollezione)this).jContentPane.remove(((AccedereCollezione)this).jSP_Visualizzazione);
			((AccedereCollezione)this).getPannelloVisualizzazione();
			break;}
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
		case CAMBIO_MODALITA_VISUALIZZAZIONE_M:{
			mystate=COLLEZIONE_APERTA;
			visualizzazione=vis;  
			((AccedereCollezione)this).jContentPane.remove(((AccedereCollezione)this).jSP_Visualizzazione);
			((AccedereCollezione)this).getPannelloVisualizzazione();
			break;}
		default:{}
		}
	}
	
	public void criterio(CriterioRicerca crit){
		switch(mystate){
		case CATALOGO_APERTO:{break;} 
		case ATTESA_CONFERMA_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_EC:{break;}
		case ATTENDI_SCELTA_FILE_IMP_EC:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_EC:{break;}
		case ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC:{break;}
		case RICERCA_IN_EASYCATALOGO:{
			 mystate=CATALOGO_APERTO;
			((AccedereEasyCatalogo)this).getGEC().ricercaEc(crit);
			break;}
		case ATTESA_INFO_COMPLETA_EE:{break;}
		case ATTESA_INFO_COMPLETA_E:{break;}
		case ATTESA_INFO_COMPLETA_TM:{break;}
		case COLLEZIONE_APERTA:{break;} 
		case ATTESA_MONETE_CONTENUTE_NEL_FILE:{break;}
		case ATTENDI_SCELTA_FILE_IMP_M:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_M:{break;}
		case RICERCA_MONETE:{
			mystate=COLLEZIONE_APERTA;
			((AccedereCollezione)this).getGC().ricercaMonete(crit);  break;}
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
	
	public void daiFile(FilePath f){
		switch(mystate){
		case CATALOGO_APERTO:{break;} 
		case ATTESA_CONFERMA_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_EC:{break;}
		case ATTENDI_SCELTA_FILE_IMP_EC:{
			mystate=ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC;
			((AccedereEasyCatalogo)this).getGEC().importaEC(f);  break;} 
		case ATTENDI_SCELTA_FILE_ESP_EC:{
			mystate=FILE_SCELTO_M;
			((AccedereEasyCatalogo)this).getGEC().esportaEC(f);  break;}
		case ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC:{break;}
		case RICERCA_IN_EASYCATALOGO:{break;}
		case ATTESA_INFO_COMPLETA_EE:{break;}
		case ATTESA_INFO_COMPLETA_E:{break;}
		case ATTESA_INFO_COMPLETA_TM:{break;}
		case COLLEZIONE_APERTA:{break;} 
		case ATTESA_MONETE_CONTENUTE_NEL_FILE:{break;}
		case ATTENDI_SCELTA_FILE_IMP_M:{
			mystate=ATTESA_MONETE_CONTENUTE_NEL_FILE; 
			((AccedereCollezione)this).getGC().importaM(f); break;} 
		case ATTENDI_SCELTA_FILE_ESP_M:{
			mystate=FILE_SCELTO_M;
			((AccedereCollezione)this).getGC().esportaM(f); break;}
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
	
	public void modVisualizzazione(ModalitaVisualizzazione mv){
		switch(mystate){
		case CATALOGO_APERTO:{mystate=CAMBIO_MODALITA_VISUALIZZAZIONE_EC;((AccedereEasyCatalogo)this).getGEC().setModalitaVisualizzazione(mv);  break;} 
		case ATTESA_CONFERMA_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_EC:{break;}
		case ATTENDI_SCELTA_FILE_IMP_EC:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_EC:{break;}
		case ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC:{break;}
		case RICERCA_IN_EASYCATALOGO:{break;}
		case ATTESA_INFO_COMPLETA_EE:{break;}
		case ATTESA_INFO_COMPLETA_E:{break;}
		case ATTESA_INFO_COMPLETA_TM:{break;}
		case COLLEZIONE_APERTA:{mystate=CAMBIO_MODALITA_VISUALIZZAZIONE_M;((AccedereCollezione)this).getGC().setModalitaVisualizzazione(mv); break;} 
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
	
	public void cambioModalita(){
		switch(mystate){
		case CATALOGO_APERTO:{mystate=COLLEZIONE_APERTA;((AccedereEasyCatalogo)this).getGEC().cambiaModalita(); ((AccedereEasyCatalogo)this).setVisible(false);break;} 
		case ATTESA_CONFERMA_EC:{break;}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_EC:{break;}
		case ATTENDI_SCELTA_FILE_IMP_EC:{break;} 
		case ATTENDI_SCELTA_FILE_ESP_EC:{break;}
		case ATTESA_INFORMAZIONI_CONTENUTE_NEL_FILE_EC:{break;}
		case RICERCA_IN_EASYCATALOGO:{break;}
		case ATTESA_INFO_COMPLETA_EE:{break;}
		case ATTESA_INFO_COMPLETA_E:{break;}
		case ATTESA_INFO_COMPLETA_TM:{break;}
		case COLLEZIONE_APERTA:{mystate=CATALOGO_APERTO;((AccedereCollezione)this).getGC().cambiaModalita(); ((AccedereCollezione)this).setVisible(false); break;} 
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
	
	public void fatto(){
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
		case FILE_SCELTO_M:{
			mystate=COLLEZIONE_APERTA;
			msg=new String("Operazione eseguita con successo");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Information",JOptionPane.INFORMATION_MESSAGE);
			
			break;
			} 
		case FILE_SCELTO_EC:{
			mystate=CATALOGO_APERTO;
			msg=new String("Operazione eseguita con successo");
			JOptionPane.showMessageDialog(new JFrame(),msg,"Information",JOptionPane.INFORMATION_MESSAGE);
			
			break;
			}
		case CAMBIO_MODALITA_VISUALIZZAZIONE_M:{break;}
		default:{}
		}
	}

}
