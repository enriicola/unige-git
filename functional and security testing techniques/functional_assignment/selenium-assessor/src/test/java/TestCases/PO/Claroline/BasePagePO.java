package TestCases.PO.Claroline;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public class BasePagePO {

    protected WebDriver driver;
    Duration d = Duration.ofSeconds(10);
    WebDriverWait w;
    Actions act;

    public BasePagePO(WebDriver driver) {
        this.driver = driver;
        w = new WebDriverWait(driver, d);
        act = new Actions(driver);
    }

    public void visit(String url) {
        driver.get(url);
    }

    public WebElement find(By element) {
        return driver.findElement(element);
    }

    public void click(By element) {
        find(element).click();
    }
    
    public void type(By element, String text) {
        find(element).sendKeys(text);
    }
    public boolean isIn (By element) {
        return find(element).isDisplayed();
    }

    public String getUrl() {
        return driver.getCurrentUrl();
    }

    public void hover(By element) {
        Actions actions = new Actions(driver);
        actions.moveToElement(find(element)).perform();
    }

    public void doLogout() {
        click(By.id("employee_infos"));
        click(By.id("header_logout"));
    }

    public void clear(By element) {
        find(element).clear();
    }

    public void scrollToEnd() {
        act.moveToElement(find(By.tagName("body"))).perform();
        act.sendKeys(org.openqa.selenium.Keys.END).perform();
    }

    public void selectDropdown(By element, String value) {
        Select dropdown = new Select(driver.findElement(element));
        dropdown.selectByVisibleText(value);
    }
}