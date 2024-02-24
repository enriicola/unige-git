package lab08_04_01;

import java.lang.Readable;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class WordCounterUnsorted implements WordCounter {

	protected void count(Readable readable, Map<String, Integer> map) {
	   Scanner scanner = new Scanner(readable);
		scanner.useDelimiter("[^A-Za-z]+");
		
		String s;
		while(scanner.hasNext()){ // :(
			s = scanner.next();
			if(map.putIfAbsent(s,1) != null)
				map.replace(s, map.get(s)+1);
			// System.out.println("\n\n ->"+s);
		}
		// System.out.println("\n\n helloooooo33");
	}

	@Override
	public Map<String, Integer> count(Readable readable) {
		Map<String, Integer> dict = new HashMap<String, Integer>();
      // usando "var" invece di "Map<String, Integer>" è ancora più generale (inferred type)
		count(readable, dict);
		return dict;
	}
}
