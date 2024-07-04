package TestCases.PO.Bludit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AddNewContentPO extends BasePagePO{

   private By titleLocator = By.id("jstitle");
   // private By contentLocator = By.id("jscontent");
   private By saveLocator = By.xpath("//button[@type='submit']");

   public AddNewContentPO(WebDriver driver) {
      super(driver);
   }

   public ManageContentPO addNewContent(String string) {
      type(titleLocator, string);
      // type(contentLocator, string2);
      
      click(saveLocator);
      return new ManageContentPO(driver);
   }

   public ManageContentPO addNewDraft(String title) {
      type(titleLocator, title);
      click(By.id("jsSaveDraft"));
      return new ManageContentPO(driver);
   }
}
