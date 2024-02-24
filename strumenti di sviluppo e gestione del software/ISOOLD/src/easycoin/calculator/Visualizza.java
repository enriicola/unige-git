
package easycoin.calculator;

import java.awt.Dimension;
import java.util.*;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import easycoin.boundary.AccedereCollezione;
import easycoin.boundary.AccedereEasyCatalogo;
import easycoin.datatype.*;
import easycoin.datatype.visualizzazione.*;
import easycoin.enumeration.*;
import easycoin.store.*;

//Bisogna ancora gestire le unit�,fattore molteplicit� e stato
public class Visualizza {
	
	//Servono per la chiamata delle operazioni da parte dei Button
	private AccedereEasyCatalogo AEC;
    private AccedereCollezione AC;
	private JPanel jP_Pannello;
	private JPanel aux;
	
	//<<create>> mkVisualizza()
    public Visualizza() {}
    
    //Metodo per la visualizzazione
    public Visualizzazione visualizza(ModalitaVisualizzazione mod,Info i){//FATTO
    	if (mod.getFormato().equals(Formato.schede)){
    		if (mod.getConcisione().equals(Concisione.ridotta)){
    			 if (mod.getMostra().equals(OggettoDaMostrare.Enti_Emettitori)){
    				 //if (!(i.getEnteEmettitoreH().isEmpty()))
    				 return visualizzaEESchedeRidotto(i);
    			 }
    			 if (mod.getMostra().equals(OggettoDaMostrare.Emissioni)){
    				 //if (!(i.getEmissioneH().isEmpty()))
    				 return visualizzaESchedeRidotto(i);
    			 }
    			 if (mod.getMostra().equals(OggettoDaMostrare.Tipi_Monete)){
    				 //if (!(i.getTipoH().isEmpty()))
    				 return visualizzaTMSchedeRidotto(i);
    			 }
    			 if (mod.getMostra().equals(OggettoDaMostrare.Monete)){
    				 //if(!(i.getMonetaH().isEmpty()))
    				 return visualizzaMSchedeRidotto(i);
    			 }
    		}
    		if (mod.getConcisione().equals(Concisione.completa)){
	   			 if (mod.getMostra().equals(OggettoDaMostrare.Enti_Emettitori)){
	   				//if (!(i.getEnteEmettitoreH().isEmpty()))
	   				return visualizzaEESchedeCompleto(i);
	   			 }
	   			 if (mod.getMostra().equals(OggettoDaMostrare.Emissioni)){
	   				 //if (!(i.getEmissioneH().isEmpty()))
	   				return visualizzaESchedeCompleto(i);
	   			 }
	   			 if (mod.getMostra().equals(OggettoDaMostrare.Tipi_Monete)){
	   				//if (!(i.getTipoH().isEmpty()))
	   				return visualizzaTMSchedeCompleto(i); 
	   			 }
	   			 if (mod.getMostra().equals(OggettoDaMostrare.Monete)){
	   				//if(!(i.getMonetaH().isEmpty()))
	   				return visualizzaMSchedeCompleto(i); 
	   			 }
	   		}
    		//return new ASchede(this);
    	}
    	if (mod.getFormato().equals(Formato.sezioni)){
    		if (mod.getConcisione().equals(Concisione.ridotta)){
    			 if (mod.getMostra().equals(OggettoDaMostrare.Enti_Emettitori)){
    				 //if (!(i.getEnteEmettitoreH().isEmpty()))
    				 return visualizzaEESezioniRidotto(i);
    			 }
    			 if (mod.getMostra().equals(OggettoDaMostrare.Emissioni)){
    				 //if (!(i.getEmissioneH().isEmpty()))
    				 return visualizzaESezioniRidotto(i);
    			 }
    			 if (mod.getMostra().equals(OggettoDaMostrare.Tipi_Monete)){
    				 //if (!(i.getTipoH().isEmpty()))
    				 return visualizzaTMSezioniRidotto(i);
    			 }
    			 if (mod.getMostra().equals(OggettoDaMostrare.Monete)){
    				// if(!(i.getMonetaH().isEmpty()))
    				 return visualizzaMSezioniRidotto(i);
    			 }
    		}
    		if (mod.getConcisione().equals(Concisione.completa)){
	   			 if (mod.getMostra().equals(OggettoDaMostrare.Enti_Emettitori)){
	   				//if (!(i.getEnteEmettitoreH().isEmpty()))
	   				 return visualizzaEESezioniCompleto(i);
	   			 }
	   			 if (mod.getMostra().equals(OggettoDaMostrare.Emissioni)){
	   				//if (!(i.getEmissioneH().isEmpty()))
	   				return visualizzaESezioniCompleto(i);
	   			 }
	   			 if (mod.getMostra().equals(OggettoDaMostrare.Tipi_Monete)){
	   				//if (!(i.getTipoH().isEmpty()))
	   				 return visualizzaTMSezioniCompleto(i);
	   			 }
	   			 if (mod.getMostra().equals(OggettoDaMostrare.Monete)){
	   				//if(!(i.getMonetaH().isEmpty()))
	   				 return visualizzaMSezioniCompleto(i);
	   			 }
	   		}
    	}
    	return new Visualizzazione(this);
    }
    
