package TestCases.PO.Claroline;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.JavascriptExecutor;
import java.util.*;

public class addNewQuestionPO {

    WebDriver driver;

    JavascriptExecutor js;

    Map<String, Object> vars;

    public addNewQuestionPO(WebDriver driver, JavascriptExecutor js, Map<String, Object> vars) {
        this.driver = driver;
        this.js = js;
        this.vars = vars;
    }

    public void click_LINKTEXT_Newquestion() throws InterruptedException {
        By elem = By.linkText("New question");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_ID_title(String key1) throws InterruptedException {
        By elem = By.id("title");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).sendKeys(key1);
    }

    public void click_MCMA() {
        By elem = By.id("MCMA");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void click_CSSSELECTOR_divinput() {
        By elem = By.cssSelector("div > input");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void click_ID_correct_1() {
        By elem = By.id("correct_1");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_NAME_grade_1(String key2) {
        By elem = By.name("grade_1");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key2);
    }

    public void set_NAME_grade_2(String key3) {
        By elem = By.name("grade_2");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key3);
    }

    public void click_NAME_cmdOk() {
        By elem = By.name("cmdOk");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void addQuestion(String key1, String key2, String key3, boolean key4, boolean key5, boolean key6, boolean key7, boolean key8, boolean key9, boolean key10, String key11, String key12, boolean key13, boolean key14, String key15) throws InterruptedException {
        if (key4 != false)
            click_LINKTEXT_Newquestion();
        if (key1 != null)
            set_ID_title(key1);
        if (key9 != false)
            click_TF();
        if (key5 != false)
            click_MCMA();
        if (key13 != false)
            click_MCUA();
        if (key6 != false)
            click_CSSSELECTOR_divinput(); // clicks "ok" after adding the title
            
        if (key7 != false)
            click_ID_correct_1();
        if (key10 != false)
            click_ID_trueCorrect();

        if (key2 != null)
            set_NAME_grade_1(key2);
        if (key3 != null)
            set_NAME_grade_2(key3);
        if (key11 != null)
            set_NAME_trueGrade(key11);
        if (key12 != null)
            set_NAME_falseGrade(key12);
        
        if (key14 != false)
            click_NAME_cmdAddAnsw();
        if (key15 != null)
            set_NAME_grade_3(key15);

        if (key8 != false)
            click_NAME_cmdOk();
    }

    public void click_TF() throws InterruptedException {
        By elem = By.id("TF");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void click_ID_trueCorrect() {
        By elem = By.id("trueCorrect");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_NAME_trueGrade(String key2) {
        By elem = By.name("trueGrade");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key2);
    }

    public void set_NAME_falseGrade(String key3) {
        By elem = By.name("falseGrade");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key3);
    }

    public void click_MCUA() {
        By elem = By.id("MCUA");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void click_NAME_cmdAddAnsw() {
        By elem = By.name("cmdAddAnsw");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).click();
    }

    public void set_NAME_grade_3(String key3) {
        By elem = By.name("grade_3");
        MyUtils.WaitForElementLoaded(driver, elem);
        driver.findElement(elem).clear();
        driver.findElement(elem).sendKeys(key3);
    }
}
