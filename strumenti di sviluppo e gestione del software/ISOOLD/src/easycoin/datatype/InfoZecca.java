package easycoin.datatype;


public class InfoZecca {
    
    private String sigla;
    private String descrizione;
    
    /** COSTRUTTORE **/
    public InfoZecca(String sigla, String descrizione) {
        this.sigla = sigla;
        this.descrizione = descrizione;
    }
    public InfoZecca() { 
    }

        /** SET  **/
    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
    public void setSigla(String sigla) {
        this.sigla = sigla;
    }
    
    /** GET **/
    public String getDescrizione() {
        return descrizione;
    }
    public String getSigla() {
        return sigla;
    }
}

