package easycoin.store;

import easycoin.datatype.*;


public class EnteEmettitore{
    
   private Id id;
   private InfoEnteEmettitore infoEE;
   
    /** COSTRUTTORI **/
    public EnteEmettitore(Id id, InfoEnteEmettitore infoEE) {
       this.id = id;
       this.infoEE = infoEE;
    }
    public EnteEmettitore() {
       
    }
   
    
    /** GET **/
    public Id getId() {
        return id;
    }
    public InfoEnteEmettitore getInfoEE() {
        return infoEE;
    }
    
    /** SET **/
    public void setId(Id id) {
        this.id = id;
    }
    public void setInfoEE(InfoEnteEmettitore infoEE) {
        this.infoEE = infoEE; // INSERT INTO???
    }
    
}
