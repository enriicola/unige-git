package videostore;

public class PrezzoNovita extends Prezzo {

    public int getCodicePrezzo() {
        return Film.NOVITA;
    }

    @Override
    public double getAmmontare(int giorniNoleggio) {
        return giorniNoleggio * 3;
    }
}
