package easycoin.datatype;

public class InfoSistemaMonetario {
    
    private String nome;
    private String nomeO;
    
    /** Creates a new instance of InfoSistemaMonetario */
    public InfoSistemaMonetario(String nome ,String nomeO) {
        this.nome = nome;
        this.nomeO = nomeO;
    }
    public InfoSistemaMonetario() {
      
    }

    /** SET **/
    public void setNomeOriginale(String nomeOriginale) {
        this.nomeO = nomeOriginale;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    /** GET **/
    public String getNome() {
        return nome;
    }
    public String getNomeOriginale() {
        return nomeO;
    }
    
}
