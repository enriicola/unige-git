package TestCases.PO.Prestashop;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class EditProductPO extends BasePagePO{

    private By saveButton = By.name("submitAddproduct");

    public EditProductPO(WebDriver driver){
        super(driver);
    }

    public BasePagePO editProduct(By id, String name) throws InterruptedException {
        clear(id);
        type(id, name);
        
        Duration d = Duration.ofSeconds(2);
        WebDriverWait w = new WebDriverWait(driver, d);
        w.until(ExpectedConditions.visibilityOfElementLocated(saveButton));
        act.scrollByAmount(0, 1000).perform();
        click(saveButton);
        return new ProductsPO(driver);
    }

}
