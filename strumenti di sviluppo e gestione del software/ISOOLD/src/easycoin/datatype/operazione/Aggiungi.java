package easycoin.datatype.operazione;

import easycoin.store.*;

public class Aggiungi extends Operazione {

	private Info daAggiungere;
	
	//<<create>>
	public Aggiungi(Info ec){
		this.daAggiungere=ec;
	}

//	Metodi get e set
	public Info getDaAggiungere() {
		return daAggiungere;
	}

	public void setDaAggiungere(Info daAggiungere) {
		this.daAggiungere = daAggiungere;
	}
	
	
}
