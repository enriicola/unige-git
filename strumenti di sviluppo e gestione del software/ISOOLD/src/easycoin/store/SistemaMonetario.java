package easycoin.store;

import easycoin.datatype.*;


public class SistemaMonetario{
    
    private Id id;
    private InfoSistemaMonetario infoSM;
    private Id enteEmettitore;
    
    /** COSTRUTTORI  **/
    public SistemaMonetario(Id id, InfoSistemaMonetario infoSM, Id enteEmettitore) {
        this.id = id;
        this.infoSM = infoSM;
        this.enteEmettitore = enteEmettitore;
    }
    public SistemaMonetario() {
        
    }
    
    
    /** GET **/
    public Id getId() {
        return id;
    }
    public InfoSistemaMonetario getInfoSM() {
        return infoSM;
    }
    public Id getEnteEmettitore() {
        return enteEmettitore;
    }

    
    /** SET **/
    public void setId(Id id) {
        this.id = id;
    }
    public void setInfoSM(InfoSistemaMonetario infoSM) {
        this.infoSM = infoSM;
    }
    public void setEnteEmettitore(Id enteEmettitore) {
        this.enteEmettitore = enteEmettitore;
    }
    
}
