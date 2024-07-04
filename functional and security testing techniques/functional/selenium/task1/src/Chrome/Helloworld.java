package Chrome;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import org.junit.jupiter.api.Test;

import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;

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

    // @Test
    // public void testLoginOk(){
    //     System.out.println("testLoginOk");
    //     String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/";
    //     driver.get(baseUrl);
    //     System.out.println(driver.getCurrentUrl());

    //     driver.findElement(By.id("username")).sendKeys("user");
    //     driver.findElement(By.id("password")).sendKeys("user");
    //     driver.findElement(By.className("mt-2")).click();
    //     //
    //     //
    //     System.out.println(driver.getCurrentUrl());
    //     // ...

    // }

    public static void main(String[] args) throws InterruptedException {    
            
        // compare the actual title of the page with the expected one and print
        // the result as "Passed" or "Failed"
        // if (actualTitle.contentEquals(expectedTitle)){
        //     System.out.println("Test Passed!");
        // } else {
        //     System.out.println("Test Failed");
        // }
    }                                                                          
}
