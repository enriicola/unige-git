package easycoin.store;

import easycoin.datatype.*;


public class Tipo{
    
    private Id id;
    private Id unita;
    private Id enteEmettitore;
    private InfoTipoMoneta infoTipoMoneta;
    
    /** COSTRUTTORI  **/
    public Tipo(Id id, Id unita, Id enteEmettitore, InfoTipoMoneta infoTipoMoneta) {
        this.id = id;
        this.unita = unita;
        this.enteEmettitore = enteEmettitore;
        this.infoTipoMoneta = infoTipoMoneta;
    }
    public Tipo() {
      
    }
    
    
    /** GET **/
    public Id getId() {
        return id;
    }
    public InfoTipoMoneta getInfoTipoMoneta() {
        return infoTipoMoneta;
    }
    public Id getEnteEmettitore() {
        return enteEmettitore;
    }
    public Id getUnita() {
        return unita;
    }
    
    
    
    /** SET **/
    public void setId(Id id) {
        this.id = id;
    }
    public void setInfoTipoMoneta(InfoTipoMoneta infoTipoMoneta) {
        this.infoTipoMoneta = infoTipoMoneta;
    }
    public void setEnteEmettitore(Id enteEmettitore) {
        this.enteEmettitore = enteEmettitore;
    }
    public void setUnita(Id unita) {
        this.unita = unita;
    }  
    
    
}
