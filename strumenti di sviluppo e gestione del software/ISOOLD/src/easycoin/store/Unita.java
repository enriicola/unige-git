package easycoin.store;

import easycoin.datatype.*;


public class Unita{
    
    private Id id;
    private Id sistemaMonetario;
    private InfoUnita infoU;
    
    /** COSTRUTTORI **/
    public Unita(Id id, Id sistemaMonetario, InfoUnita infoU) {
        this.id = id;
        this.sistemaMonetario = sistemaMonetario;
        this.infoU = infoU;
    }
    public Unita() {
      
    }
   

    /** GET **/
    public Id getId() {
        return id;
    }
    public InfoUnita getInfoU() {
        return infoU;
    }
    public Id getSistemaMonetario() {
        return sistemaMonetario;
    }

    
    /** SET **/
    public void setId(Id id) {
        this.id = id;
    }
    public void setInfoU(InfoUnita infoU) {
        this.infoU = infoU;
    }
    public void setSistemaMonetario(Id sistemaMonetario) {
        this.sistemaMonetario = sistemaMonetario;
    }
    
}
