package TestCases.PO.Bludit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ChangePasswordPO extends BasePagePO {

   public ChangePasswordPO(WebDriver driver) {
      super(driver);
   }

   public UsersPO changePsw(String psw) {
      type(By.id("jsnew_password"), psw);
      type(By.id("jsconfirm_password"), psw);
      click(By.xpath("//button[@type='submit']"));
      return new UsersPO(driver);
   }

}
