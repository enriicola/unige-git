package TestCases.PO.MantisBT;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;

import java.util.*;

public class EditIssuePO extends BasePagePO{

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public EditIssuePO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        super(driver);
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void set_NAME_priority() {
        By elem = By.name("priority");
        MyUtils.WaitForElementLoaded(driver, elem);
        // WebElement dropdown = driver.findElement(elem);
        selectDropdown(elem, "low");
    }

    // public void click_XPATH_optionlow(String key1) {
    //     By elem = By.xpath("//select[. = 'low']");
    //     MyUtils.WaitForElementLoaded(driver, elem);
    //     // dropdown.findElement(elem).click();
    //     selectDropdown(elem, key1);
    // }

    public void click_CSSSELECTOR_button() {
        By elem = By.xpath("//input[@value='Update Information']");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_width100nth_child8row_2nth_child7tdnth_child2() {
        By elem = By.cssSelector(".width100:nth-child(8) .row-2:nth-child(7) > td:nth-child(2)");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void changeIssuePriority(String key1) {
        set_NAME_priority();
        // click_XPATH_optionlow(key1);
        click_CSSSELECTOR_button();
        // set_CSSSELECTOR_width100nth_child8row_2nth_child7tdnth_child2();
    }

    public String set_CSSSELECTOR_width100nth_child8row_2nth_child7tdnth_child2_1() {
        By elem = By.xpath("//tr[7]/td[2]");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }
}
