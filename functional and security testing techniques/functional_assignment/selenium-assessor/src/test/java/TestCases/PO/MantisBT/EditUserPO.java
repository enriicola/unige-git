package TestCases.PO.MantisBT;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class EditUserPO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public EditUserPO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void click_LINKTEXT_ManageUsers() {
        By elem = By.linkText("Manage Users");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_row_1tdnth_child1() {
        By elem = By.cssSelector(".row-1 > td:nth-child(1)");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void goToManageUser(boolean key1, boolean key2, boolean key3) {
        if (key1 != false)
            click_LINKTEXT_ManageUsers();
        if (key2 != false)
            set_CSSSELECTOR_row_1tdnth_child1();
        if (key3 != false)
            set_CSSSELECTOR_trnth_child2center();
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

    public String set_CSSSELECTOR_row_1tdnth_child3() {
        By elem = By.cssSelector(".row-1 > td:nth-child(3)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_row_1tdnth_child4() {
        By elem = By.cssSelector(".row-1 > td:nth-child(4)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String goToManageUser_1() {
        By elem = By.xpath("//p");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
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
