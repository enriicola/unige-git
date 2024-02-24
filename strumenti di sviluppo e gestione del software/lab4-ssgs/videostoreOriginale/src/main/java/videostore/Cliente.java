package videostore;

import java.util.*;

// 1.0
public class Cliente {
    private String _nome;
    private List<Noleggio> _noleggi = new ArrayList<Noleggio>();

    public Cliente(String nome) {
        _nome = nome;
    }

    public void addNoleggio(Noleggio arg) {
        _noleggi.add(arg);
    }

    public String getNome() {
        return _nome;
    }

    private double getAmmontareTotale() {
        double risultato = 0;
        for (Noleggio noleggio : _noleggi)
            risultato += noleggio.getAmmontare();
        return risultato;
    }

    public String rendiconto() {
        double ammontareTotale = this.getAmmontareTotale();
        Iterator<Noleggio> noleggi = _noleggi.iterator();
        String r = "Rendiconto noleggi per " + getNome() + " ";

        while (noleggi.hasNext()) {
            Noleggio ognuno = (Noleggio) noleggi.next();

            // aggiungi al risultato
            r += ognuno.getFilm().getTitolo() + " " +
                    String.valueOf(ognuno.getAmmontare()) + " ";
        } // while

        // aggiungi totale
        r += "L'ammontare dovuto e' " + String.valueOf(ammontareTotale);
        return r;
    }
}
