package TestCases.PO.MantisBT;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class ManagePO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public ManagePO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void goToManageUsers() {
        By elem = By.linkText("Manage Users");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void goToManageProjects() {
        By elem = By.linkText("Manage Projects");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_row_1tdnth_child1() {
        By elem = By.cssSelector(".row-1 > td:nth-child(1)");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void goToManageProjects_1() {
        goToManageProjects();
        set_CSSSELECTOR_row_1tdnth_child1();
    }

    public String set_CSSSELECTOR_row_1tdnth_child1_1() {
        By elem = By.cssSelector(".row-1 > td:nth-child(1)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_row_1tdnth_child2() {
        By elem = By.cssSelector(".row-1 > td:nth-child(2)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_row_1tdnth_child4() {
        By elem = By.cssSelector(".row-1 > td:nth-child(4)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_row_1tdnth_child5() {
        By elem = By.cssSelector(".row-1 > td:nth-child(5)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }
}
