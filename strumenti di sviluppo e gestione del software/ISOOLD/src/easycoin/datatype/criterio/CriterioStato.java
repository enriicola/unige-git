package easycoin.datatype.criterio;

import easycoin.datatype.*;

public class CriterioStato extends Criterio {

	private Stato arg;

        public CriterioStato(Stato arg){this.arg=arg;}
//	Metodi get e set
	public Stato getArg() {
		return arg;
	}

	public void setArg(Stato arg) {
		this.arg = arg;
	}
	
}
