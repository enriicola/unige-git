package lab06_12_17.shapes;

public class Shapes {

	/*
	 * restituisce la figura maggiore rispetto al comparator comp, null se l'array e` vuoto
	 */
	public static Shape max(Shape[] shapes, ShapeComparator comp) {
		if (shapes.length == 0)
			return null;
		Shape res = shapes[0];
		for (int i = 1; i < shapes.length; i++) {
			Shape s = shapes[i];
			if (comp.compare(s, res) > 0) // la shape corrente s ha area maggiore
				res = s;
		}
		return res;
	}

	/*
	 * trasla tutte le figure lungo il vettore (dx,dy)
	 */
	public static void moveAll(Shape[] shapes, double dx, double dy) {
		for (Shape s : shapes)
			s.move(dx, dy);
	}

	/*
	 * scala tutte le figure del fattore factor > 0, senza traslare il loro centro
	 */
	public static void scaleAll(Shape[] shapes, double factor) {
		for (Shape s : shapes)
			s.scale(factor);
	}

	/*
	 * restituisce l'area totale di tutte le figure
	 */
	public static double totalArea(Shape[] shapes) {
		double res = 0;
		for (Shape s : shapes)
			res += s.area();
		return res;
	}

}
