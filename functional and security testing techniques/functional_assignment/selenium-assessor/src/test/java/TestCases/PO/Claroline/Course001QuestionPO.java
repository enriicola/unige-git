package TestCases.PO.Claroline;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class Course001QuestionPO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public Course001QuestionPO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void click_LINKTEXT_Exercise001() {
        By elem = By.linkText("Exercise 001");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_tbodynth_child2trnth_child1tdnth_child2() {
        By elem = By.cssSelector("tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void goToExercise001() {
        click_LINKTEXT_Exercise001();
        set_CSSSELECTOR_tbodynth_child2trnth_child1tdnth_child2();
    }

    public String set_CSSSELECTOR_tbodynth_child2trnth_child1tdnth_child2_1() {
        By elem = By.cssSelector("tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_trnth_child1small() {
        By elem = By.cssSelector("tr:nth-child(1) small");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_trnth_child2tdnth_child2() {
        By elem = By.cssSelector("tr:nth-child(2) > td:nth-child(2)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_trnth_child2tdnth_child4() {
        By elem = By.cssSelector("tr:nth-child(2) > td:nth-child(4)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_trnth_child3tdnth_child2() {
        By elem = By.cssSelector("tr:nth-child(3) > td:nth-child(2)");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public String set_CSSSELECTOR_trnth_child3small() {
        By elem = By.cssSelector("tr:nth-child(3) small");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }
}
