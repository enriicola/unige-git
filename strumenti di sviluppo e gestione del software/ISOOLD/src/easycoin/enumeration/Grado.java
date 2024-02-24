package easycoin.enumeration;

public enum Grado {
proof,uncirculated,extremely_fine,very_fine,fine,very_good,good,almost_good;

	public static String[] GradotoString(){
		String[]g=new String[Grado.values().length];
		for(int i=0;i<Grado.values().length;i++){
			g[i]=Grado.values()[i].toString();
		}
		return g;
	}
}
