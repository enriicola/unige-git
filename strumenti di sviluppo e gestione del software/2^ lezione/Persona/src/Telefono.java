// generata dal menù java project + "+" + digitando il nome
public class Telefono {
    private int numero; // int per comodità, sarebbe un errore
    private int prefisso;
    
    // tutto generato con Source Actions <3
    
    public Telefono(int numero, int prefisso) {
        this.numero = numero;
        this.prefisso = prefisso;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public int getPrefisso() {
        return prefisso;
    }

    public void setPrefisso(int prefisso) {
        this.prefisso = prefisso;
    }

    @Override
    public String toString() {
        return "Telefono [numero=" + numero + ", prefisso=" + prefisso + "]";
    }

    
}
