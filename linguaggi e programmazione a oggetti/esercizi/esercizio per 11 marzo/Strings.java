public class Strings{

    public static String catAll(CharSequence... args){
        StringBuilder s = new StringBuilder();
        for(int i = 0; i < args.length; i++) //utilizza ciclo piu compatto for each
            s.append(args[i]);

        return s.toString();
    }

    public static void main(String args[]){
        System.out.println("Hello World");
        
        assert Strings.catAll().equals("");
        assert Strings.catAll("Hello", " ", "world", "!").equals("Hello world!");
        assert Strings.catAll("Hello", " ", null, "!").equals("Hello null!");
    }
}