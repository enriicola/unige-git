package easycoin.datatype;

import easycoin.enumeration.Forma;

public class InfoTipoMoneta {
    
    private ValoreNominale vnom;
    private String descrizione;
    private float spessore;
    private float peso;
    private float dimensione;
    private Forma forma;
    private String bordo;
    private String nota;
    private String materiale;
    
    /** COSTRUTTORI **/
    public InfoTipoMoneta(ValoreNominale vnom, String descrizione, float spessore, float peso, float dimensione, Forma forma,String bordo,String materiale,String nota){ 
        this.vnom = vnom;
        this.descrizione = descrizione;
        this.spessore = spessore;
        this.peso = peso;
        this.dimensione = dimensione;
        this.forma = forma;
        this.bordo = bordo;
        this.nota=nota;
        this.materiale=materiale;
    
    }
    public InfoTipoMoneta(){
       
    }
    
    /** SET **/
    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
  
    public void setSpessore(float spessore) {
        this.spessore = spessore;
    }
    public void setPeso(float peso) {
        this.peso = peso;
    }
     public void setBordo(String bordo) {
        this.bordo = bordo;
    }
      public void setNota(String nota) {
        this.nota = nota;
    }
    public void setForma(Forma forma) {
        this.forma = forma;
    }
    public void setDimensione(float dimensione) {
        this.dimensione = dimensione;
    }
    public void setVnom(ValoreNominale vnom) {
        this.vnom = vnom;
    }
    public void setMateriale(String materiale) {
        this.materiale = materiale;
    }
    
    /** GET **/
    public String getDescrizione() {
        return descrizione;
    }
    public float getDimensione() {
        return dimensione;
    }
    public Forma getForma() {
        return forma;
    }
    public float getPeso() {
        return peso;
    }
    public float getSpessore() {
        return spessore;
    }
    public ValoreNominale getVnom() {
        return vnom;
    }
    public String getBordo() {
       return bordo;
    }
     public String getNota() {
        return  nota;
    }
      public String getMateriale() {
        return  materiale;
    }
    
}
