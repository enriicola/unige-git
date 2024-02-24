package lab04_12_03;

/*
 * Classe singleton, ossia con una sola istanza.
 * 
 * Confronta le figure basandosi sulle loro aree.
 */

public class AreaComparator implements ShapeComparator 
{

	public static final AreaComparator instance = new AreaComparator();

	private static Shape requireNonNull(Shape s){ // non presente nelle soluzioni del prof
		if(s == null)
			throw new NullPointerException("Le shape non possono essere vuote!");
		return s;
	} // dove la devo utilizzare?

	private AreaComparator() { // costruttore vuoto/nullo
	}

	/* requires shape1 != null && shape2 != null */    
	public int compare(Shape shape1, Shape shape2) {
		// Nota che: in questo caso, siccome shape è un oggetto con informazioni di tipo int, 
		// non ci sono problemi per fare il confronto; è comunque sconsigliabile il confronto
		// diretto tra gli oggetti
		if(shape1.area() < shape2.area())
			return -1;
		else
			if(shape1.area() == shape2.area())
				return 0; 
			else 
				return 1;

		//soluzione del prof: (versione molto abbreviata della mia)
		// return area1 < area2 ? -1 : area1 == area2 ? 0 : 1;
	}

}
