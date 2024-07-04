package TestCases.PO.Claroline;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class Course001PO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public Course001PO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void click_CSSSELECTOR_bnth_child2() {
        By elem = By.cssSelector("b:nth-child(2)");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_claroDialogMsg() {
        By elem = By.cssSelector(".claroDialogMsg");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void enroll() {
        click_CSSSELECTOR_bnth_child2();
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
