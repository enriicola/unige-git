package TestCases.PO.MantisBT;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class Edit001PO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public Edit001PO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void set_CSSSELECTOR_trnth_child4inputnth_child3(String key1) {
        By elem = By.cssSelector("tr:nth-child(4) input:nth-child(3)");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key1);
    }

    public void click_CSSSELECTOR_trnth_child4button() {
        By elem = By.cssSelector("tr:nth-child(4) .button");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_tbodynth_child1row_1nth_child3tdnth_child1() {
        By elem = By.cssSelector("tbody:nth-child(1) > .row-1:nth-child(3) > td:nth-child(1)");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void addCategory(String key1, boolean key2, boolean key3, String key4, boolean key5, boolean key6) {
        if (key1 != null)
            set_CSSSELECTOR_trnth_child4inputnth_child3(key1);
        if (key2 != false)
            click_CSSSELECTOR_trnth_child4button();
        if (key3 != false)
            set_CSSSELECTOR_tbodynth_child1row_1nth_child3tdnth_child1();
        if (key4 != null)
            set_CSSSELECTOR_trnth_child5inputnth_child3(key4);
        if (key5 != false)
            click_CSSSELECTOR_trnth_child5button();
        if (key6 != false)
            set_CSSSELECTOR_trnth_child2center();
    }

    public String set_CSSSELECTOR_tbodynth_child1row_1nth_child3tdnth_child1_1() {
        By elem = By.cssSelector("tbody:nth-child(1) > .row-1:nth-child(3) > td:nth-child(1)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public void doLogout() {
        By elem = By.linkText("Logout");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_trnth_child5inputnth_child3(String key1) {
        By elem = By.cssSelector("tr:nth-child(5) input:nth-child(3)");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key1);
    }

    public void click_CSSSELECTOR_trnth_child5button() {
        By elem = By.cssSelector("tr:nth-child(5) .button");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_trnth_child2center() {
        By elem = By.cssSelector("tr:nth-child(2) .center");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public String set_CSSSELECTOR_trnth_child2center_1() {
        By elem = By.cssSelector("tr:nth-child(2) .center");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }
}
