package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class EUnita extends Operazione {

	private Id id;
	
    /*<<create>>*/
    public EUnita(Id id){
        this.id = id;
    }

//	Metodi get e set
	public Id getId() {
		return id;
	}

	public void setId(Id id) {
		this.id = id;
	}
	
	
}
