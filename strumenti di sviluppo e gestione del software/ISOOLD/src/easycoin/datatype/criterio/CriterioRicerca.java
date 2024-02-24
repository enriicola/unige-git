package easycoin.datatype.criterio;

public class CriterioRicerca {
	 
	private CriterioString nomeEnteEmettitore;
	private CriterioString areaGeografica;
	private CriterioInt annoEmissione;
	private CriterioDate dataInizio;
	private CriterioDate dataFine;
	private CriterioString zecca;
	private CriterioInt valoreNominale;
	private CriterioString unita;
	private CriterioFloat spessore; 
	private CriterioFloat peso;
	private CriterioFloat dimensione;
	private CriterioString bordo;
	private CriterioForma forma;
	private CriterioString materiale;
	private CriterioString descrizione;
	private CriterioFloat valoreCommerciale; 
	private CriterioGrado grado; 
	private CriterioStato stato;
	
//	Metodi get e set
	public CriterioInt getAnnoEmissione() {
		return annoEmissione;
	}
	public void setAnnoEmissione(CriterioInt annoEmissione) {
		this.annoEmissione = annoEmissione;
	}
	public CriterioString getAreaGeografica() {
		return areaGeografica;
	}
	public void setAreaGeografica(CriterioString areaGeografica) {
		this.areaGeografica = areaGeografica;
	}
	public CriterioString getBordo() {
		return bordo;
	}
	public void setBordo(CriterioString bordo) {
		this.bordo = bordo;
	}
	public CriterioDate getDataFine() {
		return dataFine;
	}
	public void setDataFine(CriterioDate dataFine) {
		this.dataFine = dataFine;
	}
	public CriterioDate getDataInizio() {
		return dataInizio;
	}
	public void setDataInizio(CriterioDate dataInizio) {
		this.dataInizio = dataInizio;
	}
	public CriterioString getDescrizione() {
		return descrizione;
	}
	public void setDescrizione(CriterioString descrizione) {
		this.descrizione = descrizione;
	}
	public CriterioFloat getDimensione() {
		return dimensione;
	}
	public void setDimensione(CriterioFloat dimensione) {
		this.dimensione = dimensione;
	}
	public CriterioForma getForma() {
		return forma;
	}
	public void setForma(CriterioForma forma) {
		this.forma = forma;
	}
	public CriterioGrado getGrado() {
		return grado;
	}
	public void setGrado(CriterioGrado grado) {
		this.grado = grado;
	}
	public CriterioString getMateriale() {
		return materiale;
	}
	public void setMateriale(CriterioString materiale) {
		this.materiale = materiale;
	}
	public CriterioString getNomeEnteEmettitore() {
		return nomeEnteEmettitore;
	}
	public void setNomeEnteEmettitore(CriterioString nomeEnteEmettitore) {
		this.nomeEnteEmettitore = nomeEnteEmettitore;
	}
	public CriterioFloat getPeso() {
		return peso;
	}
	public void setPeso(CriterioFloat peso) {
		this.peso = peso;
	}
	public CriterioFloat getSpessore() {
		return spessore;
	}
	public void setSpessore(CriterioFloat spessore) {
		this.spessore = spessore;
	}
	public CriterioStato getStato() {
		return stato;
	}
	public void setStato(CriterioStato stato) {
		this.stato = stato;
	}
	public CriterioString getUnita() {
		return unita;
	}
	public void setUnita(CriterioString unita) {
		this.unita = unita;
	}
	public CriterioFloat getValoreCommerciale() {
		return valoreCommerciale;
	}
	public void setValoreCommerciale(CriterioFloat valoreCommerciale) {
		this.valoreCommerciale = valoreCommerciale;
	}
	public CriterioInt getValoreNominale() {
		return valoreNominale;
	}
	public void setValoreNominale(CriterioInt valoreNominale) {
		this.valoreNominale = valoreNominale;
	}
	public CriterioString getZecca() {
		return zecca;
	}
	public void setZecca(CriterioString zecca) {
		this.zecca = zecca;
	}
	
}
