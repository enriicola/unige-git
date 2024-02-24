package easycoin.temporary_store;

import easycoin.datatype.*;
import easycoin.datatype.operazione.*;
import java.util.Hashtable;
import easycoin.store.*;
import java.util.*;

public class ParteSelezionata {
	 // Insert into
	private Info parteSel=new Info();
        
	//<<create>> mkSel()
	public ParteSelezionata(){}
	
public void applicaOp(Operazione op){
        
        if(op instanceof IEnte){
            IEnte IE;
            IE=(IEnte)op;
            this.parteSel.inserisciEE(IE.getId(),IE.getEnte(),IE.getZecche(),IE.getUnita(),IE.getSistemiMonetari());
            
            
        }else if(op instanceof ITipo){
            ITipo IT;
            IT=(ITipo)op;
            this.parteSel.inserisciTM(IT.getTipo(),IT.getEnte(),IT.getUnita(),IT.getId());            
        }
        else if(op instanceof IMoneta){
            IMoneta IM;
            IM=(IMoneta)op;
            this.parteSel.inserisciM(IM.getMoneta(),IM.getEmissione(),IM.getId());
        }
         else if(op instanceof IEmissione){
            IEmissione IE;
            IE=(IEmissione)op;
            this.parteSel.inserisciE(IE.getEmissione(),IE.getTipo(),IE.getZecca(),IE.getId());
         
        }
        
        else if(op instanceof IZecca){
            IZecca IZ;
            IZ=(IZecca)op;
            this.parteSel.inserisciZ(IZ.getId(),IZ.getZ(),IZ.getEnte());
         
        }
        else if(op instanceof ISistemaMonetario){
            ISistemaMonetario IS;
            IS=(ISistemaMonetario)op;
            this.parteSel.inserisciSM(IS.getId(),IS.getSm(),IS.getEE());
            
        }
        else if(op instanceof IUnita){
            IUnita IU;
            IU=(IUnita)op;
            this.parteSel.inserisciU(IU.getId(),IU.getUnita(),IU.getSm());
            
        }
         
        else if(op instanceof MEnte){
            MEnte ME;
            ME=(MEnte)op;
            this.parteSel.modificaEE(ME.getE(),ME.getZecche(),ME.getSistemiMonetari(),ME.getUnita(),ME.getId());
        }
        else if(op instanceof MTipo){
            MTipo MT;
            MT=(MTipo)op;
            this.parteSel.modificaTM(MT.getTipo(),MT.getEE(),MT.getU(),MT.getId());
         
        }
        else if(op instanceof MEmissione){
            MEmissione ME;
            ME=(MEmissione)op; 
            this.parteSel.modificaiE(ME.getEmissione(),ME.getIdT(),ME.getIdZ(),ME.getId());
        }
        else if(op instanceof MMoneta){
            MMoneta MM;
            MM=(MMoneta)op;
            this.parteSel.modificaM(MM.getMoneta(),MM.getIdE(),MM.getIdM());
            
        }else if(op instanceof MZecca){
            MZecca MZ;
            MZ=(MZecca)op;
            this.parteSel.modificaZ(MZ.getId(),MZ.getZ(),MZ.getEnte());
        }
        else if(op instanceof MSistemaMonetario){
            MSistemaMonetario MSM;
            MSM=(MSistemaMonetario)op;
            this.parteSel.modificaSM(MSM.getId(),MSM.getSm(),MSM.getEE());
        }
        else if(op instanceof MUnita){
             MUnita MU;
            MU=(MUnita)op;
            this.parteSel.modificaU(MU.getId(),MU.getUnita(),MU.getSm());
        }
        
        else if(op instanceof EEnte){
            EEnte EE;
            EE=(EEnte)op;
            this.parteSel.eliminaEE(EE.getId());            
        }         
        else if(op instanceof ETipo){
            ETipo ET;
            ET=(ETipo)op;
            this.parteSel.eliminaTM(ET.getId());
        }
        
         else if(op instanceof EMoneta){
            EMoneta EM;
            EM=(EMoneta)op;
            this.parteSel.eliminaM(EM.getId());
        }
        
         else if(op instanceof EEmissione){
            EEmissione EE;
            EE=(EEmissione)op;
            this.parteSel.eliminaE(EE.getId());   
        }
         else if(op instanceof EZecca){
             EZecca EZ;
             EZ=(EZecca)op;
            this.parteSel.eliminaZ(EZ.getId());
        }
         else if(op instanceof ESistemaMonetario){
             ESistemaMonetario ESM;
             ESM=(ESistemaMonetario)op;
            this.parteSel.eliminaSM(ESM.getId());
        }
         else if(op instanceof EUnita){
             EUnita EU;
             EU=(EUnita)op;
            this.parteSel.eliminaU(EU.getId());
        }
        
         else if(op instanceof Aggiungi){
            
        }
        
    }    
    
        
        
        
        public Info get(){return this.parteSel;}
        
