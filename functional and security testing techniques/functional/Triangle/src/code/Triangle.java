package code;

public class Triangle {

	private float a, b, c;

	// Constructor
	public Triangle(float a, float b, float c) {
		this.a = a;
		this.b = b;
		this.c = c;
	}

	// returns if the triangle is valid
	public boolean isValid() {
		return (CheckType() != TriangleType.INVALID);
	}

	// returns : true if and only if this triangle is a right triangle.
	public boolean isRight() {
		double square1 = a * a;
		double square2 = b * b;
		double square3 = c * c;

		if ((square1 == square2 + square3) || (square2 == square1 + square3) || (square3 == square1 + square2))
			return true;
		else
			return false;
	}

	// returns the type of the triangle (also INVALID)
	public TriangleType CheckType() {

		if (a <= 0 || b <= 0 || c <= 0)
			return TriangleType.INVALID;

		if (a < b + c && b < a + c && c < a + b) {
			if (a == b && b == c) {
				System.out.println("Equilateral triangle");
				return TriangleType.Equilateral;
			} else if (a == b || b == c || c == a) {
				System.out.println("Isosceles triangle");
				return TriangleType.Isosceles;
			} else {
				System.out.println("Scalene triangle");
				return TriangleType.Scalene;
			}
		} else {
			System.out.println("Cannot form a triangle");
			return TriangleType.INVALID;
		}
	}
}
