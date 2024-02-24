package lab04_12_03;

public class Circle implements Shape {
	/* invariant radius > 0 */
	public static final double defaultSize = 1;
	private double radius = Circle.defaultSize;
	private final Point center = new Point();

	/*
	 * Cerchio con centro sull'origine degli assi
	 */    
	private Circle(double radius) {
	    this.radius = radius;
	    // this.center = new Point(0,0); // come fa ad andare sull'origine degli assi?
		// l'origine non è definita, ma i double di default di java sono 0.0
	}

	private Circle(double radius, Point center) {
  	    this.radius = radius;
	    this.center.move(center.getX(),center.getY());// non posso assegnare un valore ad un final -> utilizzo un metodo per aggirare il problema
		// soluzione del prof: 
		// this(radius); // richiama il costruttore della stessa classe (quello con un arg)
		// this.center.move(center.getX(),center.getY());
	}
    
	/*
	 * Cerchio con dimensioni di default e centro sull'origine degli assi
	 */
	public Circle() {
		// basta non scrivere niente, il costruttore utilizzerà le variabili di classe
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
	
	public void move(double dx, double dy) {
	    // this.center.x += dx; // x e y sono private, utilizzo un metodo per aggirare il problema
		// this.center.y += dy;
		this.center.move(dx,dy);
		// soluzione del prof: (che NON fa la mia stessa cosa)
		// this.center.move(dx, dy);
	}

	public void scale(double factor) {		
	    this.radius *= factor;
		// soluzione del prof: (che fa la mia stessa cosa, con un controllo in più)
		// this.radius = Circle.requirePositive(factor * this.radius);
	}

	public Point getCenter() {
	    return this.center;
		// soluzione del prof: 
		// return new Point(Center); // restituisce copia per garantire onwership esclusiva
	}

	public double perimeter() {
	    return 6.28 * this.radius;
		// return 2 * Math.PI * this.radius;
	}

	public double area() {
	    return  3.14 * (this.radius*this.radius);
		// return Math.PI * this.radius * this.radius;
	}
}