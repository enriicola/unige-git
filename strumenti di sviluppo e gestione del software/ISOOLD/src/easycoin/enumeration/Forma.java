package easycoin.enumeration;

public enum Forma {
	niente,poligono,rotonda,lobata,bucata,altro;

	public static String[] FormatoString(){
		String[]f=new String[Forma.values().length];
		for(int i=0;i<Forma.values().length;i++){
			if(!(Forma.values()[i].toString().equals("niente"))){
				f[i]=Forma.values()[i].toString();
			}else{
				f[i]="";
			}
		}
		return f;
	}

}

