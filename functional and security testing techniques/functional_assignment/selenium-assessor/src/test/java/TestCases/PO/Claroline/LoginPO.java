package TestCases.PO.Claroline;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class LoginPO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public LoginPO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void set_ID_login(String key1) {
        By elem = By.id("login");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key1);
    }

    public void set_ID_password(String key2) {
        By elem = By.id("password");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key2);
    }

    public void click_CSSSELECTOR_buttonnth_child11() {
        By elem = By.cssSelector("button:nth-child(11)");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void doLogin(String key1, String key2, boolean key3, boolean key4) {
        if (key1 != null)
            set_ID_login(key1);
        if (key2 != null)
            set_ID_password(key2);
        if (key3 != false)
            click_CSSSELECTOR_buttonnth_child11();
        if (key4 != false)
            set_CSSSELECTOR_blockHeaderuserName();
    }

    public void set_CSSSELECTOR_blockHeaderuserName() {
        By elem = By.cssSelector(".blockHeader > .userName");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public String set_CSSSELECTOR_blockHeaderuserName_1() {
        By elem = By.cssSelector(".blockHeader > .userName");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }
}
