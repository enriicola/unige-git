package easycoin.enumeration;

public enum Operatore {
    uguale,maggiore,maggiore_uguale,minore,minore_uguale,diverso;

        public static String[] OttieniSimboli(){
		String[]f=new String[Operatore.values().length];
		for(int i=0;i<Operatore.values().length;i++){
                    if(Operatore.values()[i].toString().equalsIgnoreCase("uguale"))
                    f[i]="=";
                    else if(Operatore.values()[i].toString().equalsIgnoreCase("maggiore"))
                    f[i]=">";
                     else if(Operatore.values()[i].toString().equalsIgnoreCase("maggiore_uguale"))
                    f[i]=">=";
                     else if(Operatore.values()[i].toString().equalsIgnoreCase("minore"))
                    f[i]="<";
                     else if(Operatore.values()[i].toString().equalsIgnoreCase("minore_uguale"))
                    f[i]="<=";
                     else if(Operatore.values()[i].toString().equalsIgnoreCase("diverso"))
                    f[i]="!=";
                }
	return f;		
	}
        
     public static Operatore converti(String s){
    	 if (s.equals("=")) return Operatore.uguale;
    	 if (s.equals(">")) return Operatore.maggiore;
    	 if (s.equals(">=")) return Operatore.maggiore_uguale;
    	 if (s.equals("<")) return Operatore.minore;
    	 if (s.equals("<=")) return Operatore.minore_uguale;
    	 if (s.equals("!=")) return Operatore.diverso;
    	 return null;
     } 
		
}