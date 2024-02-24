package easycoin.boundary;

import easycoin.datatype.*;
import easycoin.executor.*;

//Questa classe è inutilizzata
public class DriverFileSystem {

//	Attributi derivati da associazioni
	private AccedereEasyCatalogo DFSEC;
	private AccedereCollezione DFSC;
	private GestireEasyCatalogo DGEC;
	private GestireCollezione DGC;
	private NavigareFileSystem NFS;
	//private FileSystem DFS=null;
//	fine associazioni

	
	/*Costruttore*/
	public DriverFileSystem(){
		super();
	}
	
	public void dammiElencoStrutturato(){}
	
	public void scrivi(SequenceByte cosa,FilePath dove){}
	
	public void dammiFile(FilePath f){
		//DGEC.dammiContenutoFile(f);
	}
	
//	Metodi get e set
	public AccedereCollezione getDFSC() {
		return DFSC;
	}

	public void setDFSC(AccedereCollezione dfsc) {
		DFSC = dfsc;
	}

	public AccedereEasyCatalogo getDFSEC() {
		return DFSEC;
	}

	public void setDFSEC(AccedereEasyCatalogo dfsec) {
		DFSEC = dfsec;
	}

	public GestireCollezione getDGC() {
		return DGC;
	}

	public void setDGC(GestireCollezione dgc) {
		DGC = dgc;
	}

	public GestireEasyCatalogo getDGEC() {
		return DGEC;
	}

	public void setDGEC(GestireEasyCatalogo dgec) {
		DGEC = dgec;
	}

	public NavigareFileSystem getNFS() {
		return NFS;
	}

	public void setNFS(NavigareFileSystem nfs) {
		NFS = nfs;
	}
	
}
