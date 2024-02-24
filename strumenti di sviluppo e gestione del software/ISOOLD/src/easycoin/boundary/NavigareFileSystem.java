package easycoin.boundary;

import easycoin.datatype.*;
import javax.swing.JFileChooser;
import java.io.File;
import javax.swing.filechooser.*;
import easycoin.enumeration.*;

//Questa classe fornisce le interfacce per navigare nel File System
public class NavigareFileSystem extends JFileChooser {

	private static final long serialVersionUID = 8629277342482650271L;

	private FileTree struttura;
		
//	Attributi derivati da associazioni
	private AccedereEasyCatalogo NFSEC;
	private AccedereCollezione NFSM;
	private DriverFileSystem DFS;
//	fine associazioni
	
	public NavigareFileSystem(){
		super();
		initialize();
	}
	
	private void initialize() {
		this.setAcceptAllFileFilterUsed(false);
		for (int i=0;i<TipoFile.values().length;i++){
			this.addChoosableFileFilter(getFilter(TipoFile.values()[i].toString()));
		}
	}
	
	private FileFilter getFilter(final String t){
		return new FileFilter(){
			public String getDescription(){	return t; }
			public boolean accept(File f){
				if (f.isDirectory()){
					return true;
				}
				String ext = getExtension(f);
				if (ext != null) {
					if (ext.equals(t)){
						return true;
					}
				}else {
					return false;
				}
				return false;
			}
			public String getExtension(File f) {
			String ext = null;
			String s = f.getName();
			int i = s.lastIndexOf('.');
			if (i > 0 &&  i < s.length() - 1) {
					ext = s.substring(i+1).toLowerCase();
			}
			return ext;
		}
	};	
	}

	public void aggiornaStruttura(FileTree elenco){}
	
	public void scegliFile(FilePath f){}
	
	
//	Metodi get e set

	public DriverFileSystem getDFS() {
		return DFS;
	}

	public void setDFS(DriverFileSystem dfs) {
		DFS = dfs;
	}

	public AccedereEasyCatalogo getNFSEC() {
		return NFSEC;
	}

	public void setNFSEC(AccedereEasyCatalogo nfsec) {
		NFSEC = nfsec;
	}

	public AccedereCollezione getNFSM() {
		return NFSM;
	}

	public void setNFSM(AccedereCollezione nfsm) {
		NFSM = nfsm;
	}

	public FileTree getStruttura() {
		return struttura;
	}

	public void setStruttura(FileTree struttura) {
		this.struttura = struttura;
	}
	
	
}