        public void set(Info parteSel){this.parteSel = parteSel;}
        
        @SuppressWarnings("unchecked")
	public Hashtable dammiSistemaMonetario(Id idEE){
     
           Hashtable sm=new Hashtable();
           for(Enumeration s = parteSel.getSistemaMonetarioH().elements(); s.hasMoreElements(); ){
                  SistemaMonetario o = (SistemaMonetario)s.nextElement();
                  if(o.getEnteEmettitore().getId()==idEE.getId()){
                     sm.put(o.getId().getId(),o);
                    
                  }
           }
           return sm;
         
        }
        @SuppressWarnings("unchecked")
        public Hashtable dammiZecche(Id idEE){
     
           Hashtable zecche=new Hashtable();
           for(Enumeration s = parteSel.getZeccaH().elements(); s.hasMoreElements(); ){
                  Zecca o = (Zecca)s.nextElement();
                  if(o.getEnteEmettitore().getId()==idEE.getId()){
                     zecche.put(o.getId().getId(),o);
                    
                  }
           }
           return zecche;
         
        }
            
        @SuppressWarnings("unchecked")
	public Hashtable dammiUnita(Id idSm){
    
           Hashtable unita=new Hashtable();
           for(Enumeration u = parteSel.getUnitaH().elements(); u.hasMoreElements(); ){
                  Unita o = (Unita)u.nextElement();
                  if(o.getSistemaMonetario().getId()==idSm.getId()){
                     unita.put(o.getId().getId(),o);
                     
                  }
           }
           return unita;
        }

	
	
        @SuppressWarnings("unchecked")
	public Info infoCompletaE(Id idE){        
                 Info i=new Info();
                 Hashtable emissione=new Hashtable();
                 Hashtable monete=new Hashtable();
                 Hashtable tipo=new Hashtable();
                 Hashtable ente= new Hashtable(); 
                 Hashtable zecca=new Hashtable();
                 Hashtable sistemamonetario=new Hashtable();
                 Hashtable unita=new Hashtable();
                 Hashtable aux=new Hashtable();
                 
                 for(Enumeration m=this.parteSel.getMonetaH().elements();m.hasMoreElements();){
                     Moneta o = (Moneta)m.nextElement();
                     if(o.getEmissione().getId()==idE.getId()){
                     monete.put(o.getId(),o);
                     }
                   }
                 emissione.put(idE.getId(),this.parteSel.getEmissioneH().get(idE.getId()));
                 Tipo t=(Tipo)this.parteSel.getTipoH().get(((Emissione)(this.parteSel.getEmissioneH().get(idE.getId()))).getTipo().getId());
                 tipo.put(t.getId().getId(), t);
                 EnteEmettitore ee=(EnteEmettitore)this.parteSel.getEnteEmettitoreH().get(t.getEnteEmettitore().getId());
             	 ente.put(ee.getId().getId(), ee);
             	 zecca=this.dammiZecche(ee.getId());
             	 sistemamonetario=this.dammiSistemaMonetario(ee.getId());
             	 for(Enumeration ss=sistemamonetario.elements();ss.hasMoreElements();){
                    SistemaMonetario ssm=(SistemaMonetario)ss.nextElement();
                    aux=this.dammiUnita(ssm.getId());
                    for(Enumeration ax=aux.elements();ax.hasMoreElements();){
                          Unita aa=(Unita)ax.nextElement();
                          unita.put(aa.getId().getId(),aa);                            
                    }
                    aux.clear();                    
                }
                 i.setEmissioneH(emissione);
                 i.setMonetaH(monete);
                 i.setEnteEmettitoreH(ente);
                 i.setSistemaMonetarioH(sistemamonetario);
                 i.setTipoH(tipo);
                 i.setUnitaH(unita);
                 i.setZeccaH(zecca);
                 return i;
        }
        
