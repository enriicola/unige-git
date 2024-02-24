package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class IUnita extends Operazione {

	private Id id;
	private InfoUnita unita;
        private Id sm;
	
	public IUnita(Id id, InfoUnita unita,Id sm) {
		super();
		this.id = id;
		this.unita = unita;
                this.sm = sm;
	}

	public Id getId() {
		return id;
	}

	public void setId(Id id) {
		this.id = id;
	}
        public Id getSm() {
		return sm;
	}

	public void setSm(Id sm) {
		this.sm = sm;
	}

	public InfoUnita getUnita() {
		return unita;
	}

	public void setUnita(InfoUnita unita) {
		this.unita = unita;
	}
	
	
}
