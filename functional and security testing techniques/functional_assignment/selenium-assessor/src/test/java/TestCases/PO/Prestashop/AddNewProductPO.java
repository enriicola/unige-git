package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class AddNewProductPO extends BasePagePO{

    private By saveButton = By.name("submitAddproduct");

    public AddNewProductPO(WebDriver driver) {
        super(driver);
    }

    public BasePagePO addProduct(By productNameLocator,String productName) throws InterruptedException {
        w.until(ExpectedConditions.visibilityOfElementLocated(productNameLocator));
        
        type(productNameLocator, productName);

        // act.scrollByAmount(0, 1000).perform();
        scrollToEnd();

        click(saveButton);

        return new ProductsPO(driver);
    }

    public BasePagePO goToPrices(){
        By locator = By.id("link-Prices");
        click(locator);
        return new ProductPricesPO(driver);
    }
}
