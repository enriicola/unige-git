package easycoin.datatype.criterio;

import java.sql.Date;

public class CriterioDate extends Criterio {

	private Date arg;

//	Metodi get e set
        public CriterioDate(Date arg){this.arg=arg;}
	public Date getArg() {
		return arg;
	}

	public void setArg(Date arg) {
		this.arg = arg;
	}
	
}
