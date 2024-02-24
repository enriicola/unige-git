package easycoin.datatype.criterio;


public class CriterioInt extends Criterio {

	private int arg;

//	Metodi get e set
        public CriterioInt(int arg){this.arg=arg;}
        
	public int getArg() {
		return arg;
	}

	public void setArg(int arg) {
		this.arg = arg;
	}
	
}
