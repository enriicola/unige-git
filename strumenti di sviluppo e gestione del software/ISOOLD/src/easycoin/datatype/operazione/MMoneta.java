package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class MMoneta extends Operazione {
	
	private InfoMoneta moneta;
	private Id idM;
        private Id idE;
	
	//<<create>>
	public MMoneta(InfoMoneta moneta,Id idM,Id idE){
		this.moneta=moneta;
		this.idM=idM;
                this.idE=idE;
	}

//	Metodi get e set
	public Id getIdM() {
		return idM;
	}

	public void setIdM(Id idM) {
		this.idM = idM;
	}
        public Id getIdE() {
		return idE;
	}

	public void setIdE(Id idE) {
		this.idE = idE;
	}

	public InfoMoneta getMoneta() {
		return moneta;
	}

	public void setMoneta(InfoMoneta moneta) {
		this.moneta = moneta;
	}

}
