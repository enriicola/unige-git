package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AdminDashboardPO extends BasePagePO{
    private By CatalogLocator = By.id("maintab-AdminCatalog");
    private By LocalizationLocator = By.id("maintab-AdminParentLocalization");

    public AdminDashboardPO(WebDriver driver) {
        super(driver);
    }

    public BasePagePO goToProducts() throws InterruptedException {
        hover(CatalogLocator);
        Thread.sleep(2000);
        click(By.id("subtab-AdminProducts"));
        return new ProductsPO(driver);
    }

    public BasePagePO goToLocalization() throws InterruptedException {
        Thread.sleep(2000);
        hover(LocalizationLocator);
        Thread.sleep(2000);
        click(By.id("subtab-AdminStates"));
        return new LocalizationPO(driver);
    }

   public ProductFeaturesPO goToProductFeatures() throws InterruptedException {
        hover(CatalogLocator);
        Thread.sleep(2000);
        click(By.id("subtab-AdminFeatures"));
        return new ProductFeaturesPO(driver);
   }

    public ProductAttributesPO goToProductAttributes() throws InterruptedException {
        hover(CatalogLocator);
        Thread.sleep(2000);
        click(By.id("subtab-AdminAttributesGroups"));
        return new ProductAttributesPO(driver);
    }
}
