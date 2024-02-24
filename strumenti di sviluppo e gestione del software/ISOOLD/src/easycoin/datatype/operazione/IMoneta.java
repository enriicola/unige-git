package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class IMoneta extends Operazione {

	private Id id;
	private Id emissione;
	private InfoMoneta moneta;
	
//	<<create>>
	public IMoneta(Id id,Id idE,InfoMoneta m){
		this.id=id;
		this.emissione=idE;
		this.moneta=m;
	}

//	Metodi get e set
	public Id getEmissione() {
		return emissione;
	}

	public void setEmissione(Id emissione) {
		this.emissione = emissione;
	}

	public Id getId() {
		return id;
	}

	public void setId(Id id) {
		this.id = id;
	}

	public InfoMoneta getMoneta() {
		return moneta;
	}

	public void setMoneta(InfoMoneta moneta) {
		this.moneta = moneta;
	}
	
}
