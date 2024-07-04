import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;

public class CalculatorTest {
    Calc c;

    @BeforeEach
    public void setUp() {
        c = new Calc();
    }

    @Test
    void testSub() {
        assertEquals(1, c.sub(3, 2));

    }

    @Test
    void testSum() {
        assertEquals(5, c.sum(3, 2));
    }
}