    @SuppressWarnings("unchecked")
	private ASezioni visualizzaMSezioniRidotto(Info i) {//FATTO
    	Moneta moneta=null;
    	int k=0;
    	int aux;
    	Hashtable sezione=new Hashtable();
    	for (Enumeration e=i.getEmissioneH().keys(); e.hasMoreElements();){
			Id emissione=new Id(((Integer)e.nextElement()).intValue());
			aux=k;
			for (Enumeration j = i.getMonetaH().elements(); j.hasMoreElements();){
				moneta=(Moneta)j.nextElement();
				if (emissione.getId() == moneta.getEmissione().getId()){
					MSezioneRidotto m = new MSezioneRidotto(this,moneta.getEmissione(),moneta.getId(),moneta.getInfoM().getGrado().toString(),moneta.getInfoM().getStato().StampaStato(moneta.getInfoM().getStato().getNote()));
		    		m.initialize();
		    		sezione.put(k, m);
					k++;
				}
			}
			if ((k-aux)==0){
				MSezioneRidotto m = new MSezioneRidotto(this,emissione);
	    		m.initialize();
	    		sezione.put(k, m);
				k++;
			}
		}
    	ASezioni s=new ASezioni(this,sezione);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASezioni visualizzaTMSezioniRidotto(Info i) {//FATTO
		Tipo tipo=null;
		int k=0;
		int aux=0;
		Hashtable sezione=new Hashtable();
		for (Enumeration e=i.getEnteEmettitoreH().keys(); e.hasMoreElements();){
			Id ente=new Id(((Integer)e.nextElement()).intValue());
			aux=k;
			for (Enumeration j = i.getTipoH().elements(); j.hasMoreElements();){
				tipo=(Tipo)j.nextElement();
				if (ente.getId() == tipo.getEnteEmettitore().getId()){
					TMSezioneRidotto tm = new TMSezioneRidotto(this,tipo.getEnteEmettitore(),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione(),emissione(tipo.getId(),i));
					tm.initialize();
					sezione.put(k, tm);
					k++;
				}
			}
			if ((k-aux)==0){
				TMSezioneRidotto tm = new TMSezioneRidotto(this,ente);
				tm.initialize();
				sezione.put(k, tm);
				k++;
			}
		}
		ASezioni s=new ASezioni(this,sezione);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASezioni visualizzaESezioniRidotto(Info i) {//FATTO
		Emissione emissione=null;
		int k=0;
		int aux;
		Hashtable sezione=new Hashtable();
		Hashtable monete=i.getMonetaH();
		for (Enumeration t=i.getTipoH().keys(); t.hasMoreElements();){
			Id tipo=new Id(((Integer)t.nextElement()).intValue());
			aux=k;
			for (Enumeration j = i.getEmissioneH().elements(); j.hasMoreElements();){
				emissione=(Emissione)j.nextElement();
				if (tipo.getId() == emissione.getTipo().getId()){
					ESezioneRidotto e = new ESezioneRidotto(this,emissione.getTipo(),emissione.getId(),emissione.getInfoE().getAnno()+"",moneta(emissione.getId(),monete));
					e.initialize();
					sezione.put(k, e);
					k++;
				}
			}
			if ((k-aux)==0){
				ESezioneRidotto e = new ESezioneRidotto(this,tipo);
				e.initialize();
				sezione.put(k, e);
				k++;
			}
		}
		ASezioni s=new ASezioni(this,sezione);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASezioni visualizzaEESezioniRidotto(Info i) {//FATTO
		EnteEmettitore ente=null;
		int k=0;
		Hashtable sezione=new Hashtable();
		for (Enumeration j = i.getEnteEmettitoreH().elements(); j.hasMoreElements();){
			ente=(EnteEmettitore)j.nextElement();
			EESezioneRidotto ee = new EESezioneRidotto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),tipo(ente.getId(),i));
			ee.initialize();
			sezione.put(k, ee);
			k++;
		}
		if (k==0){
			EESezioneRidotto ee = new EESezioneRidotto(this);
			ee.initialize();
			sezione.put(k, ee);
			k++;
		}
		ASezioni s=new ASezioni(this,sezione);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASezioni visualizzaMSezioniCompleto(Info i) {//FATTO
    	Moneta moneta=null;
    	int k=0;
    	int aux;
    	Hashtable sezione=new Hashtable();
    	for (Enumeration e=i.getEmissioneH().keys(); e.hasMoreElements();){
			Id emissione=new Id(((Integer)e.nextElement()).intValue());
			aux=k;
			for (Enumeration j = i.getMonetaH().elements(); j.hasMoreElements();){
				moneta=(Moneta)j.nextElement();
				if (emissione.getId() == moneta.getEmissione().getId()){
					MSezioneCompleto m = new MSezioneCompleto(this,moneta.getEmissione(),moneta.getId(),moneta.getInfoM().getGrado().toString(),moneta.getInfoM().getStato().StampaStato(moneta.getInfoM().getStato().getNote()),moneta.getInfoM().getValoreCommerciale()+"");
		    		m.initialize();
		    		sezione.put(k, m);
					k++;
				}
			}
			if ((k-aux)==0){
				MSezioneCompleto m = new MSezioneCompleto(this,emissione);
	    		m.initialize();
	    		sezione.put(k, m);
				k++;
			}
		}
    	ASezioni s=new ASezioni(this,sezione);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASezioni visualizzaTMSezioniCompleto(Info i) {//FATTO
		Tipo tipo=null;
		int k=0;
		int aux;
		Hashtable sezione=new Hashtable();
		Hashtable unita=i.getUnitaH();
		for (Enumeration e=i.getEnteEmettitoreH().keys(); e.hasMoreElements();){
			Id ente=new Id(((Integer)e.nextElement()).intValue());
			aux=k;
			for (Enumeration j = i.getTipoH().elements(); j.hasMoreElements();){
				tipo=(Tipo)j.nextElement();
				if (ente.getId() == tipo.getEnteEmettitore().getId()){
					TMSezioneCompleto tm = new TMSezioneCompleto(this,tipo.getEnteEmettitore());
					tm.initialize();
					sezione.put(k, tm);
					k++;
				}
			}
			if ((k-aux)==0){
				TMSezioneCompleto tm = new TMSezioneCompleto(this,ente);
				tm.initialize();
				sezione.put(k, tm);
				k++;
			}
		}
		ASezioni s=new ASezioni(this,sezione);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASezioni visualizzaESezioniCompleto(Info i) {//FATTO
		Emissione emissione=null;
		int k=0;
		int aux;
		Hashtable sezione=new Hashtable();
		Hashtable monete=i.getMonetaH();
		for (Enumeration t=i.getTipoH().keys(); t.hasMoreElements();){
			Id tipo=new Id(((Integer)t.nextElement()).intValue());
			aux=k;
			for (Enumeration j = i.getEmissioneH().elements(); j.hasMoreElements();){
				emissione=(Emissione)j.nextElement();
				if (tipo.getId() == emissione.getTipo().getId()){
					Zecca z=(Zecca)i.getZeccaH().get(emissione.getZecca().getId());
					ESezioneCompleto e = new ESezioneCompleto(this,emissione.getTipo(),emissione.getId(),emissione.getInfoE().getAnno()+"",moneta(emissione.getId(),monete),z.getInfoZ().getSigla(),z.getInfoZ().getDescrizione());
					e.initialize();
					sezione.put(k, e);
					k++;
				}
			}
			if ((k-aux)==0){
				ESezioneCompleto e = new ESezioneCompleto(this,tipo);
				e.initialize();
				sezione.put(k, e);
				k++;
			}
		}
		ASezioni s=new ASezioni(this,sezione);
		return s;
	}

	@SuppressWarnings({ "unchecked", "deprecation" })
	private ASezioni visualizzaEESezioniCompleto(Info i) {//FATTO
		EnteEmettitore ente=null;
		int k=0;
		
		Hashtable sezione=new Hashtable();
		Hashtable zecche=i.getZeccaH();
		Hashtable sistemiMonetari=i.getSistemaMonetarioH();
		for (Enumeration j = i.getEnteEmettitoreH().elements(); j.hasMoreElements();){
			ente=(EnteEmettitore)j.nextElement();
			EESezioneCompleto ee = new EESezioneCompleto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),tipo(ente.getId(),i),ente.getInfoEE().getNomeOriginale(),(ente.getInfoEE().getDataInizio().getYear()+1900)+"",(ente.getInfoEE().getDataFine().getYear()+1900)+"",ente.getInfoEE().getNote(),zecche(ente.getId(),zecche),sistemiMon(ente.getId(),sistemiMonetari));
			ee.initialize();
			sezione.put(k, ee);
			k++;
		}
		if (k==0){
			EESezioneCompleto ee = new EESezioneCompleto(this);
			ee.initialize();
			sezione.put(k, ee);
			k++;
		}
		ASezioni s=new ASezioni(this,sezione);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASchede visualizzaMSchedeRidotto(Info i) {//FATTO
		Moneta moneta;
		EnteEmettitore ente;
		Tipo tipo;
		int aux;
		Hashtable enti= i.getEnteEmettitoreH();
		Hashtable tipi= i.getTipoH();
		int k=0;
		Hashtable scheda=new Hashtable();
		for (Enumeration e=i.getEmissioneH().elements(); e.hasMoreElements();){
			Emissione emissione=(Emissione)e.nextElement();
			aux=k;
			tipo=(Tipo)tipi.get(emissione.getTipo().getId());
			ente=(EnteEmettitore)enti.get(tipo.getEnteEmettitore().getId());
			for (Enumeration j = i.getMonetaH().elements(); j.hasMoreElements();){
				moneta=(Moneta)j.nextElement();
				if (emissione.getId().getId() == moneta.getEmissione().getId()){
					MSchedaRidotto m= new MSchedaRidotto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione(),emissione.getId(),emissione.getInfoE().getAnno()+"",moneta.getId(),moneta.getInfoM().getGrado().toString(),moneta.getInfoM().getStato().StampaStato(moneta.getInfoM().getStato().getNote()));
					m.initialize();
					scheda.put(k, m);
					k++;
				}
			}
			if ((k-aux)==0){
				MSchedaRidotto m= new MSchedaRidotto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione(),emissione.getId(),emissione.getInfoE().getAnno()+"");
				m.initialize();
				scheda.put(k, m);
				k++;
			}
		}
		ASchede s= new ASchede(this,scheda);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASchede visualizzaTMSchedeRidotto(Info i) {//FATTO
		Tipo tipo;
		int k=0;
		int aux;
		Hashtable scheda=new Hashtable();
		for (Enumeration e=i.getEnteEmettitoreH().elements(); e.hasMoreElements();){
			EnteEmettitore ente=(EnteEmettitore)e.nextElement();
			aux=k;
			for (Enumeration j = i.getTipoH().elements(); j.hasMoreElements();){
				tipo=(Tipo)j.nextElement();
				if (ente.getId().getId() == tipo.getEnteEmettitore().getId()){
					TMSchedaRidotto tm = new TMSchedaRidotto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione());
					tm.initialize();
					scheda.put(k, tm);
					k++;
				}
			}
			if ((k-aux)==0){
				TMSchedaRidotto tm = new TMSchedaRidotto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica());
				tm.initialize();
				scheda.put(k, tm);
				k++;
			}
		}
		ASchede s= new ASchede(this,scheda);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASchede visualizzaESchedeRidotto(Info i) {//FATTO
		Emissione emissione;
		EnteEmettitore ente;
		Hashtable enti= i.getEnteEmettitoreH();
		int k=0;
		int aux;
		Hashtable scheda=new Hashtable();
		for (Enumeration t=i.getTipoH().elements(); t.hasMoreElements();){
			Tipo tipo=(Tipo)t.nextElement();
			aux=k;
			ente=(EnteEmettitore)enti.get(tipo.getEnteEmettitore().getId());
			for (Enumeration j = i.getEmissioneH().elements(); j.hasMoreElements();){
				emissione=(Emissione)j.nextElement();
				if (tipo.getId().getId() == emissione.getTipo().getId()){
					ESchedaRidotto e= new ESchedaRidotto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione(),emissione.getId(),emissione.getInfoE().getAnno()+"");
					e.initialize();
					scheda.put(k, e);
					k++;
				}
			}
			if ((k-aux)==0){
				ESchedaRidotto e= new ESchedaRidotto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione());
				e.initialize();
				scheda.put(k, e);
				k++;
			}
		}
		ASchede s= new ASchede(this,scheda);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASchede visualizzaEESchedeRidotto(Info i) {//FATTO
		EnteEmettitore ente=null;
		int k=0;
		Hashtable scheda=new Hashtable();
		for (Enumeration j = i.getEnteEmettitoreH().elements(); j.hasMoreElements();){
			ente=(EnteEmettitore)j.nextElement();
			EESchedaRidotto ee= new EESchedaRidotto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica());
			ee.initialize();
			scheda.put(k, ee);
			k++;
		}
		if (k==0){
			EESchedaRidotto ee= new EESchedaRidotto(this);
			ee.initialize();
			scheda.put(k, ee);
			k++;
		}
		ASchede s= new ASchede(this,scheda);
		return s;
	}

	@SuppressWarnings("unchecked")
	private ASchede visualizzaMSchedeCompleto(Info i) {//FATTO
		Moneta moneta=null;
		EnteEmettitore ente=null;
		Tipo tipo=null;
		int k=0;
		int aux;
		Hashtable scheda=new Hashtable();
		Hashtable zecche=i.getZeccaH();
		Hashtable sistemiMonetari=i.getSistemaMonetarioH();
		Hashtable enti=i.getEnteEmettitoreH();
		Hashtable tipi=i.getTipoH();
		Hashtable unita=i.getUnitaH();
		for (Enumeration e=i.getEmissioneH().elements(); e.hasMoreElements();){
			Emissione emissione=(Emissione)e.nextElement();
			aux=k;
			tipo=(Tipo)tipi.get(emissione.getTipo().getId());
			ente=(EnteEmettitore)enti.get(tipo.getEnteEmettitore().getId());
			for (Enumeration j = i.getMonetaH().elements(); j.hasMoreElements();){
				moneta=(Moneta)j.nextElement();
				if (emissione.getId().getId() == moneta.getEmissione().getId()){
					MSchedaCompleto m = new MSchedaCompleto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),ente.getInfoEE().getNomeOriginale(),ente.getInfoEE().getDataInizio().toString(),ente.getInfoEE().getDataFine().toString(),ente.getInfoEE().getNote(),zecche(tipo.getEnteEmettitore(),zecche),sistemiMon(tipo.getEnteEmettitore(),sistemiMonetari),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione(),visualizzaValoreNominale(tipo.getInfoTipoMoneta().getVnom()),((Unita)unita.get(tipo.getUnita().getId())).getInfoU().getNome(), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), null, visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), null, visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0));
					m.initialize();
					scheda.put(k, m);
					k++;
				}
			}
			if ((k-aux)==0){
				MSchedaCompleto m = new MSchedaCompleto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),ente.getInfoEE().getNomeOriginale(),ente.getInfoEE().getDataInizio().toString(),ente.getInfoEE().getDataFine().toString(),ente.getInfoEE().getNote(),zecche(tipo.getEnteEmettitore(),zecche),sistemiMon(tipo.getEnteEmettitore(),sistemiMonetari),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione(),visualizzaValoreNominale(tipo.getInfoTipoMoneta().getVnom()),((Unita)unita.get(tipo.getUnita().getId())).getInfoU().getNome(), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), null, visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), null, visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0));
				m.initialize();
				scheda.put(k, m);
				k++;
			}
		}
		ASchede s= new ASchede(this,scheda);
		return s;
	}

	@SuppressWarnings({ "unchecked", "deprecation" })
	private ASchede visualizzaTMSchedeCompleto(Info i) {//FATTO
		Tipo tipo=null;
		int k=0;
		int aux;
		Hashtable scheda=new Hashtable();
		Hashtable zecche=i.getZeccaH();
		Hashtable sistemiMonetari=i.getSistemaMonetarioH();
		Hashtable unita=i.getUnitaH();
		for (Enumeration e=i.getEnteEmettitoreH().elements(); e.hasMoreElements();){
			EnteEmettitore ente=(EnteEmettitore)e.nextElement();
			aux=k;
			for (Enumeration j = i.getTipoH().elements(); j.hasMoreElements();){
				tipo=(Tipo)j.nextElement();
				if (ente.getId().getId() == tipo.getEnteEmettitore().getId()){
					TMSchedaCompleto tm = new TMSchedaCompleto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),ente.getInfoEE().getNomeOriginale(),(ente.getInfoEE().getDataInizio().getYear()+1900)+"",(ente.getInfoEE().getDataFine().getYear()+1900)+"",ente.getInfoEE().getNote(),zecche(tipo.getEnteEmettitore(),zecche),sistemiMon(tipo.getEnteEmettitore(),sistemiMonetari),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione(),visualizzaValoreNominale(tipo.getInfoTipoMoneta().getVnom()),((Unita)unita.get(tipo.getUnita().getId())).getInfoU().getNome(),((Unita)unita.get(tipo.getUnita().getId())).getInfoU().getFattoreMonteplicita()+"",tipo.getInfoTipoMoneta().getSpessore()+"",tipo.getInfoTipoMoneta().getPeso()+"",tipo.getInfoTipoMoneta().getBordo(),tipo.getInfoTipoMoneta().getDimensione()+"",tipo.getInfoTipoMoneta().getForma().toString(),tipo.getInfoTipoMoneta().getMateriale());
					tm.initialize();
					scheda.put(k, tm);
					k++;
				}
			}
			if ((k-aux)==0){
				TMSchedaCompleto tm = new TMSchedaCompleto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),ente.getInfoEE().getNomeOriginale(),(ente.getInfoEE().getDataInizio().getYear()+1900)+"",(ente.getInfoEE().getDataFine().getYear()+1900)+"",ente.getInfoEE().getNote(),zecche(ente.getId(),zecche),sistemiMon(ente.getId(),sistemiMonetari));
				tm.initialize();
				scheda.put(k, tm);
				k++;
			}
		}
		ASchede s= new ASchede(this,scheda);
		return s;
	}

	@SuppressWarnings({ "unchecked", "deprecation" })
	private ASchede visualizzaESchedeCompleto(Info i) {//FATTO
		Emissione emissione=null;
		EnteEmettitore ente=null;
		int aux;
		int k=0;
		Hashtable scheda=new Hashtable();
		Hashtable zecche=i.getZeccaH();
		Hashtable sistemiMonetari=i.getSistemaMonetarioH();
		Hashtable enti=i.getEnteEmettitoreH();
		Hashtable unita=i.getUnitaH();
		for (Enumeration t=i.getTipoH().elements(); t.hasMoreElements();){
			Tipo tipo=(Tipo)t.nextElement();
			aux=k;
			ente=(EnteEmettitore)enti.get(tipo.getEnteEmettitore().getId());
			for (Enumeration j = i.getEmissioneH().elements(); j.hasMoreElements();){
				emissione=(Emissione)j.nextElement();
				if (tipo.getId().getId() == emissione.getTipo().getId()){
					ESchedaCompleto e = new ESchedaCompleto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),ente.getInfoEE().getNomeOriginale(),(ente.getInfoEE().getDataInizio().getYear()+1900)+"",(ente.getInfoEE().getDataFine().getYear()+1900)+"",ente.getInfoEE().getNote(),zecche(tipo.getEnteEmettitore(),zecche),sistemiMon(tipo.getEnteEmettitore(),sistemiMonetari),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione(),visualizzaValoreNominale(tipo.getInfoTipoMoneta().getVnom()),((Unita)unita.get(tipo.getUnita().getId())).getInfoU().getNome(), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0), visualizzaFattoreMolteciplit(0));
					e.initialize();
					scheda.put(k, e);
					k++;
				}
			}
			if ((k-aux)==0){
				ESchedaCompleto e = new ESchedaCompleto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),ente.getInfoEE().getNomeOriginale(),(ente.getInfoEE().getDataInizio().getYear()+1900)+"",(ente.getInfoEE().getDataFine().getYear()+1900)+"",ente.getInfoEE().getNote(),zecche(tipo.getEnteEmettitore(),zecche),sistemiMon(tipo.getEnteEmettitore(),sistemiMonetari),tipo.getId(),tipo.getInfoTipoMoneta().getDescrizione(),visualizzaValoreNominale(tipo.getInfoTipoMoneta().getVnom()),((Unita)unita.get(tipo.getUnita().getId())).getInfoU().getNome(),((Unita)unita.get(tipo.getUnita().getId())).getInfoU().getFattoreMonteplicita()+"",tipo.getInfoTipoMoneta().getSpessore()+"",tipo.getInfoTipoMoneta().getPeso()+"",tipo.getInfoTipoMoneta().getBordo(),tipo.getInfoTipoMoneta().getDimensione()+"",tipo.getInfoTipoMoneta().getForma().toString(),tipo.getInfoTipoMoneta().getMateriale());
				e.initialize();
				scheda.put(k, e);
				k++;
			}
		}
		ASchede s= new ASchede(this,scheda);
		return s;
	}

	@SuppressWarnings({ "unchecked", "deprecation" })
	private ASchede visualizzaEESchedeCompleto(Info i){//FATTO
		EnteEmettitore ente=null;
		int k=0;
		Hashtable scheda=new Hashtable();
		Hashtable zecche=i.getZeccaH();
		Hashtable sistemiMonetari=i.getSistemaMonetarioH();
		for (Enumeration j = i.getEnteEmettitoreH().elements(); j.hasMoreElements();){
			ente=(EnteEmettitore)j.nextElement();			
			EESchedaCompleto ee= new EESchedaCompleto(this,ente.getId(),ente.getInfoEE().getNome(),ente.getInfoEE().getAreaGeografica(),ente.getInfoEE().getNomeOriginale(),(ente.getInfoEE().getDataInizio().getYear()+1900)+"",(ente.getInfoEE().getDataFine().getYear()+1900)+"",ente.getInfoEE().getNote(),zecche(ente.getId(),zecche),sistemiMon(ente.getId(),sistemiMonetari));
			ee.initialize();
			scheda.put(k, ee);
			k++;
		}
		if (k==0){
			EESchedaCompleto ee= new EESchedaCompleto(this);
			ee.initialize();
			scheda.put(k, ee);
			k++;
		}
		ASchede s= new ASchede(this,scheda);
		return s;
    }
    
	//Ritorna il valore Nominale nel formato String
    public String visualizzaValoreNominale(ValoreNominale valNominale){
    	if (valNominale.getParteIntera()==0)
    		return valNominale.getNumeratore()+"/"+valNominale.getDenominatore();
    	if (valNominale.getNumeratore()==0)
    		return valNominale.getParteIntera()+"";
    	return valNominale.getParteIntera()+" "+valNominale.getNumeratore()+"/"+valNominale.getDenominatore();
    }
    
    //Ritorna l'anno nel formato String
    @SuppressWarnings("deprecation")
	public String visualizzaAnno(Date anno){
    	return new Integer(anno.getYear()).toString();
    }
    
    //Ritorna la forma di una moneta in formato String
    public String visualizzaForma(Forma forma){
    	for (int i=0;i<Forma.values().length;i++)
    		if(forma.equals(Forma.values()[i])) return Forma.values()[i].toString();
    	return null;
    }
    
    //Ritorna il Fattore di Molteplicit� in formato String
    public String visualizzaFattoreMolteciplit(float fattMolt){
    	return new Float(fattMolt).toString();
    }
    
