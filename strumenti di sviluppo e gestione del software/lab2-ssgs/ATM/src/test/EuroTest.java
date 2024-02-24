package test;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import code.Business_logic.Euro;

public class EuroTest {

    @Test
    public void testGetValore() {
       Euro eu = new Euro(125,50);
       long exptected = 12550;
       assertEquals(exptected, eu.getValore());
    }

    @Test
    public void testMinoreDi() {
        Euro eu1 = new Euro(125,50);
        Euro eu2 = new Euro(15,70);
        boolean exptected = false;
        assertEquals(exptected, eu1.minoreDi(eu2));
    }

    @Test
    public void testSomma() {
        Euro eu = new Euro(100,55);
        Euro toSum = new Euro(10,45);
        Euro expected = new Euro(111,00);

        assertEquals(expected.getValore(), eu.somma(toSum).getValore());
    }

    @Test
    public void testSottrai() {
        Euro eu = new Euro(100,55);
        Euro toSub = new Euro(10,55);
        Euro expected = new Euro(90,00);

        assertEquals(expected.getValore(), eu.sottrai(toSub).getValore());
    }

    @Test
    public void testStampa() {
        Euro eu = new Euro(1000, 50);
        String actual = eu.stampa();
        String expected = "1000.5 euro";
        assertEquals(expected, actual);
    }

    @Test
    public void testUgualeA() {
        Euro eu = new Euro(1000, 50);
        long expected = eu.getValore();
        assertEquals(expected, 100050);
    }
}
