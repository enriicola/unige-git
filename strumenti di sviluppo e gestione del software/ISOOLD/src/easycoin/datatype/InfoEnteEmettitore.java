package easycoin.datatype;

import java.sql.Date;

public class InfoEnteEmettitore {
    
    private String nome;
    private String nomeOriginale;
    private String areaGeografica;
    private Date dataInizio;
    private Date dataFine;
    private String note;
    
    /** COSTRUTTORI **/
    public InfoEnteEmettitore(String nome, String nomeOriginale, String areaGeografica, Date dataInizio, Date dataFine, String note) {
        this.nome = nome;
        this.nomeOriginale = nomeOriginale;
        this.areaGeografica = areaGeografica;
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
        this.note = note;
    }
    public InfoEnteEmettitore(){
    }
    
    /** SET **/
    public void setDataFine(Date dataFine) {
        this.dataFine = dataFine;
    }
    public void setDataInizio(Date dataInizio) {
        this.dataInizio = dataInizio;
    }
    public void setAreaGeografica(String areaGeografica) {
        this.areaGeografica = areaGeografica;
    }
    public void setNomeOriginale(String nomeOriginale) {
        this.nomeOriginale = nomeOriginale;
    }
    public void setNote(String note) {
        this.note = note;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    /** GET **/
    public String getNome() {
        return nome;
    }
    public String getNomeOriginale() {
        return nomeOriginale;
    }
    public Date getDataInizio() {
        return dataInizio;
    }
    public Date getDataFine() {
        return dataFine;
    }
    public String getAreaGeografica() {
        return areaGeografica;
    }
    public String getNote() {
        return note;
    }
    
    
}
