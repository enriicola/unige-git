package lab06_12_17.shapes;

public class Circle extends AbstractShape {
	/* invariant radius > 0 */
	private double radius = Circle.defaultSize;
    
        // private object method to be used in the constructors
	private void setRadius(double radius) {
		this.radius = requirePositive(radius);
	}

	/*
	 * Cerchio con centro sull'origine degli assi
	 */
	protected Circle(double radius) {
	   setRadius(radius);
	}

	protected Circle(double radius, Point center) {
	   // this(radius);
		// super.center.move(center.getX(),center.getY());
      // soluzione del prof:
      super(center); // chiamo il costruttore della superclasse
      setRadius(radius);
	}

	/*
	 * Cerchio con dimensioni di default e centro sull'origine degli assi
	 */
	public Circle() {
	}

	/*
	 * Factory method
	 */
	public static Circle ofRadius(double radius) {
	   return new Circle(radius);
	}

	/*
	 * Factory method
	 */
	public static Circle ofRadiusCenter(double radius, Point center) {
	   return new Circle(radius, center);
	}

	@Override
	public void scale(double factor) {
	   this.radius = Circle.requirePositive(factor * this.radius);
	}

	@Override
	public double perimeter() {
	   return 2 * Math.PI * this.radius;
	}

	@Override
	public double area() {
	   return Math.PI * this.radius * this.radius;
	}

}
