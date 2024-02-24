package test;
import static org.junit.Assert.assertEquals;

import org.junit.Test;

import code.Calculator;

public class CalculatorComplicateTest {
    @Test
    public void testSum() {
        assertEquals(1, Calculator.sum(0, Calculator.sum(0, 1)));
    }

    @Test
    public void testSub() {
        assertEquals(1, Calculator.sub(2, Calculator.sum(0, 1)));
    }
}
