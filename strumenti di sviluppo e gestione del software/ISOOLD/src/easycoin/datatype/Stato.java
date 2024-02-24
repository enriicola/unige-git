package easycoin.datatype;

public class Stato {
	
	private boolean presente;
	private StatoM note= new StatoM();
	
	/*Context s: Stato inv:
		 s.presente =>
		(s.note = "in collezione" or s.note = "cedibile" or s.note = "destinata a")*/
	
	public Stato(boolean presente, StatoM note) {
		super();
		this.presente = presente;
		this.note = note;
	}	
	
	public Stato() {
	}

	//	Metodi get e set
	public StatoM getNote() {
		return this.note;
	}
	public void setNote(StatoM note) {
		this.note = note;
	}
	public boolean isPresente() {
		return this.presente;
	}
	public void setPresente(boolean presente) {
		this.presente = presente;
	}
	
	public String StampaStato(StatoM s){
		if(s instanceof Cedibile){
            return "Cedibile";
        }else if(s instanceof DestinataA){
            DestinataA sm=null;
            String as="Destinata A ";
            sm=(DestinataA)s;
            return as+sm.getA();     
        }else if(s instanceof Virtuale){
            Virtuale sm=null;
            String as="Virtuale ";
            sm=(Virtuale)s;
            return as+sm.getNot();   
        }else if(s instanceof InCollezione){
            InCollezione sm=null;
            String as="In Collezione ";
            sm=(InCollezione)s;
            return as+sm.getLocazione();  
        }           
		return null;
	} 

}
