package easycoin.executor;

import easycoin.calculator.Visualizza;
import easycoin.temporary_store.*;
import easycoin.store.*;
import easycoin.WindowUtilities;

public class Main {

    private Visualizza VIS; 
    private GestireEasyCatalogo GEC;
    private OperazioniDaFare OP;
    private ParteSelezionata SEL;
    private InfoStore INFO;
    private PreferenzeStore PS;
    
    /** Creates a new instance of Main */
    public Main() {
        super();
        this.OP = new OperazioniDaFare();
        this.VIS = new Visualizza();
        this.SEL = new ParteSelezionata();
        this.INFO = new InfoStore();
        this.PS = new PreferenzeStore();
        PS.Connessione("preferenze", "Gruppo3", "ciao");
        INFO.Connessione("EasyCoin", "Gruppo3", "ciao");
        this.GEC = new GestireEasyCatalogo(this.SEL, this.OP, this.PS, this.VIS, this.INFO);
        this.GEC.getAEC().setAEC(this);
    }
    
    public void chiudi(){
       this.GEC.sincronizzaStore();
       //this.GEC.getGE().sincronizzaStore();
       PS.ChiudiConnessione();
       INFO.ChiudiConnessione();
    }
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		/*Look & Feel per interfaccia grafica*/
		WindowUtilities.setNativeLookAndFeel();
        new Main();
	}

}

