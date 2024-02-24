package easycoin.datatype.criterio;


public class CriterioString extends Criterio {

	private String arg;

//	Metodi get e set
        public CriterioString(String arg){this.arg=arg;}
	public String getArg() {
		return arg;
	}

	public void setArg(String arg) {
		this.arg = arg;
	}
	
}
