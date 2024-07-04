package TestCases.PO.Bludit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class EditContentPO extends BasePagePO{
   public EditContentPO(WebDriver driver) {
      super(driver);
   }

   public void changeURL(String string) {
      click(By.cssSelector("[data-view='sidebar-advanced-view']"));
      clear(By.id("jsslug"));
      type(By.id("jsslug"), string);
      click(By.xpath("//button[@type='submit']"));
   }

   public void changePosition(String string) {
      click(By.cssSelector("[data-view='sidebar-advanced-view']"));
      clear(By.id("jsposition"));
      type(By.id("jsposition"), string);
      click(By.xpath("//button[@type='submit']"));
   }

   public String getPosition() {
      click(By.cssSelector("[data-view='sidebar-advanced-view']"));
      return find(By.id("jsposition")).getAttribute("value").toString();
   }

   public void changeParent() {
      click(By.cssSelector("[data-view='sidebar-advanced-view']"));
      selectDropdown(By.id("jsparent"), "Create your own content");
      click(By.xpath("//button[@type='submit']"));
   }

   public String getParent() {
      click(By.cssSelector("[data-view='sidebar-advanced-view']"));
      return find(By.xpath("id('jsparent')/option[@selected='selected']")).getText();
   }
   
   public void setSticky() {
      click(By.cssSelector("[data-view='sidebar-advanced-view']"));
      selectDropdown(By.id("jsstatus"), "Sticky");
      click(By.xpath("//button[@type='submit']"));
   }

   public ManageContentPO deleteContent() {
      click(By.id("jsdelete"));
      driver.switchTo().alert().accept();
      return new ManageContentPO(driver);
   }

}
