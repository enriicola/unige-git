package easycoin.store;


import easycoin.datatype.*;


public class Emissione{
    
    private Id id;
    private Id tipo;
    private Id zecca;
    private InfoEmissione infoE;
    
    /** COSTRUTTORE **/
    public Emissione(Id id, Id tipo, Id zecca, InfoEmissione infoE) {
        this.id = id;
        this.tipo = tipo;
        this.zecca = zecca;
        this.infoE = infoE; 
    }
    public Emissione() {
         
    }
   
    
    /** GET **/
    public Id getId() {
        return id;
    }
    public InfoEmissione getInfoE() {
        return infoE;
    }
    public Id getTipo() {
        return tipo;
    }
    public Id getZecca() {
        return zecca;
    }

    
    /** SET **/
    public void setId(Id id) {
        this.id = id;
    }
    public void setInfoE(InfoEmissione infoE) {
        this.infoE = infoE;
    }
    public void setTipo(Id tipo) {
        this.tipo = tipo;
    }
    public void setZecca(Id zecca) {
        this.zecca = zecca;
    }
    
}
