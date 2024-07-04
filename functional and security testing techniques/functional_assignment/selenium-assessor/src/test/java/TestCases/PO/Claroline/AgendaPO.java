package TestCases.PO.Claroline;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class AgendaPO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public AgendaPO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void addEvent(String key1, String key2, String key3, String key4) {
        By elem = By.id("title");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key1);
        {
            elem = By.id("fday");
            MyUtils.WaitForElementLoaded(driver, elem);
            WebElement dropdown = driver.findElement(elem);
            elem = By.xpath("//option[. = '" + key2 + "']");
            MyUtils.WaitForElementLoaded(driver, elem);
            dropdown.findElement(elem).click();
        }
        {
            elem = By.id("fmonth");
            MyUtils.WaitForElementLoaded(driver, elem);
            WebElement dropdown = driver.findElement(elem);
            elem = By.xpath("//option[. = '" + key3 + "']");
            MyUtils.WaitForElementLoaded(driver, elem);
            dropdown.findElement(elem).click();
        }
        {
            elem = By.id("fyear");
            MyUtils.WaitForElementLoaded(driver, elem);
            WebElement dropdown = driver.findElement(elem);
            elem = By.xpath("//option[. = '" + key4 + "']");
            MyUtils.WaitForElementLoaded(driver, elem);
            dropdown.findElement(elem).click();
        }
    }

    public void click_CSSSELECTOR_fyearoptionnth_child2() {
        By elem = By.cssSelector("#fyear > option:nth-child(2)");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_ID_location(String key5) {
        By elem = By.id("location");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key5);
    }

    public void click_NAME_submitEvent() {
        By elem = By.name("submitEvent");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_claroDialogMsg() {
        By elem = By.cssSelector(".claroDialogMsg");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void goToAddEvent(String key1, String key2, String key3, String key4, String key5) {
        By elem = By.linkText("Add an event");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
        addEvent(key1, key2, key3, key4);
        click_CSSSELECTOR_fyearoptionnth_child2();
        set_ID_location(key5);
        click_NAME_submitEvent();
        set_CSSSELECTOR_claroDialogMsg();
    }

    public String set_CSSSELECTOR_claroDialogMsg_1() {
        By elem = By.cssSelector(".claroDialogMsg");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public void doLogout() {
        By elem = By.linkText("Logout");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }
}
