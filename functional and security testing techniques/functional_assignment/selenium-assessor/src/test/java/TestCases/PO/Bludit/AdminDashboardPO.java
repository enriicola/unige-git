package TestCases.PO.Bludit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AdminDashboardPO extends BasePagePO{

   public AdminDashboardPO(WebDriver driver) {
      super(driver);
   }

   public AddNewContentPO clickAddNewContent() {
      click(By.className("uk-icon-pencil"));
      return new AddNewContentPO(driver);
   }

   public ManageContentPO clickContent() {
      // By locator = By.xpath("//a[@href='/admin/content']");
      // By.xpath("//tr[td[text()='Published']]/following-sibling::tr[1]/td/a");
      By locator = By.xpath("//ul[@class='uk-nav']/li[6]/a");

      click(locator);
      // Thread.sleep(2000);
      return new ManageContentPO(driver);
   }

   public UsersPO clickUsers() {
      click(By.xpath("//ul[@class='uk-nav']/li[8]/a"));
      return new UsersPO(driver);
   }

}
