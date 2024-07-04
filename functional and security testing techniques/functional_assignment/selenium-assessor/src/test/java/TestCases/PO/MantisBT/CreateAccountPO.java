package TestCases.PO.MantisBT;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;

import java.util.*;

public class CreateAccountPO extends BasePagePO{

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public CreateAccountPO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        super(driver);
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void set_NAME_username(String key1) {
        By elem = By.name("username");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key1);
    }

    public void set_NAME_realname(String key2) {
        By elem = By.name("realname");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key2);
    }

    public void set_NAME_email(String key3) {
        By elem = By.name("email");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key3);
    }

    public void set_NAME_access_level() {
        By elem = By.name("access_level");
        MyUtils.WaitForElementLoaded(driver, elem);
        // WebElement dropdown = driver.findElement(elem);
        selectDropdown(elem, "updater");
    }

    public void click_CSSSELECTOR_button() {
        By elem = By.xpath("//input[@value='Create User']");
        // MyUtils.WaitForElementLoaded(driver, elem);
        // driver.findElement(elem).click();
        click(elem);
    }

    public void createAccount(String key1, String key2, String key3, String key4) {
        set_NAME_username(key1);
        set_NAME_realname(key2);
        set_NAME_email(key3);
        set_NAME_access_level();
        click_CSSSELECTOR_button();
    }
}
