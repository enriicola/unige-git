package lab04_12_03;

public class Shapes {

	private static Shape requireNonNull(Shape s){
		if(s == null)
			// throw new IllegalArgumentExeption("Le shape non possono essere vuote!");
			throw new NullPointerException("Le shape non possono essere vuote!");
		return s;
		
	}
	private static double requirePositive(double x){
		if(x <= 0)
			throw new IllegalArgumentException("Inserisci un argomento valido.");
		return x;
	}

	/*
	 * restituisce la prima figura maggiore o uguale alle altre in shapes rispetto al comparator comp,
	 * null se shapes e` vuoto
	 * requires shapes != null && comp != null
	 */
	public static Shape max(Shape[] shapes, ShapeComparator comp) {
		if(comp == null)
			throw new NullPointerException();
		for(int i=0; i<shapes.length; i++)
			if(shapes[i] == null)
				return null;

		Shape maxx = shapes[0];
		// comp = shapes[0];

		for(int i=0; i<shapes.length; i++)
			if(comp.compare(shapes[i], maxx) == 1)
				maxx = shapes[i];

		return maxx;
	}

	/*
	 * trasla tutte le figure lungo il vettore (dx,dy)
	 * requires shapes != null
	 */
	public static void moveAll(Shape[] shapes, double dx, double dy) {
		for(int i=0; i<shapes.length; i++)
			requireNonNull(shapes[i]).move(dx,dy);
	}
    
	/*
	 * scala tutte le figure del fattore factor, senza traslare il loro centro
	 * requires shapes != null && factor > 0
	 */
	public static void scaleAll(Shape[] shapes, double factor) {
		requirePositive(factor);
		for(int i=0; i<shapes.length; i++)
			requireNonNull(shapes[i]).scale(factor);
	}
    
	/*
	 * restituisce l'area totale di tutte le figure in shapes
	 * requires shapes != null
	 */
	public static double totalArea(Shape[] shapes) {
		double tot = 0;
		for(int i=0; i<shapes.length; i++)
			tot *= requireNonNull(shapes[i]).area();

		return tot;
	}
}
