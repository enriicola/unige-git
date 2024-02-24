package easycoin.executor;

import easycoin.temporary_store.*;
import easycoin.datatype.criterio.*;
import easycoin.datatype.operazione.*;
import easycoin.datatype.*;
import easycoin.calculator.*;
import easycoin.store.*;
import easycoin.boundary.DriverFileSystem;
import java.util.Enumeration;
import java.util.Hashtable;

public class Gestore {
    
    
    private CriterioRicerca critCorrente;
    private ModalitaVisualizzazione mv;
    private Id id;
    
    /*Aggiunti poiche' il costruttore deve salvare questi dati*/
    protected ParteSelezionata SEL;
    protected OperazioniDaFare OPDF; 
    protected PreferenzeStore PREF; 
    protected Visualizza VIS; 
    protected InfoStore INFO;
    protected GestireCollezione GE;
    protected GestireEasyCatalogo GEC;
    protected DriverFileSystem DFS;
    
    /*Gestione Stato*/
    protected int mystate;
    //stati GestireEasyCatalogo
    protected static final int EC_APERTO = 0;
    protected static final int INSERIRE_TM = 1;
    protected static final int INSERISCI_E = 2;
    protected static final int INSERISCI_EE = 3;
    protected static final int MODIFICARE_TM = 4;
    protected static final int MODIFICARE_E = 5;
    protected static final int MODIFICARE_EE = 6;
    protected static final int ELIMINARE_TM = 7;
    protected static final int ELIMINARE_EE = 8;
    protected static final int ELIMINARE_E = 9;
    protected static final int ATTENDI_CONTENUTO_FILE = 10;
    protected static final int IMPORTARE_EASYCATALOGO = 11;
    //stati GestireCollezione
    protected static final int C_APERTO = 12;
    protected static final int INSERIRE_M = 13;
    protected static final int IMPORTA_M = 14;
    protected static final int MODIFICARE_M = 15;
    protected static final int ELIMINARE_M = 16;
    
    
    /** COSTRUTTORE **/
    /* <<create>>*/
    public Gestore(ParteSelezionata SEL,OperazioniDaFare o, PreferenzeStore p, Visualizza v, InfoStore i){
        this.SEL = SEL;
        this.OPDF = o;
        this.PREF = p ;
        this.INFO = i;
        this.VIS = v;
    }
 
    public Gestore(){}
 
    public void ko(){
        switch(mystate){
            case EC_APERTO:{break;} 
            case INSERIRE_TM:{mystate=EC_APERTO;break;}
            case INSERISCI_E:{mystate=EC_APERTO;break;} 
            case INSERISCI_EE:{mystate=EC_APERTO;break;}
            case MODIFICARE_TM:{mystate=EC_APERTO;break;}
            case MODIFICARE_E:{mystate=EC_APERTO;break;}
            case MODIFICARE_EE:{mystate=EC_APERTO;break;}
            case ELIMINARE_TM:{
                this.mystate = EC_APERTO;
                ((GestireEasyCatalogo)this).getAEC().cambiaVisualizzato(this.VIS.visualizza(this.getMv(),this.SEL.get()));
                break;
            }
            case ELIMINARE_EE:{
            	this.mystate=EC_APERTO;
                ((GestireEasyCatalogo)this).getAEC().cambiaVisualizzato(this.VIS.visualizza(this.getMv(),this.SEL.get()));
            	break;}
            case ELIMINARE_E:{
            	this.mystate=EC_APERTO;
                ((GestireEasyCatalogo)this).getAEC().cambiaVisualizzato(this.VIS.visualizza(this.getMv(),this.SEL.get()));
            	break;}
            case ATTENDI_CONTENUTO_FILE:{mystate=EC_APERTO;break;}
            case IMPORTARE_EASYCATALOGO:{mystate=EC_APERTO;break;}
            case C_APERTO:{break;}
            case INSERIRE_M:{mystate=C_APERTO;break;}
            case IMPORTA_M:{
            	mystate=C_APERTO;
                ((GestireCollezione)this).getAC().ko();
                break;}
            case MODIFICARE_M:{mystate=C_APERTO;break;}
            case ELIMINARE_M:{
                this.mystate = C_APERTO;
                ((GestireCollezione)this).getAC().ko();
                break;
            }
	}
    }
    
