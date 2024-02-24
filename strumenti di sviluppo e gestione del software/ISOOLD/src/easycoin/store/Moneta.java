package easycoin.store;

import easycoin.datatype.*;

public class Moneta{
    
    
    private Id id;
    private InfoMoneta infoM;
    private Id emissione;
    
    
    /** COSTRUTTORI **/
    public Moneta(Id id ,InfoMoneta infoM ,Id emissione) {
        this.id = id;
        this.infoM = infoM;
        this.emissione = emissione;
    }
    public Moneta() {
        
    }
    

    /** GET **/
    public Id getEmissione() {
        return emissione;
    }
    public Id getId() {
        return id;
    }
    public InfoMoneta getInfoM() {
        return infoM;
    }

    
    /** SET **/
    public void setEmissione(Id emissione) {
        this.emissione = emissione;
    }
    public void setId(Id id) {
        this.id = id;
    }
    public void setInfoM(InfoMoneta infoM) {
        this.infoM = infoM;
    }
    
}
