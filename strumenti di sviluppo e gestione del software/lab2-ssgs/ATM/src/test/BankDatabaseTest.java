package test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Before; 
import org.junit.Test;

import code.Business_logic.Account;
import code.Business_logic.Euro;
import code.Database.BankDatabase;

public class BankDatabaseTest {

    BankDatabase db;

    @Before
    public void setUp() {
        db = new BankDatabase();
    }

    @Test
    public void testAuthenticateUser() {
        assertFalse(db.authenticateUser(12348, 54326));
        assertTrue(db.authenticateUser(98765, 56789));
    }

    @Test
    public void testCredit() {
        Euro expectedBalance = new Euro(1700);

        db.credit(12345, 500.0);

        assertEquals(expectedBalance.getValore(), db.getTotalBalance(12345).getValore());
    }

    @Test
    public void testDebit() {
        Euro expectedBalance = new Euro(700);

        db.debit(12345, 500.0);

        assertEquals(expectedBalance.getValore(), db.getTotalBalance(12345).getValore());
    }

    @Test
    public void testGetAvailableBalance() {
        Euro actual = db.getAvailableBalance(12345);
        Euro expected = new Account(12345, 54321, new Euro(1000.0), new Euro(1200.0)).getAvailableBalance();
        assertEquals(expected.getValore(), actual.getValore());
    }

    @Test
    public void testGetTotalBalance() {
        Euro actual = db.getTotalBalance(12345);
        Euro expected = new Account(12345, 54321, new Euro(1000.0), new Euro(1200.0)).getTotalBalance();
        assertEquals(expected.getValore(), actual.getValore());
    }
}
