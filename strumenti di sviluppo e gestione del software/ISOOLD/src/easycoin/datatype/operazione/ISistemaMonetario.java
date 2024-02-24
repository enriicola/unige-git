package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class ISistemaMonetario extends Operazione {

	private Id id;
	private InfoSistemaMonetario sm;
	private Id idee;
	
	public ISistemaMonetario(Id id, InfoSistemaMonetario sm, Id idee) {
		super();
		this.id = id;
		this.sm = sm;
		this.idee = idee;
	}

	public Id getId() {
		return id;
	}

	public void setId(Id id) {
		this.id = id;
	}

	public InfoSistemaMonetario getSm() {
		return sm;
	}

	public void setSm(InfoSistemaMonetario sm) {
		this.sm = sm;
	}

	public Id getEE() {
		return idee;
	}

	public void setEE(Id idee) {
		this.idee = idee;
	}
	
	
}
