import java.util.ArrayList; // generati in automatico scrivendo ArrayList con IntelliSense
import java.util.List;

public class Persona {
    private String nome;
    private String cognome;

    private Telefono telefono;

    private List<Persona> amici;

    // tutto generato con Source Actions <3

    public Persona(String nome, String cognome) {
        this.nome = nome;
        this.cognome = cognome;
        this.amici = new ArrayList<Persona>(); // arraylist è un'interfaccia
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    // metodo delega :)
    public String getString() {
        return telefono.toString();
    }

}
