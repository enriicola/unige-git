package TestCases.PO.Bludit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class EditUserPO extends BasePagePO{

   public EditUserPO(WebDriver driver) {
      super(driver);
   }

   public ChangePasswordPO clickChangePassword() {
      click(By.linkText("Change password"));
      return new ChangePasswordPO(driver);
   }

   public void addLinks(By id, String string, By id2, String string2) {
      type(id, string);
      type(id2, string2);
      click(By.xpath("//button[@type='submit']"));
   }

   public String getFacebook() {
      return find(By.id("jsfacebook")).getAttribute("value");
   }

   public String getInstagram() {
      return find(By.id("jsinstagram")).getAttribute("value");
   }

}
