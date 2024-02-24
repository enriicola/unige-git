package easycoin.datatype;

import easycoin.datatype.OrdinamentoBase;

public class Ordinamento {

	private OrdinamentoBase nomeEnteEmettitore;
	private OrdinamentoBase areaGeografica;
	private OrdinamentoBase dataInizio;
	private OrdinamentoBase dataFine;
	private OrdinamentoBase annoEmissione;
	private OrdinamentoBase zecca;
	private OrdinamentoBase valoreNominale;
	private OrdinamentoBase spessore;
	private OrdinamentoBase peso;
	private OrdinamentoBase dimensione;
	private OrdinamentoBase forma;
	private OrdinamentoBase bordo;
	private OrdinamentoBase materiale;
	private OrdinamentoBase grado;
	private OrdinamentoBase valoreCommerciale;
	
	public Ordinamento(OrdinamentoBase nomeEnteEmettitore, OrdinamentoBase areaGeografica, OrdinamentoBase dataInizio, OrdinamentoBase dataFine, OrdinamentoBase annoEmissione, OrdinamentoBase zecca, OrdinamentoBase valoreNominale, OrdinamentoBase spessore, OrdinamentoBase peso, OrdinamentoBase dimensione, OrdinamentoBase forma, OrdinamentoBase bordo, OrdinamentoBase materiale, OrdinamentoBase grado, OrdinamentoBase valoreCommerciale) {
		this.nomeEnteEmettitore = nomeEnteEmettitore;
		this.areaGeografica = areaGeografica;
		this.dataInizio = dataInizio;
		this.dataFine = dataFine;
		this.annoEmissione = annoEmissione;
		this.zecca = zecca;
		this.valoreNominale = valoreNominale;
		this.spessore = spessore;
		this.peso = peso;
		this.dimensione = dimensione;
		this.forma = forma;
		this.bordo = bordo;
		this.materiale = materiale;
		this.grado = grado;
		this.valoreCommerciale = valoreCommerciale;
	}

	public Ordinamento() {}

	//	Metodi get e set
	public OrdinamentoBase getAnnoEmissione() {
		return annoEmissione;
	}
	public void setAnnoEmissione(OrdinamentoBase annoEmissione) {
		this.annoEmissione = annoEmissione;
	}
	public OrdinamentoBase getAreaGeografica() {
		return areaGeografica;
	}
	public void setAreaGeografica(OrdinamentoBase areaGeografica) {
		this.areaGeografica = areaGeografica;
	}
	public OrdinamentoBase getBordo() {
		return bordo;
	}
	public void setBordo(OrdinamentoBase bordo) {
		this.bordo = bordo;
	}
	public OrdinamentoBase getDataFine() {
		return dataFine;
	}
	public void setDataFine(OrdinamentoBase dataFine) {
		this.dataFine = dataFine;
	}
	public OrdinamentoBase getDataInizio() {
		return dataInizio;
	}
	public void setDataInizio(OrdinamentoBase dataInizio) {
		this.dataInizio = dataInizio;
	}
	public OrdinamentoBase getDimensione() {
		return dimensione;
	}
	public void setDimensione(OrdinamentoBase dimensione) {
		this.dimensione = dimensione;
	}
	public OrdinamentoBase getForma() {
		return forma;
	}
	public void setForma(OrdinamentoBase forma) {
		this.forma = forma;
	}
	public OrdinamentoBase getGrado() {
		return grado;
	}
	public void setGrado(OrdinamentoBase grado) {
		this.grado = grado;
	}
	public OrdinamentoBase getMateriale() {
		return materiale;
	}
	public void setMateriale(OrdinamentoBase materiale) {
		this.materiale = materiale;
	}
	public OrdinamentoBase getNomeEnteEmettitore() {
		return nomeEnteEmettitore;
	}
	public void setNomeEnteEmettitore(OrdinamentoBase nomeEnteEmettitore) {
		this.nomeEnteEmettitore = nomeEnteEmettitore;
	}
	public OrdinamentoBase getPeso() {
		return peso;
	}
	public void setPeso(OrdinamentoBase peso) {
		this.peso = peso;
	}
	public OrdinamentoBase getSpessore() {
		return spessore;
	}
	public void setSpessore(OrdinamentoBase spessore) {
		this.spessore = spessore;
	}
	public OrdinamentoBase getValoreCommerciale() {
		return valoreCommerciale;
	}
	public void setValoreCommerciale(OrdinamentoBase valoreCommerciale) {
		this.valoreCommerciale = valoreCommerciale;
	}
	public OrdinamentoBase getValoreNominale() {
		return valoreNominale;
	}
	public void setValoreNominale(OrdinamentoBase valoreNominale) {
		this.valoreNominale = valoreNominale;
	}
	public OrdinamentoBase getZecca() {
		return zecca;
	}
	public void setZecca(OrdinamentoBase zecca) {
		this.zecca = zecca;
	}

}