    /*<<auxiliar>>*/
    public PreferenzeStore prefCorrenti(){
        return this.PREF;
    }
    
    /*<<auxiliar>>*/
    public void sincronizzaStore(){
       // Info sincronize = this.SEL.get();
        Hashtable operazioni = this.OPDF.getAll();
        this.INFO.aggiorna(operazioni);
        this.OPDF.svuota();   
        //this.PREF.setModVis(mv);
    }
    
    /*<<auxiliar>>*/
    public Id generaId(){
        if(this.SEL.get().getId()==null){
            Id newId =new Id(0);
            this.SEL.get().setId(newId);
            return newId;
        }else{
            Id newId =new Id(this.SEL.get().getId().getId()+1);
            this.SEL.get().setId(newId);
            return newId;
        }
    }
    
    public void ok(){
        
        switch(mystate){
            case EC_APERTO:{break;} 
            case INSERIRE_TM:{break;}
            case INSERISCI_E:{break;} 
            case INSERISCI_EE:{break;}
            case MODIFICARE_TM:{break;}
            case MODIFICARE_E:{break;}
            case MODIFICARE_EE:{break;}
            case ELIMINARE_TM:{
                this.mystate = EC_APERTO;
                ETipo tt = new ETipo(this.id);
                this.OPDF.put(tt);
                this.SEL.applicaOp(tt);
                ((GestireEasyCatalogo)this).getAEC().cambiaVisualizzato(this.VIS.visualizza(this.mv,this.SEL.get()));
                break;
            }
            case ELIMINARE_EE:{
                this.mystate = EC_APERTO;
                EEnte ee = new EEnte(this.id);
                this.OPDF.put(ee);
                this.SEL.applicaOp(ee);
                ((GestireEasyCatalogo)this).getAEC().cambiaVisualizzato(this.VIS.visualizza(this.mv, this.SEL.get()));
                break;
            }
            case ELIMINARE_E:{
                this.mystate = EC_APERTO;
                EEmissione  ee = new EEmissione(this.id);
                //((GestireEasyCatalogo)this).setOp(ee);
                this.OPDF.put(ee);
                this.SEL.applicaOp(ee);
                ((GestireEasyCatalogo)this).getAEC().cambiaVisualizzato(this.VIS.visualizza(this.mv,this.SEL.get()));
                break;
            }
            case ATTENDI_CONTENUTO_FILE:{break;}
            case IMPORTARE_EASYCATALOGO:{
                this.mystate = EC_APERTO;
                importInfo(((GestireEasyCatalogo)this).getEc());
            	/*Aggiungi op=new Aggiungi(((GestireEasyCatalogo)this).getEc());
            	this.OPDF.put(op);
            	this.SEL.applicaOp(op);*/
            	((GestireEasyCatalogo)this).getAEC().fatto();
                this.sincronizzaStore();
            	break;}
            case C_APERTO:{break;}
            case INSERIRE_M:{break;}
            case IMPORTA_M:{
                this.mystate = C_APERTO;
                importInfoM(((GestireCollezione)this).getMon());
            	/*Aggiungi op=new Aggiungi(((GestireEasyCatalogo)this).getEc());
            	this.OPDF.put(op);
            	this.SEL.applicaOp(op);*/
            	((GestireCollezione)this).getAC().fatto();
                this.sincronizzaStore();
            	break;}
            case MODIFICARE_M:{break;}
            case ELIMINARE_M:{
                this.mystate = C_APERTO;
                EMoneta op = new EMoneta(this.id);
                this.OPDF.put(op);
                this.SEL.applicaOp(op);
                ((GestireCollezione)this).getAC().cambiaVisualizzato(this.VIS.visualizza(this.mv,this.SEL.get()));
                break;}
	}
        
    }
    
