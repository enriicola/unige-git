package easycoin.executor;

import easycoin.store.*;
import easycoin.temporary_store.*;
import easycoin.calculator.*;
import easycoin.datatype.*;
import easycoin.datatype.operazione.*;
import easycoin.datatype.criterio.*;
import easycoin.boundary.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.Enumeration;
import java.util.Hashtable;
import easycoin.enumeration.*;

public class GestireEasyCatalogo extends Gestore {
    
    private Info ec;
    private Operazione op;
    private Info v;
    
    
    /*Gestione Link*/
    private AccedereEasyCatalogo AEC;
    private Esportatore ESPEC;
    private Importatore IMPEC;
    
    /**<<create>>**/
    public GestireEasyCatalogo(ParteSelezionata SEL, OperazioniDaFare OPDF, PreferenzeStore PREF, Visualizza VIS, InfoStore INFO) {
		super(SEL, OPDF, PREF, VIS, INFO);
				mystate =EC_APERTO;
                this.setMv(PREF.getModVis());
                	//modificato
                	this.setCritCorrente(null);
                	//this.setCritCorrente(PREF.getCriterio());
                this.v = INFO.ricercaEC(this.getCritCorrente());
                	//modificato
                	this.setCritCorrente(PREF.getCriterio());
                	SEL.set(v);
                this.AEC = new AccedereEasyCatalogo(this,this.getMv(),this.v);
                
	}
    
