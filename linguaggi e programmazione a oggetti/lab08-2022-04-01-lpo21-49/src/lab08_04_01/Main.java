package lab08_04_01;

import java.io.*;
import java.util.*;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.TreeMap;
// import java.io.BufferedReader;
// import java.io.FileNotFoundException;
// import java.io.PrintWriter;

public class Main {
	// class fields for managing options
	private static final String INPUT_OPT = "-i";
	private static final String OUTPUT_OPT = "-o";
	private static final String SORTED_OPT = "-sort";

	/* maps options to their string values, if any
	options with no argument can be null (option is not set) or an array of length 0 (option is set)
	options with argument are initialized with an array of length 1 containing null */
	private static final Map<String, String[]> options = new HashMap<>();
	static {
		options.put(INPUT_OPT, new String[1]); // one argument, initially null //declared with size
		options.put(OUTPUT_OPT, new String[1]); // one argument, initially null //declared with size
		options.put(SORTED_OPT, null); // no arguments, option not active by default
	}
	
	// stampa gli errori
	private static void error(String msg) {
	    System.err.println(msg);
       System.exit(1);
	}

	private static void processArgs(String[] args) {
      for(int i=0; i<args.length; i++){
			// controllo che il "primo" arg sia valido (una delle chiavi di options) 
			if(!options.containsKey(args[i]))
				error("Opzione non valida :(");
				
			 // controllo che il valore associato all'opzione di sopra sia null (opzione senza argomenti, -sort)
			var value = options.get(args[i]);
			if(value == null)
				options.put(args[i],new String[1]); // e gli assegno una stringa vuota, in modo che non entrerà più nell'if
			else // mi aspetto un argomento...
				if(value.length > 0){ // ...che abbia lunghezza > 0
					if(i+1 >= args.length)
               	throw new IllegalArgumentException();
					// unexpected type, required variable // options.get(args[i]) = args[++i]; // incremento prefisso (fissato "-o" devo assegnargli l'arg della posizione succ), in modo anche da saltare l'iterazione successiva (viene incrementata solo se dopo l'opzione trova qualcosa)
					value[0] = args[++i];
				}
			// if(args[i].equals(SORTED_OPT)){
			// 	if(i+1 >= args.length)
			// 		throw new IllegalArgumentException();
			// 	options.put(OUTPUT_OPT, options.get(args[i+1]));
			// }
		}
	}

	private static BufferedReader tryOpenInput(String inputPath) throws FileNotFoundException {
		BufferedReader br;
	   if(inputPath == null)
			br = new BufferedReader(new InputStreamReader(System.in));
		else
			br = new BufferedReader(new FileReader(inputPath)); // File file = new File(inputPath);
		return br;
	}

	private static PrintWriter tryOpenOutput(String outputPath) throws FileNotFoundException {
		if(outputPath == null)
			return new PrintWriter(System.out);
		
		return new PrintWriter(outputPath);
	}

	public static void main(String[] args)
	{
		processArgs(args);
		String i = options.get(INPUT_OPT)[0];
		String o = options.get(OUTPUT_OPT)[0];
		Map<String, Integer> output = null;

		try (var r = tryOpenInput(i); var pw = tryOpenOutput(o)) {
			if(options.get(SORTED_OPT) != null){
				WordCounterSorted w = new WordCounterSorted();
				output = w.countSorted(r); // ok perchè BufferReader implementa Readable, quindi sono compatibili
			}
			else{
				WordCounterUnsorted w = new WordCounterUnsorted();
				output = w.count(r);
			}
         // System.out.println(output);
         pw.println(output);
		}
		catch (IOException e) {
			error(e.getMessage());
		}
      catch (Throwable t){ // generic exception
         error(t.getMessage());
      }
	}
}