        @SuppressWarnings("unchecked")
	public Info infoCompletaEE(Id idEE){
                 Info i=new Info();
                 Hashtable monete=new Hashtable();
                 Hashtable enteemettitore=new Hashtable();
                 Hashtable emissioni=new Hashtable();
                 Hashtable tipo=new Hashtable();
                 
                  Hashtable zecca=new Hashtable();
                  Hashtable sistemamonetario=new Hashtable();
                  Hashtable unita=new Hashtable();
                  Hashtable aux=new Hashtable();
                 
                 for(Enumeration tm=this.parteSel.getTipoH().elements();tm.hasMoreElements();){
                     Tipo o = (Tipo)tm.nextElement();
                     if(o.getEnteEmettitore().getId()==idEE.getId()){
                        tipo.put(o.getId().getId(),o);
                         for(Enumeration e=this.parteSel.getEmissioneH().elements();e.hasMoreElements();){
                            Emissione em = (Emissione)e.nextElement();
                            if(em.getTipo().getId()==o.getId().getId()){
                                emissioni.put(em.getId().getId(),em);
                                 for(Enumeration mon=this.parteSel.getMonetaH().elements();mon.hasMoreElements();){
                                    Moneta moneta = (Moneta)mon.nextElement();
                                    if(moneta.getEmissione().getId()==em.getId().getId()){
                                        monete.put(moneta.getId().getId(),moneta);
                                    }
                                }
                            }
                        }
                     }
                 }
                  zecca=this.dammiZecche(idEE);
                  sistemamonetario=this.dammiSistemaMonetario(idEE);
                  for(Enumeration ss=sistemamonetario.elements();ss.hasMoreElements();){
                      SistemaMonetario ssm=(SistemaMonetario)ss.nextElement();
                      aux=this.dammiUnita(ssm.getId());
                      for(Enumeration ax=aux.elements();ax.hasMoreElements();){
                            Unita aa=(Unita)ax.nextElement();
                            unita.put(aa.getId().getId(),aa);                            
                      }
                      aux.clear();                    
                  }
                 
                  
                     enteemettitore.put(idEE.getId(),this.parteSel.getEnteEmettitoreH().get(idEE.getId()));
                     
                     i.setTipoH(tipo);
                     i.setEmissioneH(emissioni);
                     i.setMonetaH(monete);
                     i.setEnteEmettitoreH(enteemettitore);
                     i.setZeccaH(zecca);
                     i.setSistemaMonetarioH(sistemamonetario);
                     i.setUnitaH(unita);
               
                 return i;
                      
                  }
       
