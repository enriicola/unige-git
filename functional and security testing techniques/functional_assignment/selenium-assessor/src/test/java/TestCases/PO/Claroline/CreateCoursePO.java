package TestCases.PO.Claroline;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class CreateCoursePO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public CreateCoursePO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void set_ID_course_title(String key1) {
        By elem = By.id("course_title");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key1);
    }

    public void set_ID_course_officialCode(String key2, String key3) {
        By elem = By.id("course_officialCode");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key2);
        {
            elem = By.id("mslist2");
            MyUtils.WaitForElementLoaded(driver, elem);
            WebElement dropdown = driver.findElement(elem);
            elem = By.xpath("//option[. = '" + key3 + "']");
            MyUtils.WaitForElementLoaded(driver, elem);
            dropdown.findElement(elem).click();
        }
    }

    public void click_CSSSELECTOR_msremoveimg(String key4) {
        By elem = By.cssSelector(".msremove > img");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
        {
            elem = By.id("mslist2");
            MyUtils.WaitForElementLoaded(driver, elem);
            WebElement dropdown = driver.findElement(elem);
            elem = By.xpath("//option[. = '" + key4 + "']");
            MyUtils.WaitForElementLoaded(driver, elem);
            dropdown.findElement(elem).click();
        }
    }

    public void click_CSSSELECTOR_msremoveimg_1() {
        By elem = By.cssSelector(".msremove > img");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void click_CSSSELECTOR_ddnth_child14labelnth_child3() {
        By elem = By.cssSelector("dd:nth-child(14) > label:nth-child(3)");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void click_CSSSELECTOR_ddnth_child16labelnth_child3() {
        By elem = By.cssSelector("dd:nth-child(16) > label:nth-child(3)");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void click_NAME_changeProperties() {
        By elem = By.name("changeProperties");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_CSSSELECTOR_claroDialogMsg() {
        By elem = By.cssSelector(".claroDialogMsg");
        MyUtils.WaitForElementLoaded(driver, elem);
    }

    public void addCourse(String key1, String key2, String key3, String key4) {
        set_ID_course_title(key1);
        set_ID_course_officialCode(key2, key3);
        click_CSSSELECTOR_msremoveimg(key4);
        click_CSSSELECTOR_msremoveimg_1();
        click_CSSSELECTOR_ddnth_child14labelnth_child3();
        click_CSSSELECTOR_ddnth_child16labelnth_child3();
        click_NAME_changeProperties();
        set_CSSSELECTOR_claroDialogMsg();
    }

    public String set_CSSSELECTOR_claroDialogMsg_1() {
        By elem = By.cssSelector(".claroDialogMsg");
        MyUtils.WaitForElementLoaded(driver, elem);
        return driver.findElement(elem).getText();
    }

    public void click_LINKTEXT_Logout() {
        By elem = By.linkText("Logout");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void click_LINKTEXT_Continue() {
        By elem = By.linkText("Continue");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
        click_LINKTEXT_Logout();
    }
}
