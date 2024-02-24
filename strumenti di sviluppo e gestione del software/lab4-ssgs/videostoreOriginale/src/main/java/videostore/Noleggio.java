package videostore;

// 1.0
public class Noleggio {

    Film _film;
    private int _giorniNoleggio;

    public Noleggio(Film film, int giorniNoleggio) {
        _film = film;
        _giorniNoleggio = giorniNoleggio;
    }

    public int getGiorniNoleggio() {
        return _giorniNoleggio;
    }

    public Film getFilm() {
        return _film;
    }

    public double getAmmontare() {
        return _film.getAmmontare(_giorniNoleggio);
    }
}
