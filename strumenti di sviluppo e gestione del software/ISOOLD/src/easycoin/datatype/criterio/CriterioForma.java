package easycoin.datatype.criterio;

import easycoin.enumeration.*;

public class CriterioForma extends Criterio {

	private Forma arg;
	
//	Metodi get e set
        public CriterioForma(Forma arg){this.arg=arg;}
	public Forma getArg() {
		return arg;
	}

	public void setArg(Forma arg) {
		this.arg = arg;
	}
	
}