        @SuppressWarnings("unchecked")
	public Info infoCompletaM(Id idM){
            Info i=new Info();
            Hashtable emissione=new Hashtable();
            Hashtable monete=new Hashtable();
            Hashtable tipo=new Hashtable();
            Hashtable ente= new Hashtable(); 
            Hashtable zecca=new Hashtable();
            Hashtable sistemamonetario=new Hashtable();
            Hashtable unita=new Hashtable();
            Hashtable aux=new Hashtable();
            
            Moneta m=(Moneta)this.parteSel.getMonetaH().get(idM.getId());
            monete.put(m.getId().getId(), m);
            Emissione e=(Emissione)this.parteSel.getEmissioneH().get(m.getEmissione().getId());
            emissione.put(e.getId().getId(),e);
            Tipo t=(Tipo)this.parteSel.getTipoH().get(e.getTipo().getId());
            tipo.put(t.getId().getId(), t);
            EnteEmettitore ee=(EnteEmettitore)this.parteSel.getEnteEmettitoreH().get(t.getEnteEmettitore().getId());
        	 ente.put(ee.getId().getId(), ee);
        	 zecca=this.dammiZecche(ee.getId());
        	 sistemamonetario=this.dammiSistemaMonetario(ee.getId());
        	 for(Enumeration ss=sistemamonetario.elements();ss.hasMoreElements();){
               SistemaMonetario ssm=(SistemaMonetario)ss.nextElement();
               aux=this.dammiUnita(ssm.getId());
               for(Enumeration ax=aux.elements();ax.hasMoreElements();){
                     Unita aa=(Unita)ax.nextElement();
                     unita.put(aa.getId().getId(),aa);                            
               }
               aux.clear();                    
           }
            i.setEmissioneH(emissione);
            i.setMonetaH(monete);
            i.setEnteEmettitoreH(ente);
            i.setSistemaMonetarioH(sistemamonetario);
            i.setTipoH(tipo);
            i.setUnitaH(unita);
            i.setZeccaH(zecca);
            return i;
        }
        
        @SuppressWarnings("unchecked")
	public Info infoCompletaTM(Id idTM){
                 Info i=new Info();
                 Hashtable monete=new Hashtable();
                 Hashtable emissioni=new Hashtable();
                 Hashtable tipo=new Hashtable();
                 Hashtable ente= new Hashtable(); 
                 Hashtable zecca=new Hashtable();
                 Hashtable sistemamonetario=new Hashtable();
                 Hashtable unita=new Hashtable();
                 Hashtable aux=new Hashtable();
                 for(Enumeration t=this.parteSel.getEmissioneH().elements();t.hasMoreElements();){
                     Emissione o = (Emissione)t.nextElement();
                     if(o.getTipo().getId()==idTM.getId()){
                        emissioni.put(o.getId().getId(),o);
                         for(Enumeration m=this.parteSel.getMonetaH().elements();m.hasMoreElements();){
                            Moneta mm = (Moneta)m.nextElement();
                            if(mm.getEmissione().getId()==o.getId().getId()){
                                monete.put(mm.getId().getId(),mm);
                            }
                        }
                     }
                 }
                 	 EnteEmettitore ee=(EnteEmettitore)this.parteSel.getEnteEmettitoreH().get(((Tipo)this.parteSel.getTipoH().get(idTM.getId())).getEnteEmettitore().getId());
                 	 ente.put(ee.getId().getId(), ee);
                 	zecca=this.dammiZecche(ee.getId());
                    sistemamonetario=this.dammiSistemaMonetario(ee.getId());
                    for(Enumeration ss=sistemamonetario.elements();ss.hasMoreElements();){
                        SistemaMonetario ssm=(SistemaMonetario)ss.nextElement();
                        aux=this.dammiUnita(ssm.getId());
                        for(Enumeration ax=aux.elements();ax.hasMoreElements();){
                              Unita aa=(Unita)ax.nextElement();
                              unita.put(aa.getId().getId(),aa);                            
                        }
                        aux.clear();                    
                    }
                     Tipo tt=(Tipo)this.parteSel.getTipoH().get(idTM.getId());
                     tipo.put(idTM,tt);
                     i.setTipoH(tipo);
                     i.setEmissioneH(emissioni);
                     i.setEnteEmettitoreH(ente);
                     i.setZeccaH(zecca);
                     i.setSistemaMonetarioH(sistemamonetario);
                     i.setUnitaH(unita);
                     i.setMonetaH(monete);
                 return i;
             }
}   
