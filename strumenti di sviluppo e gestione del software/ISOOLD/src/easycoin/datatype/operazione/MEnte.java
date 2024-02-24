package easycoin.datatype.operazione;

import java.util.Hashtable;
import easycoin.datatype.*;

public class MEnte extends Operazione {
	
	private Id id;
	private InfoEnteEmettitore e;
	private Hashtable zecche; /*Sequence(InfoZecca)*/
	private Hashtable sistemiMonetari; /*Sequence(InfoSistemaMonetario)*/
	private Hashtable unita;
	
	//<<create>>
	public MEnte(InfoEnteEmettitore e,/*Sequence(InfoZecca)*/ Hashtable z,/*Sequence(InfoSistemaMonetario)*/ Hashtable s,Hashtable u,Id id){
		this.id=id;
		this.e=e;
		this.zecche=z;
		this.sistemiMonetari=s;
		this.unita=u;
	}

//	Metodi get e set
	public InfoEnteEmettitore getE() {
		return e;
	}

	public void setE(InfoEnteEmettitore e) {
		this.e = e;
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
