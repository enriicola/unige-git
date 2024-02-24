package lab08_04_01;

import java.util.Map;
import java.util.TreeMap;

public class WordCounterSorted extends WordCounterUnsorted {

	@Override
	public Map<String, Integer> countSorted(Readable readable) {
		Map<String, Integer> dict = new TreeMap<String, Integer>();
      // usando "var" invece di "Map<String, Integer>" è ancora più generale (inferred type)
		count(readable, dict);
		return dict;
	}
}