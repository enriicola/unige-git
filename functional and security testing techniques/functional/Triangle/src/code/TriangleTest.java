package code;

import org.junit.jupiter.api.Test;

public class TriangleTest {
    @Test
    void testCheckType() {
        assert(new Triangle(1,1,2).CheckType() == TriangleType.INVALID);
        assert(new Triangle(2,1,1).CheckType() == TriangleType.INVALID);
        assert(new Triangle(1,2,1).CheckType() == TriangleType.INVALID);

        assert(new Triangle(-1,1,1).CheckType() == TriangleType.INVALID);
        assert(new Triangle(1,-1,1).CheckType() == TriangleType.INVALID);
        assert(new Triangle(1,1,-1).CheckType() == TriangleType.INVALID);

        assert(new Triangle(1, 1, 1).CheckType() == TriangleType.Equilateral);
        
        assert(new Triangle(2, 2, 1).CheckType() == TriangleType.Isosceles);
        assert(new Triangle(1,2,2).CheckType() == TriangleType.Isosceles);
        assert(new Triangle(2,1,2).CheckType() == TriangleType.Isosceles);
    
        assert(new Triangle(3, 4, 5).CheckType() == TriangleType.Scalene);
    }

    @Test
    void testIsRight() {
        assert(new Triangle(3, 4, 5).isRight());
        assert(!new Triangle(1, 1, 1).isRight());

        assert(new Triangle(4,3,5).isRight());
        assert(new Triangle(3,5,4).isRight());
        assert(new Triangle(5,3,4).isRight());
    }

    @Test
    void testIsValid() {
        assert(new Triangle(1, 1, 1).isValid());
        assert(new Triangle(1, 2, 2).isValid());
        assert(new Triangle(3, 4, 5).isValid());
        assert(!new Triangle(1, 1, 2).isValid());
    }
}