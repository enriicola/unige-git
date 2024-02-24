package lab06_12_17.shapes;

public interface ShapeComparator {

	/*
	 * Confronta shape1 con shape2. Restituisce un numero negativo se shape1 è
	 * minore di shape2; zero se shape1 e shape2 sono considerate equivalenti, ma
	 * non necessariamente uguali; un numero positivo se shape1 è maggiore di
	 * shape2.
	 * 
	 * requires shape1 != null && shape2 != null
	 */

	int compare(Shape shape1, Shape shape2);
}