    public void cambiaModalita(){
    
        switch(mystate){
		case EC_APERTO:{
                    this.mystate = C_APERTO;
                    ((GestireEasyCatalogo)this).sincronizzaStore();
                    this.PREF.setModVis(((GestireEasyCatalogo)this).getMv());
                    GE = new GestireCollezione(this.SEL, this.OPDF, this.prefCorrenti(), this.VIS, this.INFO);
                    GE.getAC().setAC(((GestireEasyCatalogo)this).getAEC().getAEC());
                    break;
                } 
		case INSERIRE_TM:{break;}
		case INSERISCI_E:{break;} 
		case INSERISCI_EE:{break;}
		case MODIFICARE_TM:{break;}
		case MODIFICARE_E:{break;}
		case MODIFICARE_EE:{break;}
		case ELIMINARE_TM:{
                    break;
                }
        case ELIMINARE_EE:{break;}
        case ELIMINARE_E:{break;}
        case ATTENDI_CONTENUTO_FILE:{break;}
        case IMPORTARE_EASYCATALOGO:{break;}
        case C_APERTO:{
            this.mystate = EC_APERTO;
            ((GestireCollezione)this).sincronizzaStore();
            GEC = new GestireEasyCatalogo(this.SEL, this.OPDF, this.prefCorrenti(), this.VIS, this.INFO);
            GEC.getAEC().setAEC(((GestireCollezione)this).getAC().getAC());
            break;}
        case INSERIRE_M:{break;}
        case IMPORTA_M:{break;}
        case MODIFICARE_M:{break;}
        case ELIMINARE_M:{break;}
		}
        
    }
    
    public void setModalitaVisualizzazione(ModalitaVisualizzazione modalita){
    
        switch(mystate){
            case EC_APERTO:{
                this.mv = modalita;
                ((GestireEasyCatalogo)this).getAEC().cambiaVisualizzato(this.VIS.visualizza(this.mv,this.SEL.get()));
                break;
            } 
            case INSERIRE_TM:{break;}
            case INSERISCI_E:{break;} 
            case INSERISCI_EE:{break;}
            case MODIFICARE_TM:{break;}
            case MODIFICARE_E:{break;}
            case MODIFICARE_EE:{break;}
            case ELIMINARE_TM:{break;}
            case ELIMINARE_EE:{break;}
            case ELIMINARE_E:{break;}
            case ATTENDI_CONTENUTO_FILE:{break;}
            case IMPORTARE_EASYCATALOGO:{break;}
            case C_APERTO:{
            	this.mv = modalita;
                ((GestireCollezione)this).getAC().cambiaVisualizzato(this.VIS.visualizza(this.mv,this.SEL.get()));
            	break;}
            case INSERIRE_M:{break;}
            case IMPORTA_M:{break;}
            case MODIFICARE_M:{break;}
            case ELIMINARE_M:{break;}
		}
        
    }

    
    
    //Metodi set e get
    public CriterioRicerca getCritCorrente() {
            return critCorrente;
    }

    public void setCritCorrente(CriterioRicerca critCorrente) {
            this.critCorrente = critCorrente;
    }

    public InfoStore getINFO() {
            return INFO;
    }

    public void setINFO(InfoStore i) {
            this.INFO = i;
    }

    public ModalitaVisualizzazione getMv() {
            return mv;
    }

    public void setMv(ModalitaVisualizzazione mv) {
            this.mv = mv;
    }

    public OperazioniDaFare getOPDF() {
            return OPDF;
    }

    public void setOPDF(OperazioniDaFare o) {
            this.OPDF = o;
    }

    public PreferenzeStore getPREF() {
            return PREF;
    }

    public void setPREF(PreferenzeStore p) {
            this.PREF = p;
    }

