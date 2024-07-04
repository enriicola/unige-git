package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LocalizationPO extends BasePagePO {

   private By addStateLocator = By.className("process-icon-new");

   public LocalizationPO(WebDriver driver){
      super(driver);
   }

   public BasePagePO goToLocalization() {
      click(addStateLocator);
      return new AddNewStatePO(driver);
  }

}
