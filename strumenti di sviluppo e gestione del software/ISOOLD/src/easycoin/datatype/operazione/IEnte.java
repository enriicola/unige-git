package easycoin.datatype.operazione;

import easycoin.datatype.*;
import java.util.Hashtable;

public class IEnte extends Operazione {

	private Id id;
	private InfoEnteEmettitore ente;
	private Hashtable zecche; 
	private Hashtable sistemiMonetari;
        private Hashtable unita; 
	
	//<<create>>
	public IEnte(Id id,InfoEnteEmettitore ente, Hashtable z,Hashtable unita, Hashtable s){
		this.id=id;
		this.ente=ente;
		this.zecche=z;
		this.sistemiMonetari=s;
        this.unita=unita;
		
	}

//	Metodi get e set
	public InfoEnteEmettitore getEnte() {
		return ente;
	}

	public void setEnte(InfoEnteEmettitore ente) {
		this.ente = ente;
	}

	public Id getId() {
		return id;
	}

	public void setId(Id id) {
		this.id = id;
	}

	public Hashtable getSistemiMonetari() {
		return sistemiMonetari;
	}

	public void setSistemiMonetari(Hashtable sistemiMonetari) {
		this.sistemiMonetari = sistemiMonetari;
	}

	public Hashtable getZecche() {
		return zecche;
	}

	public void setZecche(Hashtable zecche) {
		this.zecche = zecche;
	}
        public Hashtable getUnita() {
		return unita;
	}

	public void setUnita(Hashtable unita) {
		this.unita = unita;
	}

	
	
	
}
