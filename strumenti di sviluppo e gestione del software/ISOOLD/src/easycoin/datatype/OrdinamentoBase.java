package easycoin.datatype;

public class OrdinamentoBase {

	private int posizione;
	private boolean crescente;
	
//	Metodi get e set
        public OrdinamentoBase(int posizione,boolean crescente){
            this.posizione=posizione;
            this.crescente=crescente;
        }
	public boolean isCrescente() {
		return crescente;
	}
	public void setCrescente(boolean crescente) {
		this.crescente = crescente;
	}
	public int getPosizione() {
		return posizione;
	}
	public void setPosizione(int posizione) {
		this.posizione = posizione;
	}
	
	
	
}
