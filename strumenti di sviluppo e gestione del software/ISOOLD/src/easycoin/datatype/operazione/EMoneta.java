package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class EMoneta extends Operazione {

	private Id id;
	
    /*<<create>>*/
    public EMoneta(Id id){
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
