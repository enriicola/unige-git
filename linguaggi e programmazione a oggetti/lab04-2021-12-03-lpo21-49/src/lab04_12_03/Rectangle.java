package lab04_12_03;

/*
 * Implementa rettangoli con lati paralleli agli assi
 */
public class Rectangle implements Shape {
	/* invariant width > 0 && height > 0 */
	public static final double defaultSize = 1;
	private double width = Rectangle.defaultSize;
	private double height = Rectangle.defaultSize;

	private final Point center = new Point();

	private static double requirePositive(double x){
		if(x <= 0)
			throw new IllegalArgumentException("Inserisci un fattore valido.");
		return x;
	}

	/*
	 * Rettangolo con centro sull'origine degli assi
	 */
	private Rectangle(double width, double height) {
		this.width = width; // sarebbe meglio controllare con requirePositive
		this.height = height; // sarebbe meglio controllare con requirePositive
		// this.center = new Point(0,0); // forse non è necessario... edit: infatti no
	}

	private Rectangle(double width, double height, Point center) {
		this(width,height); // chiamata al costruttore di sopra
		this.center.move(center.getX(),center.getY());
		// da controllare che getX e getY funzionino lo stesso senza specificare la classe di
			// appartenenza // edit: non funzionano, non aveva senso infatti
	}

	/*
	 * Rettangolo con dimensioni di default e centro sull'origine degli assi
	 */
	public Rectangle() {
		// basta non scrivere niente e utilizza l'inizializzazione delle variabili di classe
	}

	/*
	 * Factory method
	 */
	public static Rectangle ofWidthHeight(double width, double height) {
	    return new Rectangle(width, height);
	}

	/*
	 * Factory method
	 */
	public static Rectangle ofWidthHeightCenter(double width, double height, Point center) {
	    return new Rectangle(width, height, center);
	}

	public void move(double dx, double dy) {
	    // this.center.getX() += dx;
		// this.center.getY() += dy;
		this.center.move(dx, dy);
	}

	public void scale(double factor) {
	    this.height = requirePositive(factor * this.height);
		this.width = requirePositive(factor * this.width);
	}

	public Point getCenter() {
	    // return this.center;
		return new Point(this.center.getX(), this.center.getY());
	}

	public double perimeter() {
	    return 2*(this.height + this.width);
	}

	public double area() {
	    return this.height*this.width;
	}
}
