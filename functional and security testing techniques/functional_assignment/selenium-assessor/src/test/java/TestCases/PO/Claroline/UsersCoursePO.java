package TestCases.PO.Claroline;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class UsersCoursePO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public UsersCoursePO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void set_ID_coursesearchbox_keyword(String key1) {
        By elem = By.id("coursesearchbox_keyword");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key1);
    }

    public void click_CSSSELECTOR_button() {
        By elem = By.cssSelector("button");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void searchCourse(String key1) {
        set_ID_coursesearchbox_keyword(key1);
        click_CSSSELECTOR_button();
    }
}
