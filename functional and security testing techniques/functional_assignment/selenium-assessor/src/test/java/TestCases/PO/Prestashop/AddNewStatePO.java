package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AddNewStatePO extends BasePagePO{

   private By saveButton = By.id("state_form_submit_btn");

   public AddNewStatePO(WebDriver driver) {
      super(driver);
   }

   public BasePagePO addNewState(By nameLocator, String name, By isoCodeLocator, String isoCode, By countryLocator, By zoneLocator) throws InterruptedException {
      type(nameLocator, name);
      type(isoCodeLocator, isoCode);

      selectDropdown(countryLocator, "Italy");
      selectDropdown(zoneLocator, "Europe");

      // Select dropdown = new Select(find(countryLocator));
      // dropdown.selectByVisibleText("Italy");
      // dropdown = new Select(find(zoneLocator));
      // dropdown.selectByVisibleText("Europe");

      click(saveButton);
      return new LocalizationPO(driver);
   }

}
