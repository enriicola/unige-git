// https://2021.aulaweb.unige.it/pluginfile.php/355472/mod_resource/content/4/2021-12-06.pdf

// NON FUNZIONA, CANCELLA E RIFAI TUTTO

import java.io.*;
import java.lang.String;
import java.util.regex.*;

public class Match {
    // serve il costruttore?    

    public static void main(String[] args){
        if(args.length<0 && args.length>7){
            System.err.println("Error! Arguments are: regex (obligatory), -s (string), int, -g (group), int, -o (output's filename), int");
            return;
        }

        // controlli su posizione degli argomenti

        String reg_ex = args[0];
        Pattern pattern;
        try {
            pattern= Pattern.compile(reg_ex);
        } catch (PatternSyntaxException exception) {
            System.err.println(exception.getDescription());
            System.exit(1);
        }
        System.out.println("Syntax is ok.");
        
        String string;
        if(args[1].equals("-s"))
            string = args[2];
        string = "";

        int group;
        if(args[3].equals("-g")){
            group = Integer.parseInt(args[4]);
            // dove group deve essere un intero corrispondente a un valido gruppo dell'argomento reg_exp
            // aggiungi try-catch
        }
        group = 0;

        String gruppo1;
        String gruppo2;
        try{
            // controlla che string appertenga a group in reg_ex
            Matcher matcher = pattern.matcher(string);
            // matcher.matches();
            matcher.matches();

            gruppo1 = matcher.group(1);
            gruppo2 = matcher.group(2);
        }
        catch(PatternSyntaxException e){
            System.err.println(e.getDescription());
            System.err.println("La stringa non appartiene a nessun gruppo dell'espressione regolare.");
            System.exit(1);
        }
        
        boolean combacia;
        switch(group){
            case 1:
                matcher = pattern.matcher(gruppo1);
                if(matcher.matches(gruppo1))
                    combacia = true;
                combacia = false;
                break;
            case 2:
                if(string.matches(gruppo1))
                    combacia = true;
                combacia = false;
                break;
        }
        
        
        // output:
        String filename;
        if(args[5].equals("-o"))
            filename = args[6];
        filename = "";

        if(filename.matches("")){
            if(combacia)
                System.out.println("String '"+string+"' matches group "+group);
            else
                System.out.println("String '"+string+"' does not match group "+group);
        }

        File file = new File(filename);
        String buffer;
        try (FileOutputStream outputStream = new FileOutputStream(file);) {
            
            if(combacia)
                buffer = "String '"+string+"' matches group "+group;
            else
                buffer = "String '"+string+"' does not match group "+group;
            
                outputStream.write(buffer, 0, buffer.length());

        }
        catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
}

    }
}
// Tests:

// java Match "([0-9]+)|([a-zA-Z]+)" -s 23 -g 1
// String '23' matches group 1

// java Match "([0-9]+)|([a-zA-Z]+)" -s 23 -g 2
// String '23' does not match group 2

// java Match "([0-9]+)|([a-zA-Z]+)" -s word -g 2
// String 'word' matches group 2

// java Match "([0-9]+)|([a-zA-Z]+)" -s word -g 1
// String 'word' does not match group 1