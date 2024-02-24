package easycoin.store;

import easycoin.datatype.*;
import easycoin.datatype.criterio.*;

public class Preferenze {

	private ModalitaVisualizzazione mod;
	private CriterioRicerca criterio;
	
	public CriterioRicerca getC() {
		return criterio;
	}
	public void setC(CriterioRicerca criterio) {
		this.criterio = criterio;
	}
	public ModalitaVisualizzazione getVis() {
		return mod;
	}
	public void setVis(ModalitaVisualizzazione mod) {
		this.mod = mod;
	}
	
	
}
