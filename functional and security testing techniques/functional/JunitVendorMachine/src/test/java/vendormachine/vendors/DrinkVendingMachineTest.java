package vendormachine.vendors;

import org.junit.jupiter.api.Test;
import vendormachine.users.Person;
import vendormachine.vendors.enums.BRANDS;

public class DrinkVendingMachineTest {
    @Test
    void testGiveCredit() {
        Person person = new Person("enrico");
        DrinkVendingMachine drinkVendingMachine = new DrinkVendingMachine(0.5f, BRANDS.CaramelSprinkle);
        drinkVendingMachine.giveCredit(person, 0.5f);
        assert(drinkVendingMachine.availableCredit == 1.0f);
    }

    @Test
    void testSelectDrink() {

    }
}
