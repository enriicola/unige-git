package easycoin.datatype;

public class ValoreNominale {

/*
- parte intera=0 ->il valore è rappresentato solo dalla frazione
- frazione=0 -> il valore è rappresentato solo dalla parte intera

(Le frazioni non vanno ridotte ai minimi termini in quanto sono possibili anche valori tipo 2/12. 
Sono inoltre possibili valori rappresentati da parte intera più frazione come per esempio 
2 e 1/2)
*/
	private int parteIntera;
	private int numeratore;
	private int denominatore;
	
	//<<create>>
	public ValoreNominale(int pIntera ,int numeratore ,int denominatore ){
        this.parteIntera=pIntera;
        this.numeratore=numeratore;
        this.denominatore=denominatore;
        }

//	Metodi get e set
	public int getDenominatore() {
		return denominatore;
	}

	public void setDenominatore(int denominatore) {
		this.denominatore = denominatore;
	}

	public int getNumeratore() {
		return numeratore;
	}

	public void setNumeratore(int numeratore) {
		this.numeratore = numeratore;
	}

	public int getParteIntera() {
		return parteIntera;
	}

	public void setParteIntera(int parteIntera) {
		this.parteIntera = parteIntera;
	}
	
	
}
