package TestCases.PO.Claroline;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class adminCourse001PO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public adminCourse001PO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void goToAgenda() {
        By elem = By.id("CLCAL");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void goToExercises() {
        By elem = By.id("CLQWZ");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void click_ID_CLQWZ() {
        By elem = By.id("CLQWZ");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
        {
            elem = By.xpath("//div[@id=\'courseRightContent\']/table/tbody/tr[2]/td[4]/a/img");
            MyUtils.WaitForElementLoaded(driver, elem);
            WebElement element = driver.findElement(elem);
            String attribute = element.getAttribute("alt");
            vars.put("alt_text", attribute);
        }
    }

    public void goToExercises_1() {
        click_ID_CLQWZ();
    }

    public void click_CSSSELECTOR_invisiblenth_child2tdnth_child4img() {
        By elem = By.cssSelector(".invisible:nth-child(2) > td:nth-child(4) img");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
        {
            elem = By.xpath("//div[@id=\'courseRightContent\']/table/tbody/tr[2]/td[4]/a/img");
            MyUtils.WaitForElementLoaded(driver, elem);
            WebElement element = driver.findElement(elem);
            String attribute = element.getAttribute("alt");
            vars.put("alt_text", attribute);
        }
    }

    public void click_CSSSELECTOR_invisiblenth_child2tdnth_child4img_1() {
        click_CSSSELECTOR_invisiblenth_child2tdnth_child4img();
    }

    public void goToModifyExercise() {
        By elem = By.cssSelector("tr:nth-child(2) > td:nth-child(2) img");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public exercisesPO goToExercises_2() {
        By elem = By.id("CLQWZ");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
        goToModifyExercise();
        return new exercisesPO(driver, js, vars);
    }
}
