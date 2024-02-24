package test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import code.Business_logic.Account;
import code.Business_logic.Euro;

public class AccountTest {
    @Test
    public void testCredit() {
        Euro available = new Euro(1000, 0);
        Euro total = new Euro(1500, 0);
        Account acc = new Account(12345, 54321, available, total);
        acc.credit(200);
        Euro expectedTotal = new Euro(1700, 0);
        assertEquals(expectedTotal.getValore(), acc.getTotalBalance().getValore());
    }

    @Test
    public void testDebit() {
        Euro available = new Euro(1000, 0);
        Euro total = new Euro(1500, 0);
        Account acc = new Account(12345, 54321, available, total);
        acc.debit(200);
        Euro expectedAvailable = new Euro(800, 0);
        Euro expectedTotal = new Euro(1300, 0);
        assertEquals(expectedAvailable.getValore(), acc.getAvailableBalance().getValore());
        assertEquals(expectedTotal.getValore(), acc.getTotalBalance().getValore());
    }

    @Test
    public void testGetAccountNumber() {
        Account acc = new Account(12345, 54321, new Euro(10.0), new Euro(100.0));
        int expectedAccountNumber = 12345;

        assertEquals(expectedAccountNumber, acc.getAccountNumber());
    }

    @Test
    public void testGetAvailableBalance() {
        Account acc = new Account(12345, 54321, new Euro(12345.0), new Euro(1000000.0));
        Euro expectedBalance = new Euro(12345.0);

        // assertTrue(expectedBalance.ugualeA(acc.getAvailableBalance()));
        assertEquals(expectedBalance.getValore(), acc.getAvailableBalance().getValore()); // getValore() è già stato testato in EuroTest.java <3
    }

    @Test
    public void testGetTotalBalance() {
        Account acc = new Account(1, 1, new Euro(10), new Euro(100));
        long actual = acc.getTotalBalance().getValore();
        long expected = 10000;
        assertEquals(expected, actual);
    }

    @Test
    public void testValidatePIN() {
        int pin = 1;
        Account acc = new Account(1, pin, new Euro(10), new Euro(100));
        assertTrue(acc.validatePIN(pin));
    }
}
