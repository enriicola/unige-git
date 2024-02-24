package easycoin.temporary_store;

import easycoin.datatype.operazione.*;
import java.util.Hashtable;

public class OperazioniDaFare {

	private Hashtable op; //Sequence(Operazione)
	
	//<<create>> mkOPDF()
	public OperazioniDaFare() {
		this.op=new Hashtable();
	}

	@SuppressWarnings("unchecked")
	public void put(Operazione o){
        op.put(o,o);
        }
	
	public Hashtable getAll(){       
            
        }  //Sequence(Operazione)
	
	public void svuota(){
        op.clear();
        }

}
