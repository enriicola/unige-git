package TestCases.PO.MantisBT;

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
        Duration timeout = Duration.ofSeconds(10);
        WebDriverWait waitFor = new WebDriverWait(driver, timeout);
        waitFor.until(new Function<WebDriver, Boolean>() {

            public Boolean apply(WebDriver driver) {
                return driver.findElement(reference).isDisplayed();
            }
        });
    }
}
