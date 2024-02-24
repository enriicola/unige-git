package easycoin.datatype;

import easycoin.enumeration.*;

public class ModalitaVisualizzazione {

	private Formato formato;
	private Concisione concisione;
	private OggettoDaMostrare mostra;
	private Ordinamento ordinamento;
	
	public ModalitaVisualizzazione() {
		super();
	}

	public ModalitaVisualizzazione(Formato formato, Concisione concisione, OggettoDaMostrare mostra, Ordinamento ordinamento) {
		super();
		this.formato = formato;
		this.concisione = concisione;
		this.mostra = mostra;
		this.ordinamento = ordinamento;
	}



	//<<create>>
	public void SchedaR(OggettoDaMostrare o){
		this.mostra = o;
		this.formato = Formato.schede;
		this.concisione = Concisione.ridotta;
	}
	
	public void SezioneR(OggettoDaMostrare o){
		this.mostra = o;
		this.formato = Formato.sezioni;
		this.concisione = Concisione.ridotta;
	}
	
	public void SchedaC(OggettoDaMostrare o){
		this.mostra = o;
		this.formato = Formato.schede;
		this.concisione = Concisione.completa;
	}
	
	public void SezioneC(OggettoDaMostrare o){
		this.mostra = o;
		this.formato = Formato.sezioni;
		this.concisione = Concisione.completa;
	}

//	Metodi get e set
	public Concisione getConcisione() {
		return concisione;
	}

	public void setConcisione(Concisione concisione) {
		this.concisione = concisione;
	}

	public Formato getFormato() {
		return formato;
	}

	public void setFormato(Formato formato) {
		this.formato = formato;
	}

	public OggettoDaMostrare getMostra() {
		return mostra;
	}

	public void setMostra(OggettoDaMostrare mostra) {
		this.mostra = mostra;
	}

	public Ordinamento getOrdinamento() {
		return ordinamento;
	}

	public void setOrdinamento(Ordinamento ordinamento) {
		this.ordinamento = ordinamento;
	}
	
}
