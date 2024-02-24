package easycoin.datatype;


public class InfoUnita {
    
    private String nome;
    private String nomeOriginale;
    private float fattoreMonteplicita;
    
    /** COSTRUTTORI **/
    public InfoUnita(String nome, String nomeOriginale, float fattoreMonteplicita) {
        this.nome = nome;
        this.nomeOriginale = nomeOriginale;
        this.fattoreMonteplicita = fattoreMonteplicita;
    }
    public InfoUnita() {
    }

    /** SET **/
    public void setFattoreMonteplicita(float fattoreMonteplicita) {
        this.fattoreMonteplicita = fattoreMonteplicita;
    }
    public void setNomeOriginale(String nomeOriginale) {
        this.nomeOriginale = nomeOriginale;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    /** GET **/
    public float getFattoreMonteplicita() {
        return fattoreMonteplicita;
    }
    public String getNome() {
        return nome;
    }
    public String getNomeOriginale() {
        return nomeOriginale;
    }
    
}