//	Ricerco i tipi moneta dell'ente emettitore
    @SuppressWarnings("unchecked")
	private Hashtable tipo(Id idEE,Info i){
    	Tipo tipoM=null;
    	Hashtable tipi=new Hashtable();
    	Hashtable tipo=i.getTipoH();
    	int k=0;
    	for (Enumeration jt = tipo.elements(); jt.hasMoreElements();){
			tipoM = (Tipo)jt.nextElement();
			if (tipoM.getEnteEmettitore().getId()==idEE.getId()){
				TMSezioneRidotto tm = new TMSezioneRidotto(this,tipoM.getEnteEmettitore(),tipoM.getId(),tipoM.getInfoTipoMoneta().getDescrizione(),emissione(tipoM.getId(),i));
				tm.initialize();
				tipi.put(k,tm);
				k++;
			}
		}
    	return tipi;
    }
    
//	Ricerco i sistemi monetari dell'ente emettitore
    @SuppressWarnings("unchecked")
	private Hashtable sistemiMon(Id idEE,Hashtable sistemi){
    	int k=0;
    	SistemaMonetario sistemaMonetario=null;
		Hashtable sm=new Hashtable();
		for (Enumeration ism = sistemi.elements(); ism.hasMoreElements();){
			sistemaMonetario=(SistemaMonetario)ism.nextElement();
			if (sistemaMonetario.getEnteEmettitore().getId()==idEE.getId()){
				SistemaMonetarioVis smv=new SistemaMonetarioVis(sistemaMonetario.getId(),sistemaMonetario.getInfoSM().getNome(),sistemaMonetario.getInfoSM().getNomeOriginale());
				sm.put(k, smv);
				k++;
			}
		}
		return sm;
    }
    
