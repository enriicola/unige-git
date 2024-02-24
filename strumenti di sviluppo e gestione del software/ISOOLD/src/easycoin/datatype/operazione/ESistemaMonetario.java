package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class ESistemaMonetario extends Operazione {

	private Id id;
	
    /*<<create>>*/
    public ESistemaMonetario (Id id){
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

