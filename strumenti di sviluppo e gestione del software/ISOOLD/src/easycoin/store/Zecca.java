package easycoin.store;


import easycoin.datatype.*;


public class Zecca{
    
    private InfoZecca infoZ;
    private Id id;
    private Id enteEmettitore;
    
    /** COSTRUTTORE **/
    public Zecca(InfoZecca infoZ, Id id, Id enteEmettitore) {
        this.infoZ = infoZ;
        this.id = id;
        this.enteEmettitore = enteEmettitore;
    }
    public Zecca() {
        
    }
    
    
    /** GET **/
    public InfoZecca getInfoZ() {
        return infoZ;
    }
    public Id getId() {
        return id;
    }
    public Id getEnteEmettitore() {
        return enteEmettitore;
    }

    /** SET **/
    public void setId(Id id) {
        this.id = id;
    }
    public void setInfoZ(InfoZecca infoZ) {
        this.infoZ = infoZ;
    }
    public void setEnteEmettitore(Id enteEmettitore) {
        this.enteEmettitore = enteEmettitore;
    }
    
    
}
