package vendormachine.users.util;

import static org.junit.jupiter.api.Assertions.assertAll;

import org.junit.jupiter.api.Test;

public class WalletTEST {

    @Test
    public void testAddCredit() {
        Wallet wallet = new Wallet(0.5f);
        wallet.addCredit(5.0f);
        assert(wallet.getAllCredit() == 5.5f);
    }

    @Test
    public void testGetCredit() {
        Wallet wallet = new Wallet(0.5f);
        assert(wallet.getCredit(0.5f) == 0.5f);
    }

    @Test
    public void testGetAllCredit() {
        Wallet wallet = new Wallet(0.5f);
        assertAll("Grouped assertions of getCredit() with the retrieving ", () -> {
            assert(wallet.getCredit(0.5f) == 0.5f);
            assert(wallet.getAllCredit() == 0.0f);
        });
    }

    @Test
    public void testGetBrand() {
        // generate a test method for the following code:
        // public String getBrand(String band) {
        // return this.brand;
        // }
        Wallet wallet = new Wallet("Generic", 0.5f);
        assert(wallet.getBrand("Generic") == "Generic");
    }

    @Test
    public void testSetCredit() {
        Wallet wallet = new Wallet(0.5f);
        wallet.setCredit(5.0f);
        assert(wallet.getAllCredit() == 5.0f);
    }

}
