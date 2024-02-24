package easycoin.datatype;

import easycoin.enumeration.*;


public class InfoMoneta {
    
    private Grado grado;
    private Stato stato;
    private float valoreCommerciale;        
    
    /** COSTRUTTORI **/
    public InfoMoneta(Grado grado, Stato stato, float valoreCommerciale) {
        this.grado = grado;
        this.stato = stato;       
        this.valoreCommerciale = valoreCommerciale;
    }
    public InfoMoneta() {
        
    }
    
    
    /** SET **/
    public void setGrado(Grado grado) {
        this.grado = grado;
    }
    public void setStato(Stato stato) {
        this.stato = stato;
    }
    public void setValoreCommerciale(float valoreCommerciale) {
        this.valoreCommerciale = valoreCommerciale;
    }
    
    
    /** GET **/
    public Grado getGrado() {
        return grado;
    }
    public Stato getStato() {
        return stato;
    }
    public float getValoreCommerciale() {
        return valoreCommerciale;
    }
    
}
