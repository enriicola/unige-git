package test;
import static org.junit.Assert.assertEquals;
import org.junit.Test;

import code.Calculator;

public class CalculatorTest {
    @Test
    public void testSum() {
        assertEquals(3, Calculator.sum(1,2));
    }

    @Test
    public void testSumZero() {
        assertEquals(0, Calculator.sum(0,0));
    }

    @Test
    public void testSumNegative() {
        assertEquals(-2, Calculator.sum(-1,-1));
    }
}
