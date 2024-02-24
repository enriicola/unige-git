package lab06_12_17.shapes;

public interface Point {

	double getX();

	double getY();

	void move(double dx, double dy);

	boolean overlaps(Point p);

}