    //FATTO
    public void eliminaE(Id id){
        switch(mystate){
            case EC_APERTO:{
                this.mystate = ELIMINARE_E;
                this.setId(id);
                ModalitaVisualizzazione modVis= new ModalitaVisualizzazione();
                modVis.setMostra(OggettoDaMostrare.Emissioni);
                modVis.setConcisione(Concisione.completa);
                modVis.setFormato(Formato.schede);
                this.AEC.cambiaVisualizzato(this.VIS.visualizza(modVis,this.SEL.infoCompletaE(id)));
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
		}
    }
    
    //FATTO
    public void eliminaEE(Id id){
        switch(mystate){
            case EC_APERTO:{
                this.mystate = ELIMINARE_EE;
                this.setId(id);
                ModalitaVisualizzazione modVis= new ModalitaVisualizzazione();
                modVis.setMostra(OggettoDaMostrare.Enti_Emettitori);
                modVis.setConcisione(Concisione.completa);
                modVis.setFormato(Formato.schede);
                this.AEC.cambiaVisualizzato(this.VIS.visualizza(modVis,this.SEL.infoCompletaEE(id)));
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
		}
    }
    
    //FATTO
    public void eliminaTM(Id id){
        switch(mystate){
            case EC_APERTO:{
                this.mystate = ELIMINARE_TM;
                this.setId(id);
                ModalitaVisualizzazione modVis= new ModalitaVisualizzazione();
                modVis.setMostra(OggettoDaMostrare.Tipi_Monete);
                modVis.setConcisione(Concisione.completa);
                modVis.setFormato(Formato.schede);
                this.AEC.cambiaVisualizzato(this.VIS.visualizza(modVis,this.SEL.infoCompletaTM(id)));
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
	}
    }
    
public void esportaEC(FilePath f){
        
        switch(mystate){
            case EC_APERTO:{
            	if(f.tipo().toString().equals("pdf")){
            		this.ESPEC=new EsportatorePDF();
            		((EsportatorePDF)(ESPEC)).generaPdfEC(v, f.getPath());
            		this.AEC.fatto();
                    break;
            		}
            	if(f.tipo().toString().equals("html")){
            		this.ESPEC=new EsportatoreHTML();
            		((EsportatoreHTML)(ESPEC)).generaHtml(v,f.getPath());
            		this.AEC.fatto();
                    break;
            	}
            	if(f.tipo().toString().equals("ec")){
            		this.ESPEC=new EsportatoreEC();
					String result=((EsportatoreEC)(ESPEC)).generaXmlEC(v);
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
                    
                        
					this.AEC.fatto();
					break;
            	}
            	if(f.tipo().toString().equals("txt")){
            		this.ESPEC=new EsportatoreTesto();
            		((EsportatoreTesto)(ESPEC)).EsportaTxTEC(v,f.getPath());
            		this.AEC.fatto();
                    break;
            	}
            	//ESPEC.generaXml(ec);
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
		}
        
    }
    
    public void importaEC(FilePath f){
        
        switch(mystate){
            case EC_APERTO:{
                this.mystate = IMPORTARE_EASYCATALOGO;
                this.IMPEC = new Importatore();
                this.ec = this.IMPEC.importaEC(f.getPath());
                this.AEC.importareEC(this.ec);
                break;} 
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
		}
        
    }
    
    @SuppressWarnings("unchecked")
	public void insE(InserireE IE,Id idTM){
        switch(mystate){
            case EC_APERTO:{
                this.mystate = INSERISCI_E;                
                Hashtable zz=new Hashtable();
                Hashtable tipi=v.getTipoH();
                Hashtable zecca=new Hashtable();
                Tipo tipo;
                try{
                for (Enumeration i = tipi.elements(); i.hasMoreElements();){
                	tipo=(Tipo)i.nextElement();
					if (tipo.getId().getId()== idTM.getId()){
						zecca=SEL.dammiZecche(tipo.getEnteEmettitore());
						for (Enumeration iu = zecca.elements(); iu.hasMoreElements();){
							Zecca u=(Zecca)iu.nextElement();
							zz.put(u.getId(), u);
						}
					}
                }
                if (zz.isEmpty()){mystate=EC_APERTO; IE.ko();}
                else IE.showZ(zz);
                }catch(java.lang.NullPointerException ex){ mystate=EC_APERTO; IE.ko();}
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
		}
    }
    
    public void inserisciE(InserireE IE,Id idTipo,Id idZ,InfoEmissione em){
        switch(mystate){
            case EC_APERTO:{break;} 
            case INSERIRE_TM:{break;}
            case INSERISCI_E:{
                this.mystate = EC_APERTO;
                Id idE=this.generaId();
                IEmissione ie= new IEmissione(idE, idTipo, idZ, em);
                this.OPDF.put(ie);
                this.SEL.applicaOp(ie);
                IE.ok();
                this.AEC.cambiaVisualizzato(this.VIS.visualizza(this.getMv(), this.SEL.get()));
                break;
            } 
            case INSERISCI_EE:{break;}
            case MODIFICARE_TM:{break;}
            case MODIFICARE_E:{break;}
            case MODIFICARE_EE:{break;}
            case ELIMINARE_TM:{break;}
            case ELIMINARE_EE:{break;}
            case ELIMINARE_E:{break;}
            case ATTENDI_CONTENUTO_FILE:{break;}
            case IMPORTARE_EASYCATALOGO:{break;}
		}
    }
    
    @SuppressWarnings("unchecked")
    public void inserisciEE(InserireEE IE,InfoEnteEmettitore e,Hashtable z,Hashtable s,Hashtable u){
        switch(mystate){
            case EC_APERTO:{
                Id idEE = generaId();
                Hashtable zeccheH=new Hashtable();
                Hashtable sistemaMH=new Hashtable();
                Hashtable unitaH=new Hashtable();

                for(Enumeration zecche = z.elements(); zecche.hasMoreElements();){
                	InfoZecca iz=(InfoZecca)zecche.nextElement();
                    Id idZ = generaId();
                    Zecca zecca=new Zecca(iz,idZ,idEE);
                    zeccheH.put(idZ,zecca);
                }
                int k=0;
                for(Enumeration sistemaM = s.elements(); sistemaM.hasMoreElements();){
                    InfoSistemaMonetario is= (InfoSistemaMonetario)sistemaM.nextElement();
                    Id idSM = generaId();
                    for(Enumeration unita = u.elements(); unita.hasMoreElements();){
                        Unita iu = (Unita)unita.nextElement();
                        if(iu.getSistemaMonetario().getId()==k){
                             Id idU = generaId();
                             iu.setId(idU);
                             iu.setSistemaMonetario(idSM);
                             unitaH.put(idU,iu);
                        }  
                    }
                    k++;
                    SistemaMonetario sistemaMonetario=new SistemaMonetario(idSM,is,idEE);
                    sistemaMH.put(idSM,sistemaMonetario);
                }
                
                IEnte opEE = new IEnte(idEE, e, zeccheH, unitaH, sistemaMH);
                this.OPDF.put(opEE);
                this.SEL.applicaOp(opEE);
                this.v = this.SEL.get();
                IE.ok();
                this.AEC.cambiaVisualizzato(this.VIS.visualizza(this.getMv(), this.v));
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
		}
    }
    
    public void inserisciTM(InserireTM IT,Id idEE,InfoTipoMoneta tm,Id idU){
        switch(mystate){
            case EC_APERTO:{break;} 
            case INSERIRE_TM:{
            	this.mystate = EC_APERTO;
                Id idTM = this.generaId();
                ITipo opTM =new ITipo(idTM,idEE, idU, tm);
                this.getOPDF().put(opTM);
                this.SEL.applicaOp(opTM);
                this.v = this.SEL.get();
                IT.ok();
                this.AEC.cambiaVisualizzato(this.VIS.visualizza(this.getMv(), this.v));
                break;
            }
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
         }
    }
    
    @SuppressWarnings("unchecked")
    public void insTM(InserireTM IT,Id idEE){
        switch(mystate){
		case EC_APERTO:{
					mystate = INSERIRE_TM;
					Hashtable uu=new Hashtable();
					Hashtable unita=new Hashtable();
					Hashtable sm=v.getSistemaMonetarioH();
					SistemaMonetario sistema;
					try{
					for (Enumeration i = sm.elements(); i.hasMoreElements();){
						sistema=(SistemaMonetario)i.nextElement();
						if (sistema.getEnteEmettitore().getId()==idEE.getId()){
							unita=SEL.dammiUnita(sistema.getId());
							for (Enumeration iu = unita.elements(); iu.hasMoreElements();){
								Unita u=(Unita)iu.nextElement();
								uu.put(u.getId(), u);
							}
						}
					}
					if (uu.isEmpty()) {mystate=EC_APERTO; IT.ko();}
					else IT.showU(uu);
					}catch(java.lang.NullPointerException ex){ mystate=EC_APERTO; IT.ko();}
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

		}
    }
    
    public void modE(ModificareE ME,Id id){
    
    switch(mystate){
            case EC_APERTO:{
                this.mystate = MODIFICARE_E;
                this.setId(id);
                //ModalitaVisualizzazione modVis= new ModalitaVisualizzazione();
                //modVis.SchedaC(OggettoDaMostrare.Enti_Emettitori);
                ME.showEC(/*this.VIS.visualizza(modVis,*/this.SEL.infoCompletaE(id));
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

		}
        
    }
    
    public void modEE(ModificareEE MEE, Id id){
    
        switch(mystate){
            case EC_APERTO:{
                this.mystate = MODIFICARE_EE;
                this.setId(id);
                //ModalitaVisualizzazione modVis= new ModalitaVisualizzazione();
                //modVis.SchedaC(OggettoDaMostrare.Enti_Emettitori);
                MEE.showEC(/*this.VIS.visualizza(modVis,*/this.SEL.infoCompletaEE(id)/*)*/);
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

		}
        
    }
    
    public void modTM(ModificareTM MTM, Id id){
        switch(mystate){
            case EC_APERTO:{
                this.mystate = MODIFICARE_TM;
                this.setId(id);
                //ModalitaVisualizzazione modVis= new ModalitaVisualizzazione();
                //modVis.SchedaC(OggettoDaMostrare.Enti_Emettitori);
                MTM.showEC(/*this.VIS.visualizza(modVis,*/this.SEL.infoCompletaTM(id));
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

		}
        }
    
    public void modificaE(ModificareE ME,InfoEmissione em,Id idZ,Id id){
    
        switch(mystate){
            case EC_APERTO:{break;} 
            case INSERIRE_TM:{break;}
            case INSERISCI_E:{break;} 
            case INSERISCI_EE:{break;}
            case MODIFICARE_TM:{break;}
            case MODIFICARE_E:{
                this.mystate = EC_APERTO;
                //MEmissione(Id idT,Id idZ,InfoEmissione em,Id unita,Id id)
                Emissione emissione= (Emissione)this.SEL.get().getEmissioneH().get(id.getId());
                Tipo tipo = (Tipo)this.SEL.get().getTipoH().get(emissione.getTipo().getId());
                Unita unita = (Unita)this.SEL.get().getUnitaH().get(tipo.getUnita().getId());
                MEmissione me = new MEmissione(tipo.getId(), idZ, em, unita.getId(), id);
                this.OPDF.put(me);
                ME.ok();
                this.AEC.cambiaVisualizzato(this.VIS.visualizza(this.getMv(),this.SEL.get()));
                break;
            }
            case MODIFICARE_EE:{break;}
            case ELIMINARE_TM:{break;}
            case ELIMINARE_EE:{break;}
            case ELIMINARE_E:{break;}
            case ATTENDI_CONTENUTO_FILE:{break;}
            case IMPORTARE_EASYCATALOGO:{break;}
		}
        
    }
    
    
    public void modificaEE(ModificareEE MEE,InfoEnteEmettitore eem,Hashtable z,Hashtable s ,Hashtable u,Id id){
    
        switch(mystate){
            case EC_APERTO:{break;} 
            case INSERIRE_TM:{break;}
            case INSERISCI_E:{break;} 
            case INSERISCI_EE:{break;}
            case MODIFICARE_TM:{break;}
            case MODIFICARE_E:{break;}
            case MODIFICARE_EE:{
                this.mystate = EC_APERTO;
                //EnteEmettitore ente=(EnteEmettitore)this.SEL.get().getEnteEmettitoreH().get(id.getId());

               /* for(Enumeration zecche = z.keys(); zecche.hasMoreElements();){
                    Id idZ = generaId();
                    Zecca zecca=new Zecca((InfoZecca)z.get(zecche.nextElement()),idZ,idEE);
                    zeccheH.put(idZ,zecca);
                }
                
                for(int i=0;i<z.size();i++){
                	Id idZ = generaId();
                	IZecca opZ = new IZecca(z,idZ,idEE);
                	this.OPDF.put(opZ);
                	this.SEL.applicaOp(opZ);
                }
                for(int i=0;i<s.size();i++){
                	Id idSM = generaId();
                	ISistemaMonetario opSM = new ISistemaMonetario(s,idSM,idEE);
                	this.OPDF.put(opSM);
                	this.SEL.applicaOp(opSM);
                }
                */
   
                MEnte mee= new MEnte(eem,z,s,u,id);
                this.OPDF.put(mee);
                this.SEL.applicaOp(mee);
                MEE.ok();
                this.AEC.cambiaVisualizzato(this.VIS.visualizza(this.getMv(),this.SEL.get()));
                break;}
            case ELIMINARE_TM:{break;}
            case ELIMINARE_EE:{break;}
            case ELIMINARE_E:{break;}
            case ATTENDI_CONTENUTO_FILE:{break;}
            case IMPORTARE_EASYCATALOGO:{break;}
		}
        
    }
    
    public void modificaTM(ModificareTM MTM,InfoTipoMoneta mtm, Id id){
        switch(mystate){
		case EC_APERTO:{break;} 
		case INSERIRE_TM:{break;}
		case INSERISCI_E:{break;} 
		case INSERISCI_EE:{break;}
		case MODIFICARE_TM:{
					this.mystate = EC_APERTO;
                    Tipo tipo=(Tipo)this.SEL.get().getTipoH().get(id.getId());
                    MTipo op= new MTipo(mtm,id, tipo.getEnteEmettitore(),tipo.getUnita());
                    OPDF.put(op);
                    this.SEL.applicaOp(op);
                    MTM.ok();
                    AEC.cambiaVisualizzato(VIS.visualizza(((Gestore)this).getMv(), SEL.get()));
                    break;
                }
		case MODIFICARE_E:{break;}
		case MODIFICARE_EE:{break;}
		case ELIMINARE_TM:{break;}
        case ELIMINARE_EE:{break;}
        case ELIMINARE_E:{break;}
        case ATTENDI_CONTENUTO_FILE:{break;}
        case IMPORTARE_EASYCATALOGO:{break;}
        }
    }
    
    public void ricercaEc(CriterioRicerca c){
        switch(mystate){
            case EC_APERTO:{
                this.sincronizzaStore();
                this.prefCorrenti().setCriterio(c);
                this.v = this.getINFO().ricercaEC(c);
                //this.v = this.getINFO().ricercaEC(c);
                this.getSEL().set(this.v);
                System.out.println("Invio cambio visualizzato");
                AEC.cambiaVisualizzato(VIS.visualizza(((Gestore)this).getMv(), this.SEL.get()));
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
	}
    }


    
    
    //Metodi get e set
    public Info getEc() {
            return ec;
    }

    public void setEc(Info ec) {
            this.ec = ec;
    }

    public Operazione getOp() {
            return op;
    }

    public void setOp(Operazione op) {
            this.op = op;
    }

    public AccedereEasyCatalogo getAEC() {
            return AEC;
    }

    public void setAEC(AccedereEasyCatalogo aec) {
            AEC = aec;
    }

    public Esportatore getESPEC() {
            return ESPEC;
    }

    public void setESPEC(Esportatore espec) {
            ESPEC = espec;
    }

    public Importatore getIMPEC() {
            return IMPEC;
    }

    public void setIMPEC(Importatore impec) {
            IMPEC = impec;
    }

}
