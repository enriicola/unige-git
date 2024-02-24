package easycoin.store;

import java.util.*;
import easycoin.datatype.*;



public class Info {
    
    private Hashtable enteEmettitoreH= new Hashtable();
    private Hashtable zeccaH=new Hashtable();
    private Hashtable sistemaMonetarioH=new Hashtable();
    private Hashtable unitaH=new Hashtable();
    private Hashtable tipoH=new Hashtable();
    private Hashtable emissioneH=new Hashtable();
    private Hashtable monetaH=new Hashtable();
    private Id id;
     
  public  Info(){}
  
  
   
       
@SuppressWarnings("unchecked")
public void inserisciEE(Id id,InfoEnteEmettitore EE,Hashtable Zecca,Hashtable Unita,Hashtable SistemaMonetario){
       EnteEmettitore ee=new EnteEmettitore(id,EE);
       this.enteEmettitoreH.put(id.getId(),ee);
        for(Enumeration e = Zecca.elements(); e.hasMoreElements(); ){
                  Zecca o = (Zecca)e.nextElement();
                  Zecca z=new Zecca(o.getInfoZ(),o.getId(),id);
                  this.zeccaH.put(o.getId().getId(),z);
        }
        for(Enumeration e = SistemaMonetario.elements(); e.hasMoreElements(); ){
                  SistemaMonetario o = (SistemaMonetario)e.nextElement();
                  SistemaMonetario sm=new SistemaMonetario(o.getId(),o.getInfoSM(),id);
                  this.sistemaMonetarioH.put(o.getId().getId(),sm);
        }
         for(Enumeration e = Unita.elements(); e.hasMoreElements(); ){
                  Unita o = (Unita)e.nextElement();
                  Unita u=new Unita(o.getId(),o.getSistemaMonetario(),o.getInfoU());
                  this.unitaH.put(o.getId().getId(),u);
                  
        }

    }
    
   @SuppressWarnings("unchecked")
public void inserisciE(InfoEmissione IE, Id idT,Id idZ,Id id){
        Emissione E =new Emissione(id,idT,idZ,IE);
        this.emissioneH.put(id.getId(),E);
   }
       
   @SuppressWarnings("unchecked")
public void inserisciM(InfoMoneta IM, Id idE, Id id){
        Moneta M=new Moneta(id,IM,idE);
        this.monetaH.put(id.getId(),M);
    
    }
    
   @SuppressWarnings("unchecked")
public void inserisciTM(InfoTipoMoneta ITM, Id idEE,Id idU, Id id){
         Tipo T=new Tipo(id,idU,idEE,ITM);
         this.tipoH.put(id.getId(),T);
      
    }
   
   @SuppressWarnings("unchecked")
   public void inserisciU(Id idU,InfoUnita u,Id idSM){
       Unita U=new Unita(idU,idSM,u);
       this.unitaH.put(idU.getId(),U);
       
   }
   
   @SuppressWarnings("unchecked")
   public void inserisciZ(Id idz,InfoZecca iz,Id idee){
       Zecca Z=new Zecca(iz,idz,idee);
       this.zeccaH.put(idz.getId(),Z);
       
       
       
   }
   
   @SuppressWarnings("unchecked")
   public void inserisciSM(Id idSm,InfoSistemaMonetario ism,Id idee){
       SistemaMonetario SM=new SistemaMonetario(idSm,ism,idee);
       this.sistemaMonetarioH.put(idSm.getId(),SM);
       
   }
    
   @SuppressWarnings("unchecked")
   public void modificaU(Id idU,InfoUnita u,Id idSM){
        Unita unita=new Unita(idU,idSM,u);
        this.unitaH.remove(idU.getId());
        this.unitaH.put(idU.getId(),unita);
   }
   
   @SuppressWarnings("unchecked")
   public void modificaSM(Id idSm,InfoSistemaMonetario ism,Id idee){
        SistemaMonetario sm=new SistemaMonetario(idSm,ism,idee);
        this.sistemaMonetarioH.remove(idSm.getId());
        this.sistemaMonetarioH.put(idSm,sm);
   }
   
   @SuppressWarnings("unchecked")
   public void modificaZ(Id idz,InfoZecca iz,Id idee){
      Zecca z=new Zecca(iz,idz,idee);
      this.zeccaH.remove(idz.getId());
      this.zeccaH.put(idz.getId(),z);
   }
   
   @SuppressWarnings("unchecked")
     public void modificaiE(InfoEmissione IE, Id idT,Id idZ,Id id){
        Emissione em=new Emissione(id,idT,idZ,IE);
        this.emissioneH.remove(id.getId());
        this.emissioneH.put(id.getId(),em);
   }
   
   @SuppressWarnings("unchecked")
   public void modificaM(InfoMoneta IM, Id idE, Id id){
       Moneta m=new Moneta(id,IM,idE);
       this.monetaH.remove(id.getId());
       this.monetaH.put(id.getId(),m);
       
    
    }
    
