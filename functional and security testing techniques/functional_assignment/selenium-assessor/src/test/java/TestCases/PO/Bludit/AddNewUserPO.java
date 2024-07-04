package TestCases.PO.Bludit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AddNewUserPO extends BasePagePO{
   public AddNewUserPO(WebDriver driver) {
      super(driver);
   }

   public UsersPO addUser(String username, String password, String email, String role) {
      type(By.id("jsnew_username"), username);
      type(By.id("jsnew_password"), password);
      type(By.id("jsconfirm_password"), password);
      type(By.id("jsemail"), email);
      selectDropdown(By.id("jsrole"), role);
      click(By.xpath("//button[@type='submit']"));
      return new UsersPO(driver);
   }
}
