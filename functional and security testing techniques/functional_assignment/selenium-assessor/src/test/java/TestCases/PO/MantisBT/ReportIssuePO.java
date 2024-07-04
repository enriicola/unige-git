package TestCases.PO.MantisBT;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class ReportIssuePO extends BasePagePO{

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public ReportIssuePO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        super(driver);
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void set_NAME_category_id() {
        By elem = By.name("category_id");
        MyUtils.WaitForElementLoaded(driver, elem);
        // WebElement dropdown = driver.findElement(elem);
        selectDropdown(elem, "Category001");
    }

    public void set_NAME_reproducibility() {
        By elem = By.name("reproducibility");
        MyUtils.WaitForElementLoaded(driver, elem);
        // WebElement dropdown = driver.findElement(elem);
        selectDropdown(elem, "random");
    }

    public void click_XPATH_optionrandom(String key2) {
        By elem = By.xpath("//select[. = 'random']");
        MyUtils.WaitForElementLoaded(driver, elem);
        // dropdown.findElement(elem).click();
        selectDropdown(elem, key2);
    }

    public void set_NAME_severity() {
        By elem = By.name("severity");
        MyUtils.WaitForElementLoaded(driver, elem);
        // WebElement dropdown = driver.findElement(elem);
        selectDropdown(elem, "crash");
    }

    public void click_XPATH_optioncrash(String key3) {
        By elem = By.xpath("//select[. = 'crash']");
        MyUtils.WaitForElementLoaded(driver, elem);
        // dropdown.findElement(elem).click();
        selectDropdown(elem, key3);
    }

    public void set_NAME_priority() {
        By elem = By.name("priority");
        MyUtils.WaitForElementLoaded(driver, elem);
        // WebElement dropdown = driver.findElement(elem);
        selectDropdown(elem, "immediate");
    }

    public void click_XPATH_optionimmediate(String key4) {
        By elem = By.xpath("//select[. = 'immediate']");
        MyUtils.WaitForElementLoaded(driver, elem);
        // dropdown.findElement(elem).click();
        selectDropdown(elem, key4);
    }

    public void set_NAME_summary(String key5) {
        By elem = By.name("summary");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key5);
    }

    public void set_NAME_description(String key6) {
        By elem = By.name("description");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key6);
    }

    public void click_CSSSELECTOR_button() {
        By elem = By.cssSelector(".button");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void reportIssue(String key1, String key2, String key3, String key4, String key5, String key6) {
        set_NAME_category_id();
        set_NAME_reproducibility();
        // click_XPATH_optionrandom(key2);
        set_NAME_severity();
        // click_XPATH_optioncrash(key3);
        set_NAME_priority();
        // click_XPATH_optionimmediate(key4);
        set_NAME_summary(key5);
        set_NAME_description(key6);
        click_CSSSELECTOR_button();
    }
}
