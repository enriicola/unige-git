package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class IEmissione extends Operazione {

	private Id id;
	private Id zecca;
	private Id tipo;
	private InfoEmissione emissione;
	
    /*<<create>>*/   
    public IEmissione(Id id,Id idT,Id idZ,InfoEmissione em){
            this.emissione = em;
            this.id = id;
            this.tipo = idT;
            this.zecca = idZ;
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

	public Id getTipo() {
		return tipo;
	}

	public void setTipo(Id tipo) {
		this.tipo = tipo;
	}

	public Id getZecca() {
		return zecca;
	}

	public void setZecca(Id zecca) {
		this.zecca = zecca;
	}
	
	
}
