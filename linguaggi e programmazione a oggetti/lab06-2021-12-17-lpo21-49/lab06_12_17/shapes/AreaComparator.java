package lab06_12_17.shapes;


/*
 * Classe singleton, ossia con una sola istanza.
 * 
 * Confronta le figure basandosi sulle loro aree.
 */

public class AreaComparator implements ShapeComparator {

	public static final AreaComparator instance = new AreaComparator();

	private AreaComparator() {
	}

	/* requires shape1 != null && shape2 != null */
	public int compare(Shape shape1, Shape shape2) {
		double area1 = shape1.area();
		double area2 = shape2.area();
		/*
		 * Remark: since area1, area2 >=0, in this case there are no problems with
		 * under/overflow of subtraction; anyway it is always advisable avoiding
		 * subtraction in comparators
		 */
		return area1 < area2 ? -1 : area1 == area2 ? 0 : 1;
	}

}