   @SuppressWarnings("unchecked")
   public void modificaTM(InfoTipoMoneta ITM, Id idEE,Id idU, Id id){
       Tipo tm=new Tipo(id,idU,idEE,ITM);
       this.tipoH.remove(id.getId());
       this.tipoH.put(id.getId(),tm);
         
      
    }
      @SuppressWarnings("unchecked")
	public void modificaEE(InfoEnteEmettitore EE,Hashtable Zecca, Hashtable SistemaMonetario,Hashtable Unita,Id id){
		  EnteEmettitore ee=new EnteEmettitore(id, EE);
		  this.enteEmettitoreH.remove(id.getId());
		  this.enteEmettitoreH.put(id.getId(),ee);
          
		  for (Enumeration zecca = Zecca.elements(); zecca.hasMoreElements(); )
		  {         
			  Zecca Z = (Zecca)zecca.nextElement();
			  this.zeccaH.remove(Z.getId().getId());
			  this.zeccaH.put(Z.getId().getId(),Z);
            
		  }
		  for(Enumeration e = SistemaMonetario.elements(); e.hasMoreElements(); )
		  {
			  SistemaMonetario o = (SistemaMonetario)e.nextElement();
			  this.sistemaMonetarioH.remove(o.getId().getId());
			  this.sistemaMonetarioH.put(o.getId().getId(),o);
                    
		  }
		  for(Enumeration e = Unita.elements(); e.hasMoreElements(); )
		  {
			  Unita o = (Unita)e.nextElement();
			  this.unitaH.remove(o.getId().getId());
			  this.unitaH.put(o.getId().getId(),o);
                  
                  
		  }
      
    }
    
       
    public void eliminaEE(Id idEE){
       this.enteEmettitoreH.remove(idEE.getId());
       
       for (Enumeration zecca = this.zeccaH.elements(); zecca.hasMoreElements(); ){         
            Zecca Z = (Zecca)zecca.nextElement();
            if(Z.getEnteEmettitore().getId()==idEE.getId()){
                this.eliminaZ(Z.getId());
            }
            
       }
        for (Enumeration sm = this.sistemaMonetarioH.elements(); sm.hasMoreElements(); ){         
            SistemaMonetario SM = (SistemaMonetario)sm.nextElement();
            if(SM.getEnteEmettitore().getId()==idEE.getId()){
                this.eliminaSM(SM.getId());              
                for (Enumeration u = this.unitaH.elements(); u.hasMoreElements(); ){         
                    Unita U = (Unita)u.nextElement();
                    if(U.getId().getId()==SM.getId().getId()){
                     this.eliminaU(U.getId());            
                    }
                } 
           }
        }
       for (Enumeration tipo = this.tipoH.elements(); tipo.hasMoreElements(); ){         
            Tipo T = (Tipo)tipo.nextElement();
            if(T.getEnteEmettitore().getId()==idEE.getId()){
                this.eliminaTM(T.getId());
            }
        
    }
    }
    
    public void eliminaE(Id idE){
         this.emissioneH.remove(idE.getId());
       
         for (Enumeration monete = this.monetaH.elements(); monete.hasMoreElements(); ){         
            Moneta M = (Moneta)monete.nextElement();
            if(M.getEmissione().getId()==idE.getId()){
                this.eliminaM(M.getId());
            }
         }
     
    }
    
    public void eliminaM(Id idM){
 
      this.monetaH.remove(idM.getId());
    }
    
    public void eliminaTM(Id idTM){
        this.tipoH.remove(idTM.getId());
       
         for (Enumeration emissioni = this.emissioneH.elements(); emissioni.hasMoreElements(); ){         
            Emissione E = (Emissione)emissioni.nextElement();
            if(E.getTipo().getId()==idTM.getId()){
                this.eliminaE(E.getId());
         }
   
    }
   }
    
    
    public void eliminaU(Id idU){
        this.unitaH.remove(idU.getId());
    }
    
    public void eliminaZ(Id idZ){
        this.zeccaH.remove(idZ.getId());
    }
    
    public void eliminaSM(Id idSm){
        this.sistemaMonetarioH.remove(idSm.getId());
    }
    
   
  
    
    public Hashtable getEmissioneH() {
        return emissioneH;
    }
    public Hashtable getEnteEmettitoreH() {
        return enteEmettitoreH;
    }
    public Hashtable getMonetaH() {
       return monetaH;
    }
    public Hashtable getSistemaMonetarioH() {
        return sistemaMonetarioH;
    }
    public Hashtable getTipoH() {
        return tipoH;
    }
    public Hashtable getUnitaH() {
        return unitaH;
    }
    public Hashtable getZeccaH() {
        return zeccaH;
    }
    

    public void setEmissioneH(Hashtable emissioneH) {
        this.emissioneH = emissioneH;
    }
    public void setEnteEmettitoreH(Hashtable enteEmettitoreH) {
        this.enteEmettitoreH = enteEmettitoreH;
    }
    public void setMonetaH(Hashtable monetaH) {
        this.monetaH = monetaH;
    }
    public void setSistemaMonetarioH(Hashtable sistemaMonetarioH) {
        this.sistemaMonetarioH = sistemaMonetarioH;
    }
    public void setTipoH(Hashtable tipoH) {
        this.tipoH = tipoH;
    }
    public void setUnitaH(Hashtable unitaH) {
        this.unitaH = unitaH;
    }
    public void setZeccaH(Hashtable zeccaH) {
        this.zeccaH = zeccaH;
    }
    
    
     public Id getId() {
        return id;
    }

    public void setId(Id id) {
        this.id = id;
    }
}