//	Ricerco le zecche dell'ente emettitore
    @SuppressWarnings("unchecked")
	private Hashtable zecche(Id idEE,Hashtable zecche){
    	int k=0;
    	Zecca zecca=null;
		Hashtable z=new Hashtable();
		for (Enumeration iz = zecche.elements(); iz.hasMoreElements();){
			zecca=(Zecca)iz.nextElement();
			if (zecca.getEnteEmettitore().getId()==idEE.getId()){
				ZeccaVis zv=new ZeccaVis(zecca.getId(),zecca.getInfoZ().getSigla(),zecca.getInfoZ().getDescrizione());
				z.put(k, zv);
				k++;
			}
		}
		return z;
    }
    
//	Ricerco le emissioni del tipo moneta
    @SuppressWarnings("unchecked")
	private Hashtable emissione(Id idTM,Info i){
    	int k=0;
    	Emissione emissione=null;
		Hashtable eh=new Hashtable();
		Hashtable emissioni=i.getEmissioneH();
		for (Enumeration jt = emissioni.elements(); jt.hasMoreElements();){
			emissione=(Emissione)jt.nextElement();
			if (emissione.getTipo().getId()==idTM.getId()){
				ESezioneRidotto e = new ESezioneRidotto(this,emissione.getTipo(),emissione.getId(),emissione.getInfoE().getAnno()+"",moneta(emissione.getId(),i.getMonetaH()));
				e.initialize();
				eh.put(k, e);
				k++;
			}
		}
		return eh;
    }
    
