package lab07_03_18;

import java.util.Iterator;

public class RangeTest {

	public static void main(String[] args) {
		Range r = new Range(3);
		RangeIterator it1 = r.iterator();
		RangeIterator it2 = r.iterator();
		while (it1.hasNext()) {
			int el1 = it1.next();
			while (it2.hasNext())
				System.out.println(el1 + " " + it2.next());
			it2 = r.iterator();
		}
		assert !it1.hasNext() && !it2.hasNext();
	}
}
