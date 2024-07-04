package TestCases.PO.Bludit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ManageContentPO extends BasePagePO{

   private By firstPublished = By.xpath("//tr[td[text()='Published']]/following-sibling::tr[1]/td/a");
   private By firstDraft = By.xpath("//tr[td[text()='Draft']]/following-sibling::tr[1]/td/a");
   private By firstSticky = By.xpath("//tr[td[text()='sticky']]/following-sibling::tr[1]/td/a");

   public ManageContentPO(WebDriver driver) {
      super(driver);
   }

   public String getFirstPublishedContent() {
      return find(firstPublished).getText();
   }

   public EditContentPO clickContent(String string) {
      By locator = By.linkText(string);
      click(locator);
      return new EditContentPO(driver);
   }

   public String getURLof(String string) {
      By locator = By.xpath("//tr[contains(., '" + string + "')]/td[3]");
      return find(locator).getText();
   }

   public String getFirstDraftContent() {
      return find(firstDraft).getText();
   }

   // public EditContentPO clickSetUpYourNewSite(String string) {
   //    click(By.xpath("//tr[contains(., '" + string + "')]/td[1]"));
   //    return new EditContentPO(driver);
   // }

   public String getFirstStickyContent() {
      return find(firstSticky).getText();
   }
}