//	Ricerco le monete dell'emissione
    @SuppressWarnings("unchecked")
	private Hashtable moneta(Id idE,Hashtable monete){
    	int k=0;
    	Moneta moneta=null;
		Hashtable mh=new Hashtable();
		for (Enumeration i = monete.elements(); i.hasMoreElements();){
			moneta=(Moneta)i.nextElement();
			if (moneta.getEmissione().getId()==idE.getId()){
				MSezioneRidotto m = new MSezioneRidotto(this,moneta.getEmissione(),moneta.getId(),moneta.getInfoM().getGrado().toString(),moneta.getInfoM().getStato().toString());
	    		m.initialize();
				mh.put(k, m);
				k++;
			}
		}
		return mh;
    }


	public AccedereCollezione getAC() {
		return AC;
	}

	public void setAC(AccedereCollezione ac) {
		AC = ac;
	}

	public AccedereEasyCatalogo getAEC() {
		return AEC;
	}

	public void setAEC(AccedereEasyCatalogo aec) {
		AEC = aec;
	}
	
	public JScrollPane getPannelloZecche(Hashtable z){
		JScrollPane zecca=new JScrollPane();
		zecca.setSize(new Dimension(760, 160));
		zecca.getViewport().add(getJP_PannelloZ(z));
		zecca.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);	
		return zecca;
	}
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_PannelloZ(Hashtable z) {
		Zecca ze;
		if (jP_Pannello == null) {
			java.awt.GridBagConstraints gridBagConstraints;
			jP_Pannello = new JPanel();
			jP_Pannello.setLayout(new java.awt.GridBagLayout());
			int k=0;
			for (Enumeration i = z.elements(); i.hasMoreElements();){
				ze=(Zecca)i.nextElement();
				aux=(JPanel)new ZeccaVis(ze.getId(),ze.getInfoZ().getSigla(),ze.getInfoZ().getDescrizione());
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 760;
		        gridBagConstraints.ipady = aux.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets((k*aux.getHeight()), 10, 106, 21);
		        k++;
		        jP_Pannello.add(aux,gridBagConstraints);
			}
		}
		return jP_Pannello;
	}
	
	public JScrollPane getPannelloUnita(Hashtable u){
		JScrollPane unita=new JScrollPane();
		unita.setSize(new Dimension(760, 160));
		unita.getViewport().add(getJP_Pannello(u));
		unita.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);	
		return unita;
	}
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Pannello(Hashtable u) {
		Unita un;
		if (jP_Pannello == null) {
			java.awt.GridBagConstraints gridBagConstraints;
			jP_Pannello = new JPanel();
			jP_Pannello.setLayout(new java.awt.GridBagLayout());
			int k=0;
			for (Enumeration i = u.elements(); i.hasMoreElements();){
				un=(Unita)i.nextElement();
				aux=(JPanel)new UnitaVis(un);
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 760;
		        gridBagConstraints.ipady = aux.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets((k*aux.getHeight()), 10, 106, 21);
		        k++;
		        jP_Pannello.add(aux,gridBagConstraints);
			}
		}
		return jP_Pannello;
	}
	
	public JScrollPane getInfoCompletaE(Info i){
		JScrollPane e=visualizzaESchedeCompleto(i);
		e.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		return e;
	}
	
}
