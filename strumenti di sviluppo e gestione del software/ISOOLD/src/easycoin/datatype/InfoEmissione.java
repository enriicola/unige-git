package easycoin.datatype;

public class InfoEmissione {
    
    private int anno;
    private String note;
    
    /** COSTRUTTORI **/
    public InfoEmissione() {}
    
    public InfoEmissione(int anno ,String note) {
        this.anno = anno;
        this.note = note;
    }
    
    
    /** SET **/
    public void setNote(String note) {
        this.note = note;
    }
    public void setAnno(int anno) {
        this.anno = anno;
    }
    
    /** GET **/
    public int getAnno() {
        return anno;
    }
    public String getNote() {
        return note;
    }

}
