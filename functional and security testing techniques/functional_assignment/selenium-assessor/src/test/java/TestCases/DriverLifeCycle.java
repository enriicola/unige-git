package TestCases;

import java.time.Duration;
import org.junit.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

// import TestCases.PO.Prestashop.BasePagePO;
import TestCases.PO.Bludit.BasePagePO;

public class DriverLifeCycle {
    protected WebDriver driver;
    protected BasePagePO base;
    protected static String username;
    protected static String password;

    @BeforeClass
    public static void beforeAll() {
        //System.setProperty("webdriver.chrome.driver", "");
    }

    @Before
    public void BeforeEach() {
        driver = new FirefoxDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
        base = new BasePagePO(driver);
        // username = "admin@prestashop.com";
        // password = "password";
    }

    @After
    public void AfterEach() {
        if (driver != null) {
            driver.quit();
        }
    }
}
