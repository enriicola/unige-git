package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class MTipo extends Operazione {

	private InfoTipoMoneta tipo;
	private Id id;
        private Id idEE;
         private Id idu;
	

	//	<<create>>
    public MTipo(InfoTipoMoneta tipo,Id id,Id idEE,Id idu){
        this.id = id;
        this.tipo = tipo;
        this.idEE=idEE;
        this.idu=idu;
    }

//	Metodi get e set
	public Id getId() {
		return id;
	}

	public void setId(Id id) {
		this.id = id;
	}

	public InfoTipoMoneta getTipo() {
		return tipo;
	}

	public void setTipo(InfoTipoMoneta tipo) {
		this.tipo = tipo;
	}
	public Id getEE() {
		return idEE;
	}

	public void setEE(Id idEE) {
		this.idEE = idEE;
	}
        public Id getU() {
		return idu;
	}

	public void setU(Id idu) {
		this.idu = idu;
	}
}
