package easycoin.datatype;

import easycoin.enumeration.*;

//FATTO
public class FilePath {

	private String path;
	
	public TipoFile tipo(){
		String ext = null;
		int i = path.lastIndexOf('.');
		if (i > 0 &&  i < path.length() - 1) {
				ext = path.substring(i+1).toLowerCase();
		}
		for (int j=0;j<TipoFile.values().length;j++)
			if (TipoFile.values()[j].toString().equals(ext)) return TipoFile.values()[j];
		return null;
	}
	
	public FilePath(String s){
		this.path=s;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
}
