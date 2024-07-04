package TestCases.PO.MantisBT;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;

import java.util.*;

public class CreateProjectPO extends BasePagePO{

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public CreateProjectPO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        super(driver);
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void set_NAME_name(String key1) {
        By elem = By.name("name");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key1);
    }

    public void set_NAME_status() {
        By elem = By.name("status");
        MyUtils.WaitForElementLoaded(driver, elem);
        // WebElement dropdown = driver.findElement(elem);
        selectDropdown(elem, "release");
    }

    public void set_NAME_description(String key3) {
        By elem = By.name("description");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key3);
    }

    public void click_CSSSELECTOR_button() {
        By elem = By.cssSelector(".button");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void createProject(String key1, String key2, String key3) {
        set_NAME_name(key1);
        set_NAME_status();
        set_NAME_description(key3);
        click_CSSSELECTOR_button();
    }
}
