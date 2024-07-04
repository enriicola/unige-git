package TestCases.PO.Bludit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class UsersPO extends BasePagePO{
   public UsersPO(WebDriver driver) {
      super(driver);
   }

   public AddNewUserPO goToAddNewUser() {
      click(By.className("uk-icon-plus"));
      return new AddNewUserPO(driver);
   }

   public String getSecondUser() {
      // get second row (first column) of the table
      return find(By.xpath("//tr[2]/td[1]")).getText();
   }

   public EditUserPO clickNthUser(int n) {
      String rowNumber = Integer.toString(n);
      By secondUser = By.xpath("//tr["+rowNumber+"]/td/a");
      click(secondUser);
      return new EditUserPO(driver);
   }
}