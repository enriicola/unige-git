package easycoin.datatype.criterio;

import easycoin.enumeration.*;

public class CriterioGrado extends Criterio {

	private Grado arg;

//	Metodi get e set
        public CriterioGrado(Grado arg){this.arg=arg;}
	public Grado getArg() {
		return arg;
	}

	public void setArg(Grado arg) {
		this.arg = arg;
	}
	
}
