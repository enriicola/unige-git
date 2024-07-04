package TestCases.PO.Claroline;

import java.time.Duration;
import java.util.function.Function;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public abstract class MyUtils extends BasePagePO{

    public MyUtils(WebDriver driver) {
        super(driver);
    }

    public static void WaitForElementLoaded(WebDriver driver, By reference) {
        Duration d = Duration.ofSeconds(10);
        WebDriverWait waitFor = new WebDriverWait(driver, d);
        waitFor.until(new Function<WebDriver, Boolean>() {

            public Boolean apply(WebDriver driver) {
                return driver.findElement(reference).isDisplayed();
            }
        });
    }
}
