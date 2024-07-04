package TestCases.PO.MantisBT;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;

import java.util.*;

public class ViewAllBugPO extends BasePagePO{

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public ViewAllBugPO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        super(driver);
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void click_LINKTEXT_ViewIssues() {
        By elem = By.linkText("View Issues");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_centernth_child6() {
        By elem = By.cssSelector(".center:nth-child(6)");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void goToViewIssues() {
        click_LINKTEXT_ViewIssues();
        set_CSSSELECTOR_centernth_child6();
    }

    public String set_CSSSELECTOR_centernth_child6_1() {
        By elem = By.cssSelector(".center:nth-child(6)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_centernth_child7() {
        By elem = By.cssSelector(".center:nth-child(7)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_leftnth_child10() {
        By elem = By.cssSelector(".left:nth-child(10)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public void doLogout() {
        By elem = By.linkText("Logout");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void click_NAME_bug_arr() {
        By elem = By.name("bug_arr[]");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_NAME_action() {
        By elem = By.name("action");
        MyUtils.WaitForElementLoaded(driver, elem);
        // WebElement dropdown = driver.findElement(elem);
        selectDropdown(elem, "Assign");
    }

    public void click_XPATH_optionAssign(String key1) {
        By elem = By.xpath("//select[. = 'Assign']");
        MyUtils.WaitForElementLoaded(driver, elem);
        // dropdown.findElement(elem).click();
        selectDropdown(elem, key1);
    }

    public void click_CSSSELECTOR_button() {
        By elem = By.xpath("//input[@value='OK']");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_centernth_child8() {
        By elem = By.cssSelector(".center:nth-child(8)");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void assignIssueToAdmin(String key1) {
        click_NAME_bug_arr();
        set_NAME_action();
        click_CSSSELECTOR_button();

        click_CSSSELECTOR_button2();

        set_CSSSELECTOR_centernth_child8();
    }

    private void click_CSSSELECTOR_button2() {
        By elem = By.xpath("//input[@value='Assign Issues']");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public String set_CSSSELECTOR_centernth_child8_1() {
        By elem = By.cssSelector(".center:nth-child(8)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public void goToEditIssue() {
        By elem = By.cssSelector("td:nth-child(2) > a > img");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }
}
