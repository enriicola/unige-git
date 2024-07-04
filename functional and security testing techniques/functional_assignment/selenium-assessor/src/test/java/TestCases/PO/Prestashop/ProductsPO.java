package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class ProductsPO extends BasePagePO{

    private By addProductLocator = By.id("page-header-desc-product-new_product");

    public ProductsPO(WebDriver driver) {
        super(driver);
    }

    public BasePagePO goToAddProduct() {
        click(addProductLocator);
        return new AddNewProductPO(driver);
    }

    public BasePagePO goToEditProduct(String targetText) throws InterruptedException {
        WebElement editBtn = find(By.xpath("//tr[td[contains(text(), '" + targetText + "')]]//a[contains(@class, 'edit')]"));

        Thread.sleep(2000);

        editBtn.click();
        return new EditProductPO(driver);
    }

}
