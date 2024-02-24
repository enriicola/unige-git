package lab06_12_17.shapes;

public abstract class AbstractShape implements Shape {

	private final Point center = new PointClass();

	protected static final double defaultSize = 1;

	protected static double requirePositive(double size) {
	   if(size <= 0)
			throw new IllegalArgumentException("Inserisci un valore positivo.");
		return size;
	}

	protected AbstractShape(Point center) {
	   // this.center = Point.move(0, 0);
      center.move(center.getX(), center.getY());
	}

	protected AbstractShape() {
	}

	@Override
	public void move(double dx, double dy) {
	   // this.center.getX() += dx;
      center.move(dx,dy);
	}

	@Override
	public Point getCenter() {
	   return this.center;
	}

}
