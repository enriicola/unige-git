package Chrome;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.junit.jupiter.api.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;

public class Helloworld {

    private WebDriver driver;

    // declaration and instantiation of objects/variables
    @BeforeAll
    static void setUpClass() {
        System.setProperty("webdriver.chrome.driver", "/opt/homebrew/bin/chromedriver");
    }

    @BeforeEach
    void setUp() {
        driver = new ChromeDriver();
    }

    @AfterEach
    void tearDown() {
        if(driver != null) driver.quit(); // close the browser
    }

    @Test
    void test1() throws InterruptedException{
        String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/";
        String expectedTitle = "Hands-On Selenium WebDriver with Java";
        String actualTitle = "";

        // launch Chrome and direct it to the Base URL
        driver.get(baseUrl);
    
        // get the actual value of the title
        actualTitle = driver.getTitle();
        Thread.sleep(3000);

        Assertions.assertEquals(expectedTitle, actualTitle);
    }

    @Test
    void test_text_input() throws InterruptedException {
        String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/web-form.html";
        driver.get(baseUrl);
        WebElement input = driver.findElement(By.id("my-text-id"));
        Thread.sleep(3000);
        input.sendKeys("ciao");
        assertEquals("ciao", input.getAttribute("value"));
        Thread.sleep(3000);
        input.clear();
        Thread.sleep(3000);
    }

    @Test
    @Disabled
    void test_disabled_input() throws InterruptedException {
        String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/web-form.html";
        driver.get(baseUrl);
        WebElement input = driver.findElement(By.name("my-disabled"));
        input.sendKeys("ciao");
        assertEquals("ciao", input.getAttribute("value"));
        Thread.sleep(3000);
    }

    @Test
    void test_read_only_input() throws InterruptedException {
        String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/web-form.html";
        driver.get(baseUrl);
        WebElement input = driver.findElement(By.name("my-readonly"));
        input.sendKeys("ciao");
        assertNotEquals("ciao", input.getAttribute("value"));
        Thread.sleep(3000);
    }

    @Test
    void test_dropdownlist_visibletext() throws InterruptedException {
        String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/web-form.html";
        driver.get(baseUrl);
        Select dropdown = new Select(driver.findElement(By.name("my-select")));
        Thread.sleep(3000);
        dropdown.selectByVisibleText("Three");
        Thread.sleep(3000);
        assertEquals("Three", dropdown.getFirstSelectedOption().getText());
    }

    @Test
    void test_datalist() throws InterruptedException {
        String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/web-form.html";
        driver.get(baseUrl);
        Thread.sleep(3000);
        WebElement datalist = driver.findElement(By.name("my-datalist"));
        datalist.click();
        Thread.sleep(3000);
        WebElement option = driver.findElement(By.xpath("//datalist/option[2]"));
        String optionValue = option.getAttribute("value");
        datalist.sendKeys(optionValue);
        Thread.sleep(3000);
        assertEquals("New York", datalist.getAttribute("value"));
    }

    @Test
    void test_check_and_radio() throws InterruptedException {
        String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/web-form.html";
        driver.get(baseUrl);
        Thread.sleep(3000);
        WebElement checkbox = driver.findElement(By.id("my-check-2"));
        checkbox.click();
        assertTrue(checkbox.isSelected());
        Thread.sleep(3000);
    }

    // @Test
    // void test_upload_file() throws InterruptedException {
    //     String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/web-form.html";
    //     driver.get(baseUrl);
    //     Thread.sleep(3000);
    //     WebElement inputFile = driver.findElement(By.name("my-file"));
    //     Path tempFile = File.createTempFile("tempfile", ".tmp"); //Type mismatch: cannot convert from File to Path
    //     inputFile.sendKeys(tempFile.toString());
    // }

    @Test
    void test_calculator_without_wait() throws InterruptedException {
        String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/slow-calculator.html";
        driver.get(baseUrl);
        Thread.sleep(3000);
        driver.findElement(By.xpath("//span[text()='1']")).click(); my_wait();
        driver.findElement(By.xpath("//span[text()='+']")).click(); my_wait();
        driver.findElement(By.xpath("//span[text()='3']")).click(); my_wait();
        driver.findElement(By.xpath("//span[text()='=']")).click(); my_wait();
        
        assertEquals("4", driver.findElement(By.className("screen")).getText());
        
    }

    public void my_wait() throws InterruptedException {
        Thread.sleep(10000);
        // driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS); // not possible with implicit wait
        // WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @Test
    void test_explicit_wait() throws InterruptedException{
        String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/loading-images.html";
        driver.get(baseUrl);
        WebDriverWait wait = new WebDriverWait(driver, 10);
        WebElement landscape = wait.until(ExpectedConditions.elementToBeClickable(By.id("landscape")));
        assertTrue(landscape.getAttribute("src").contains("landscape"));;
    }


    public static void main(String[] args) throws InterruptedException {    
            
        System.out.println("ciaooo");
    }                                                                          
}
