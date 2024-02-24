package lab06_12_17.shapes;

/*
 * Implementa rettangoli con lati paralleli agli assi
 */
public class Rectangle extends AbstractShape {
	/* invariant width > 0 && height > 0 */
	private double width = Rectangle.defaultSize;
	private double height = Rectangle.defaultSize;

         // private object method to be used in the constructors   
	private void setWidthHeight(double width, double height) {
		this.width = requirePositive(width);
		this.height = requirePositive(height);
	}

	/*
	 * Rettangolo con centro sull'origine degli assi
	 */
	protected Rectangle(double width, double height) {
	   setWidthHeight(width, height);
	}

	protected Rectangle(double width, double height, Point center) {
	   super(center);
      setWidthHeight(width, height);
	}

	/*
	 * Rettangolo con dimensioni di default e centro sull'origine degli assi
	 */
	public Rectangle() {
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

	@Override
	public void scale(double factor) {
	   this.height = requirePositive(factor * this.height);
		this.width = requirePositive(factor * this.width);
	}

	@Override
	public double perimeter() {
	   return 2*(this.height + this.width);
	}

	@Override
	public double area() {
	   return this.height*this.width;
	}

}
