package TestCases.PO.Claroline;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class User_sCoursePO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public User_sCoursePO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void enrollUser() {
        By elem = By.cssSelector("a:nth-child(3)");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }
}
