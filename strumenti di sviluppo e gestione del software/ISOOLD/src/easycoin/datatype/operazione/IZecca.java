package easycoin.datatype.operazione;

import easycoin.datatype.*;

public class IZecca extends Operazione {

	private Id id;
	private InfoZecca z;
        private Id enteE;
	
	public IZecca(Id id, InfoZecca z,Id enteE) {
		super();
		this.id = id;
		this.z = z;
                this.enteE=enteE;
	}
	
	public Id getId() {
		return id;
	}
	public void setId(Id id) {
		this.id = id;
	}
        public Id getEnte() {
		return enteE;
	}
	public void setEnte(Id id) {
		this.enteE = id;
	}
	public InfoZecca getZ() {
		return z;
	}
	public void setZ(InfoZecca z) {
		this.z = z;
	}
	
	
	
}
