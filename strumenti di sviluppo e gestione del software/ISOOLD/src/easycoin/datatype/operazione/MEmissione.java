package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class MEmissione extends Operazione {

	private Id idT;
	private Id idZ;
	private Id id;
	private InfoEmissione emissione;
	private Id unita;
	
	//<<create>>
	public MEmissione(Id idT,Id idZ,InfoEmissione em,Id unita,Id id){
		this.id=id;
		this.idT=idT;
		this.idZ=idZ;
		this.emissione=em;
		this.unita=unita;
	}

//	Metodi get e set
	public InfoEmissione getEmissione() {
		return emissione;
	}

	public void setEmissione(InfoEmissione emissione) {
		this.emissione = emissione;
	}

	public Id getId() {
		return id;
	}

	public void setId(Id id) {
		this.id = id;
	}

	public Id getIdT() {
		return idT;
	}

	public void setIdT(Id idT) {
		this.idT = idT;
	}

	public Id getIdZ() {
		return idZ;
	}

	public void setIdZ(Id idZ) {
		this.idZ = idZ;
	}

	public Id getUnita() {
		return unita;
	}

	public void setUnita(Id unita) {
		this.unita = unita;
	}
	
}
