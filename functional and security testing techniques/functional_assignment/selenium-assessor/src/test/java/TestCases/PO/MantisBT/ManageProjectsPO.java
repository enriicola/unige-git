package TestCases.PO.MantisBT;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class ManageProjectsPO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public ManageProjectsPO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void goToCreateProject() {
        By elem = By.cssSelector(".form-title .button-small");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void goToManage() {
        By elem = By.linkText("Manage");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void doLogout() {
        By elem = By.linkText("Logout");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_trnth_child2td() {
        By elem = By.cssSelector("tr:nth-child(2) > td");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void goToManage_1() {
        set_CSSSELECTOR_trnth_child2td();
    }

    public String set_CSSSELECTOR_trnth_child2td_1() {
        By elem = By.cssSelector("tr:nth-child(2) > td");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public void goToEdit001() {
        By elem = By.linkText("Project001");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }
}
