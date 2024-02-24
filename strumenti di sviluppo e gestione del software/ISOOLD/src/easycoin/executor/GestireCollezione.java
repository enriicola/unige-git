package easycoin.executor;

import easycoin.calculator.*;
import easycoin.store.*;
import easycoin.temporary_store.*;
import easycoin.datatype.operazione.*;
import easycoin.datatype.*;
import easycoin.boundary.*;
import easycoin.datatype.criterio.*;
import easycoin.enumeration.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;

public class GestireCollezione extends Gestore {

	private Info mon;
	private Operazione op;
	private AccedereCollezione AC;
        
        private Esportatore ESPEC;
        private Importatore IMPEC;

	//Costruttore per Insert Into
	public GestireCollezione(ParteSelezionata SEL, OperazioniDaFare OPDF, PreferenzeStore PREF, Visualizza VIS, InfoStore INFO) {
		super(SEL, OPDF, PREF, VIS, INFO);
		mystate=C_APERTO;
		this.setCritCorrente(this.PREF.getCriterio());
		this.setMv(this.PREF.getModVis());
		this.mon = this.INFO.ricercaMonete(this.getCritCorrente());
		this.AC = new AccedereCollezione(this,this.getMv(), this.mon);
		this.SEL.set(this.mon);
	}

	public void eliminaM(Id idM){
            switch(mystate){
                case C_APERTO:{
                    this.mystate = ELIMINARE_M;
                    this.setId(idM);
                    ModalitaVisualizzazione modVis= new ModalitaVisualizzazione();
                    modVis.setMostra(OggettoDaMostrare.Monete);
                    modVis.setConcisione(Concisione.completa);
                    modVis.setFormato(Formato.schede);
                    this.AC.cambiaVisualizzato(this.VIS.visualizza(modVis,this.SEL.infoCompletaM(idM)));
                    break;
                }
                case INSERIRE_M:{break;}
                case IMPORTA_M:{break;}
                case MODIFICARE_M:{break;}
                case ELIMINARE_M:{break;}
            }
	}
	
	public void esportaM(FilePath f){
		switch(mystate){
		case C_APERTO:{
                        if(f.tipo().toString().equals("pdf")){
            		this.ESPEC=new EsportatorePDF();
            		((EsportatorePDF)(ESPEC)).generaPdf(mon, f.getPath());
            		this.AC.fatto();
                    break;
            		}
            	if(f.tipo().toString().equals("html")){
            		this.ESPEC=new EsportatoreHTML();
            		((EsportatoreHTML)(ESPEC)).generaHtmlM(mon,f.getPath());
            		this.AC.fatto();
                    break;
            	}
            	if(f.tipo().toString().equals("ec")){
            		this.ESPEC=new EsportatoreEC();
					String result=((EsportatoreEC)(ESPEC)).generaXml(mon);
					File file=new File(f.getPath());
					FileOutputStream fos = null;
					try 
					{
						fos = new FileOutputStream(file);
					} 
					catch (FileNotFoundException ex) 
					{
						ex.printStackTrace();
					}
					PrintStream ps=new PrintStream(fos);
					ps.println(result);
                    
                        
					this.AC.fatto();
					break;
            	}
            	if(f.tipo().toString().equals("txt")){
            		this.ESPEC=new EsportatoreTesto();
            		((EsportatoreTesto)(ESPEC)).EsportaTxt(mon,f.getPath());
          	
                        this.AC.fatto();
			break;
                }
                }
	    case INSERIRE_M:{break;}
	    case IMPORTA_M:{break;}
	    case MODIFICARE_M:{break;}
            case ELIMINARE_M:{break;}
	}
	}
	
	public void importaM(FilePath f){
            switch(mystate){
                case C_APERTO:{
                    this.mystate = IMPORTA_M;
                    this.IMPEC = new Importatore();
                    this.mon = this.IMPEC.importaM(f);
                    this.AC.importareM(this.mon);         
                    break;}
                case INSERIRE_M:{break;}
                case IMPORTA_M:{break;}
                case MODIFICARE_M:{break;}
                case ELIMINARE_M:{break;}
            }
	}
	
	public void inserisciM(InserireM IM,InfoMoneta moneta,Id idE){
            switch(mystate){
                case C_APERTO:{
                    Id newId = this.generaId();
                    IMoneta op= new IMoneta(newId,idE,moneta);
                    this.OPDF.put(op);
                    IM.ok();
                    this.AC.cambiaVisualizzato(this.VIS.visualizza(this.getMv(),this.SEL.get()));
                    break;}
                case INSERIRE_M:{break;}
                case IMPORTA_M:{break;}
                case MODIFICARE_M:{break;}
            }
	}
	
	public void modificaM(ModificareM MM,InfoMoneta moneta,Id idM){
            switch(mystate){
                case C_APERTO:{break;}
                case INSERIRE_M:{
                    this.mystate = C_APERTO;
                    Moneta monetaId = (Moneta)this.SEL.get().getMonetaH().get(idM);
                    Id idE = monetaId.getEmissione();
                    MMoneta op = new MMoneta(moneta, idM, idE);
                    this.OPDF.put(op);
                    this.SEL.applicaOp(op);
                    MM.ok();
                    this.AC.cambiaVisualizzato(this.VIS.visualizza(this.getMv(), this.SEL.get()));
                    break;}
                case IMPORTA_M:{break;}
                case MODIFICARE_M:{break;}
                case ELIMINARE_M:{break;}
            }
	}
	
	public void modM(ModificareM MM,Id idM){
            switch(mystate){
                case C_APERTO:{
                    this.mystate = MODIFICARE_M;
                    ModalitaVisualizzazione modVis= new ModalitaVisualizzazione();
                    modVis.SchedaC(OggettoDaMostrare.Monete);
                    MM.showM(this.VIS.visualizza(modVis,this.SEL.infoCompletaM(idM)));
                    break;}
                case INSERIRE_M:{break;}
                case IMPORTA_M:{break;}
                case MODIFICARE_M:{break;}
                case ELIMINARE_M:{break;}
            }
	}
	
	public void ricercaMonete(CriterioRicerca crit){
            switch(mystate){
                case C_APERTO:{
                    /*?????*/
                    this.SEL.set(this.INFO.ricercaMonete(crit));
                    this.AC.cambiaVisualizzato(this.VIS.visualizza(this.getMv(),this.SEL.get()));
                    break;}
                case INSERIRE_M:{break;}
                case IMPORTA_M:{break;}
                case MODIFICARE_M:{break;}
                case ELIMINARE_M:{break;}
            }
	}
        

    /** GET/SET **/    
    public AccedereCollezione getAC() {
        return AC;
    }
    public Info getMon() {
        return mon;
    }
    public Operazione getOp() {
        return op;
    }
    public void setAC(AccedereCollezione AC) {
        this.AC = AC;
    }
    public void setMon(Info mon) {
        this.mon = mon;
    }
    public void setOp(Operazione op) {
        this.op = op;
    }

}