    public ParteSelezionata getSEL() {
            return SEL;
    }

    public void setSEL(ParteSelezionata sel) {
            SEL = sel;
    }

    public Visualizza getVIS() {
            return VIS;
    }

    public void setVIS(Visualizza v) {
            this.VIS = v;
    }
       
    public Id getId() {
        return id;
    }

    public void setId(Id id) {
        this.id = id;
    }
    
    public DriverFileSystem getDFS() {
        return DFS;
    }

    public void setDFS(DriverFileSystem DFS) {
        this.DFS = DFS;
    }

    public GestireCollezione getGE() {
        return GE;
    }

    private void importInfo(Info info) {
        //inserire metodo di creazioni di operazioni
        
        Info dati=new Info();
        
        Id idEv=new Id();
        Id idEEv=new Id();
        Id idZv=new Id();
        Id idTv=new Id();
        @SuppressWarnings("unused")
		Id idMv=new Id();
        Id idSMv=new Id();
        Id idUv=new Id();
        
        Id idEn=new Id();
        Id idEEn=new Id();
        Id idZn=new Id();
        Id idTn=new Id();
        @SuppressWarnings("unused")
		Id idMn=new Id();
        Id idSMn=new Id();
        Id idUn=new Id();
        
        
        ParteSelezionata ps=new ParteSelezionata();
        ps.set(info);
        for (Enumeration enti = info.getEnteEmettitoreH().elements(); enti.hasMoreElements(); ){         
            EnteEmettitore EE = (EnteEmettitore)enti.nextElement();
            dati=ps.infoCompletaEE(EE.getId());
            
            ///Aggiorno id Ente
            idEEv=EE.getId();
            idEEn=this.generaId();
            EE.setId(idEEn);
            for(Enumeration zeccaEE = dati.getZeccaH().elements(); zeccaEE.hasMoreElements(); ){
                Zecca ZEE = (Zecca)zeccaEE.nextElement();
                if(ZEE.getEnteEmettitore().getId()==idEEv.getId()){
                    ZEE.setEnteEmettitore(idEEn);
                }
            }
             for(Enumeration TipoEE = dati.getTipoH().elements(); TipoEE.hasMoreElements(); ){
                Tipo TEE = (Tipo)TipoEE.nextElement();
                if(TEE.getEnteEmettitore().getId()==idEEv.getId()){
                    TEE.setEnteEmettitore(idEEn);
                }
            }
             for(Enumeration SistemaMEE = dati.getSistemaMonetarioH().elements(); SistemaMEE.hasMoreElements(); ){
                SistemaMonetario SMEE = (SistemaMonetario)SistemaMEE.nextElement();
                if(SMEE.getEnteEmettitore().getId()==idEEv.getId()){
                    SMEE.setEnteEmettitore(idEEn);
                    
                }
            }
            ///Aggiorno id Zecca
            for(Enumeration zeccaZ = dati.getZeccaH().elements(); zeccaZ.hasMoreElements(); ){
                Zecca ZZ = (Zecca)zeccaZ.nextElement();
                
                idZv=ZZ.getId();
                idZn=this.generaId();
                ZZ.setId(idZn);
                
                for(Enumeration EmissioneZ = dati.getEmissioneH().elements(); EmissioneZ.hasMoreElements(); ){
                    Emissione ZE = (Emissione)EmissioneZ.nextElement();
                    if(ZE.getZecca().getId()==idZv.getId()){
                        ZE.setZecca(idZn);

                    }
                }
                          
            }
            //Aggiorno Tipo
            for(Enumeration tipoT = dati.getTipoH().elements(); tipoT.hasMoreElements(); ){
                Tipo TT = (Tipo)tipoT.nextElement();
                
                idTv=TT.getId();
                idTn=this.generaId();
                TT.setId(idTn);
                
                for(Enumeration EmissioneT = dati.getEmissioneH().elements(); EmissioneT.hasMoreElements(); ){
                    Emissione TE = (Emissione)EmissioneT.nextElement();
                    if(TE.getTipo().getId()==idTv.getId()){
                        TE.setTipo(idTn);

                    }
                }                                      
            }
            //Aggiorno Emissione
            for(Enumeration EmissioneE = dati.getEmissioneH().elements(); EmissioneE.hasMoreElements(); ){
                Emissione EmE = (Emissione)EmissioneE.nextElement();
            
                idEv=EmE.getId();
                idEn=this.generaId();
                EmE.setId(idEn);
                
                for(Enumeration MonetaE = dati.getMonetaH().elements(); MonetaE.hasMoreElements(); ){
                    Moneta ME = (Moneta)MonetaE.nextElement();
                    if(ME.getEmissione().getId()==idEv.getId()){
                        ME.setEmissione(idEn);

                    }
                }     
                           
            }
            //Aggiorno Moneta
            /*
            for(Enumeration MonetaM = dati.getMonetaH().elements(); MonetaM.hasMoreElements(); ){
                Moneta MM = (Moneta)MonetaM.nextElement();
                
                idMv=MM.getId();
                idMn=this.generaId();
                MM.setId(idMn); 
            }
             */
            //AggiornoSistemaM
             for(Enumeration SistemaMSM = dati.getSistemaMonetarioH().elements(); SistemaMSM.hasMoreElements(); ){
                SistemaMonetario SMSM = (SistemaMonetario)SistemaMSM.nextElement();
                
                idSMv=SMSM.getId();
                idSMn=this.generaId();
                SMSM.setId(idSMn);
                
                for(Enumeration SistemaMU = dati.getUnitaH().elements(); SistemaMU.hasMoreElements(); ){
                     Unita SMU = (Unita)SistemaMU.nextElement();
                     if(SMU.getSistemaMonetario().getId()==idSMv.getId()){
                         SMU.setSistemaMonetario(idSMn);
                     }
                
                }
             }
            //Aggiorno Unita
            for(Enumeration UnitaU = dati.getUnitaH().elements(); UnitaU.hasMoreElements(); ){
                  Unita UU = (Unita)UnitaU.nextElement();
                  
                  idUv=UU.getId();
                  idUn=this.generaId();
                  UU.setId(idUn);
                  
                for(Enumeration TipoU = dati.getTipoH().elements(); TipoU.hasMoreElements(); ){
                     Tipo TU = (Tipo)TipoU.nextElement();
                     if(TU.getUnita().getId()==idUv.getId()){
                        TU.setUnita(idUn);
                     }
                 }
                }
           //CreazioneOperaioni
            
           IEnte IEE=new IEnte(EE.getId(),EE.getInfoEE(),dati.getZeccaH(),dati.getUnitaH(),dati.getSistemaMonetarioH());
           this.OPDF.put(IEE);
           this.SEL.applicaOp(IEE);
           this.sincronizzaStore();
           for(Enumeration inserireT = dati.getTipoH().elements(); inserireT.hasMoreElements(); ){
                Tipo ITU = (Tipo)inserireT.nextElement();
                ITipo IT=new ITipo(ITU.getId(),ITU.getEnteEmettitore(),ITU.getUnita(),ITU.getInfoTipoMoneta());
                this.OPDF.put(IT);
                this.SEL.applicaOp(IT);
                this.sincronizzaStore();
            }
           
            for(Enumeration inserireE = dati.getEmissioneH().elements(); inserireE.hasMoreElements(); ){
                 Emissione ITE = (Emissione)inserireE.nextElement();
                 IEmissione IE=new IEmissione(ITE.getId(),ITE.getTipo(),ITE.getZecca(),ITE.getInfoE());
                 this.OPDF.put(IE);
                 this.SEL.applicaOp(IE);
                 this.sincronizzaStore();
                 
            }
           
           /*
            for(Enumeration inserireM = dati.getMonetaH().elements(); inserireM.hasMoreElements(); ){
                    Moneta ITM = (Moneta)inserireM.nextElement();
                    IMoneta IM=new IMoneta(ITM.getId(),ITM.getEmissione(),ITM.getInfoM());
                    
                }
            **/
           dati=null;
           
           
                  
     }
                
                
            
    
}

    
        private void importInfoM(Info info) {
        //inserire metodo di creazioni di operazioni
        
        Info dati=new Info();
        
        Id idEv=new Id();
        Id idEEv=new Id();
        Id idZv=new Id();
        Id idTv=new Id();
        @SuppressWarnings("unused")
		Id idMv=new Id();
        Id idSMv=new Id();
        Id idUv=new Id();
        
        Id idEn=new Id();
        Id idEEn=new Id();
        Id idZn=new Id();
        Id idTn=new Id();
        Id idMn=new Id();
        Id idSMn=new Id();
        Id idUn=new Id();
        
        
        ParteSelezionata ps=new ParteSelezionata();
        ps.set(info);
        for (Enumeration enti = info.getEnteEmettitoreH().elements(); enti.hasMoreElements(); ){         
            EnteEmettitore EE = (EnteEmettitore)enti.nextElement();
            dati=ps.infoCompletaEE(EE.getId());
            
            ///Aggiorno id Ente
            idEEv=EE.getId();
            idEEn=this.generaId();
            EE.setId(idEEn);
            for(Enumeration zeccaEE = dati.getZeccaH().elements(); zeccaEE.hasMoreElements(); ){
                Zecca ZEE = (Zecca)zeccaEE.nextElement();
                if(ZEE.getEnteEmettitore().getId()==idEEv.getId()){
                    ZEE.setEnteEmettitore(idEEn);
                }
            }
             for(Enumeration TipoEE = dati.getTipoH().elements(); TipoEE.hasMoreElements(); ){
                Tipo TEE = (Tipo)TipoEE.nextElement();
                if(TEE.getEnteEmettitore().getId()==idEEv.getId()){
                    TEE.setEnteEmettitore(idEEn);
                }
            }
             for(Enumeration SistemaMEE = dati.getSistemaMonetarioH().elements(); SistemaMEE.hasMoreElements(); ){
                SistemaMonetario SMEE = (SistemaMonetario)SistemaMEE.nextElement();
                if(SMEE.getEnteEmettitore().getId()==idEEv.getId()){
                    SMEE.setEnteEmettitore(idEEn);
                    
                }
            }
            ///Aggiorno id Zecca
            for(Enumeration zeccaZ = dati.getZeccaH().elements(); zeccaZ.hasMoreElements(); ){
                Zecca ZZ = (Zecca)zeccaZ.nextElement();
                
                idZv=ZZ.getId();
                idZn=this.generaId();
                ZZ.setId(idZn);
                
                for(Enumeration EmissioneZ = dati.getEmissioneH().elements(); EmissioneZ.hasMoreElements(); ){
                    Emissione ZE = (Emissione)EmissioneZ.nextElement();
                    if(ZE.getZecca().getId()==idZv.getId()){
                        ZE.setZecca(idZn);

                    }
                }
                          
            }
            //Aggiorno Tipo
            for(Enumeration tipoT = dati.getTipoH().elements(); tipoT.hasMoreElements(); ){
                Tipo TT = (Tipo)tipoT.nextElement();
                
                idTv=TT.getId();
                idTn=this.generaId();
                TT.setId(idTn);
                
                for(Enumeration EmissioneT = dati.getEmissioneH().elements(); EmissioneT.hasMoreElements(); ){
                    Emissione TE = (Emissione)EmissioneT.nextElement();
                    if(TE.getTipo().getId()==idTv.getId()){
                        TE.setTipo(idTn);

                    }
                }                                      
            }
            //Aggiorno Emissione
            for(Enumeration EmissioneE = dati.getEmissioneH().elements(); EmissioneE.hasMoreElements(); ){
                Emissione EmE = (Emissione)EmissioneE.nextElement();
            
                idEv=EmE.getId();
                idEn=this.generaId();
                EmE.setId(idEn);
                
                for(Enumeration MonetaE = dati.getMonetaH().elements(); MonetaE.hasMoreElements(); ){
                    Moneta ME = (Moneta)MonetaE.nextElement();
                    if(ME.getEmissione().getId()==idEv.getId()){
                        ME.setEmissione(idEn);

                    }
                }     
                           
            }
            //Aggiorno Moneta
            
            for(Enumeration MonetaM = dati.getMonetaH().elements(); MonetaM.hasMoreElements(); ){
                Moneta MM = (Moneta)MonetaM.nextElement();
                
                idMv=MM.getId();
                idMn=this.generaId();
                MM.setId(idMn); 
            }
             
            //AggiornoSistemaM
             for(Enumeration SistemaMSM = dati.getSistemaMonetarioH().elements(); SistemaMSM.hasMoreElements(); ){
                SistemaMonetario SMSM = (SistemaMonetario)SistemaMSM.nextElement();
                
                idSMv=SMSM.getId();
                idSMn=this.generaId();
                SMSM.setId(idSMn);
                
                for(Enumeration SistemaMU = dati.getUnitaH().elements(); SistemaMU.hasMoreElements(); ){
                     Unita SMU = (Unita)SistemaMU.nextElement();
                     if(SMU.getSistemaMonetario().getId()==idSMv.getId()){
                         SMU.setSistemaMonetario(idSMn);
                     }
                
                }
             }
            //Aggiorno Unita
            for(Enumeration UnitaU = dati.getUnitaH().elements(); UnitaU.hasMoreElements(); ){
                  Unita UU = (Unita)UnitaU.nextElement();
                  
                  idUv=UU.getId();
                  idUn=this.generaId();
                  UU.setId(idUn);
                  
                for(Enumeration TipoU = dati.getTipoH().elements(); TipoU.hasMoreElements(); ){
                     Tipo TU = (Tipo)TipoU.nextElement();
                     if(TU.getUnita().getId()==idUv.getId()){
                        TU.setUnita(idUn);
                     }
                 }
                }
           //CreazioneOperaioni
            
           IEnte IEE=new IEnte(EE.getId(),EE.getInfoEE(),dati.getZeccaH(),dati.getUnitaH(),dati.getSistemaMonetarioH());
           this.OPDF.put(IEE);
           this.SEL.applicaOp(IEE);
           this.sincronizzaStore();
           for(Enumeration inserireT = dati.getTipoH().elements(); inserireT.hasMoreElements(); ){
                Tipo ITU = (Tipo)inserireT.nextElement();
                ITipo IT=new ITipo(ITU.getId(),ITU.getEnteEmettitore(),ITU.getUnita(),ITU.getInfoTipoMoneta());
                this.OPDF.put(IT);
                this.SEL.applicaOp(IT);
                this.sincronizzaStore();
            }
           
            for(Enumeration inserireE = dati.getEmissioneH().elements(); inserireE.hasMoreElements(); ){
                 Emissione ITE = (Emissione)inserireE.nextElement();
                 IEmissione IE=new IEmissione(ITE.getId(),ITE.getTipo(),ITE.getZecca(),ITE.getInfoE());
                 this.OPDF.put(IE);
                 this.SEL.applicaOp(IE);
                 this.sincronizzaStore();
                 
            }
           
           
            for(Enumeration inserireM = dati.getMonetaH().elements(); inserireM.hasMoreElements(); ){
                    Moneta ITM = (Moneta)inserireM.nextElement();
                    @SuppressWarnings("unused")
					IMoneta IM=new IMoneta(ITM.getId(),ITM.getEmissione(),ITM.getInfoM());
                    this.sincronizzaStore();
                    
                }
            
           dati=null;
           
           
                  
     }
                
                
            
    
}
}
