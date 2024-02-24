package AppAgenda;

public class Endereco {
    private String rua;
    private int numero;
    private String complemento;
    private String cidade;
    private String estado;
    private String cep;

    public Endereco(String rua, int numero, String complemento, String cidade, String estado, String cep) {
        this.rua = rua;
        this.numero = numero;
        this.complemento = complemento;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;        
    }

    /* Getters e Setters */
    public String getRua() {
        return this.rua;
    }
    public void setRua(String rua) {
        this.rua = rua;
    }

    public int getNumero() {
        return this.numero;
    }
    public void setNumero(int numero) {
        this.numero = numero;
    }

    public String getComplemento() {
        return this.complemento;
    }
    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getCidade() {
        return this.cidade;
    }
    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return this.estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCep() {
        return this.cep;
    }
    public void setCep(String cep) {
        this.cep = cep;
    }
    /* Fim dos getters e setters */

    public String imprimir() {
        return 
            "Rua: " + rua +
            "\nNúmero: " + numero +
            "\nComplemento: " + complemento +
            "\nCidade: " + cidade +
            "\nEstado: " + estado +
            "\nCep: " + cep;
    }
}
