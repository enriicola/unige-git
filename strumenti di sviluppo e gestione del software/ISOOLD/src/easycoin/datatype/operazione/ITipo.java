package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class ITipo extends Operazione {

	private Id id;
	private InfoTipoMoneta tipo;
	private Id ente;
	private Id unita;
	
//	<<create>>
	public ITipo(Id id,Id idEE,Id idU,InfoTipoMoneta t){
		this.id = id ;
		this.tipo=t;
		this.ente=idEE;
		this.unita=idU;
	}

//	Metodi get e set
	public Id getEnte() {
		return ente;
	}

	public void setEnte(Id ente) {
		this.ente = ente;
	}

	public Id getId() {
		return id;
	}

	public void setId(Id id) {
		this.id = id;
	}

	public InfoTipoMoneta getTipo() {
		return tipo;
	}

	public void setTipo(InfoTipoMoneta tipo) {
		this.tipo = tipo;
	}

	public Id getUnita() {
		return unita;
	}

	public void setUnita(Id unita) {
		this.unita = unita;
	}
	
}
