package TestCases.PO.Claroline;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class AdministrationPO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public AdministrationPO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void goToCreateUser() {
        By elem = By.linkText("Create user");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_ID_search_user(String key1) {
        By elem = By.id("search_user");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key1);
    }

    public void click_CSSSELECTOR_adminUserinputnth_child2() {
        By elem = By.cssSelector(".adminUser input:nth-child(2)");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_ID_L0() {
        By elem = By.id("L0");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void searchUser(String key1) {
        set_ID_search_user(key1);
        click_CSSSELECTOR_adminUserinputnth_child2();
        set_ID_L0();
    }

    public String set_ID_L0_1() {
        By elem = By.id("L0");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_tdnth_child3() {
        By elem = By.cssSelector("td:nth-child(3)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_tdnth_child6() {
        By elem = By.cssSelector("td:nth-child(6)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public void goToCreateCourse() {
        By elem = By.linkText("Create course");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_ID_search_course(String key1) {
        By elem = By.id("search_course");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key1);
    }

    public void click_CSSSELECTOR_adminCourseinputnth_child2() {
        By elem = By.cssSelector(".adminCourse input:nth-child(2)");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_ab() {
        By elem = By.cssSelector("a > b");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void searchCourse(String key1) {
        set_ID_search_course(key1);
        click_CSSSELECTOR_adminCourseinputnth_child2();
        set_CSSSELECTOR_ab();
    }

    public String set_CSSSELECTOR_ab_1() {
        By elem = By.cssSelector("a > b");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }
}
