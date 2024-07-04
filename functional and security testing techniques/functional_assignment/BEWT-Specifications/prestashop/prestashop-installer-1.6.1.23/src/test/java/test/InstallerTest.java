package java.test;

import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.Select;

import io.github.bonigarcia.wdm.WebDriverManager;

public class InstallerTest {
	
	protected WebDriver driver;
	
	@Test
	public void install() throws InterruptedException {
		WebDriverManager.chromedriver().clearDriverCache().setup();
		ChromeOptions chromeOptions = new ChromeOptions();
		chromeOptions.addArguments("--no-sandbox", "--disable-gpu", "--window-size=1920x1080");
		driver = new ChromeDriver(chromeOptions);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.manage().window().maximize();
		driver.get("http://localhost:8080/install/");
		new Select(driver.findElement(By.id("langList"))).selectByVisibleText("English (English)");
		driver.findElement(By.id("btNext")).click();
		driver.findElement(By.id("set_license")).click();
		driver.findElement(By.id("btNext")).click();
		driver.findElement(By.id("infosShop")).sendKeys("E2E Web Testing store");
		driver.findElement(By.id("infosActivity_chosen")).click();
		driver.findElement(By.xpath("//*[@id=\"infosActivity_chosen\"]/div/div/input")).sendKeys("Computer");
		driver.findElement(By.xpath("//*[@id=\"infosActivity_chosen\"]/div/div/input")).sendKeys(Keys.ENTER);
		driver.findElement(By.id("infosFirstname")).sendKeys("Dario");
		driver.findElement(By.id("infosName")).sendKeys("Olianas");
		driver.findElement(By.id("infosEmail")).sendKeys("admin@prestashop.com");
		driver.findElement(By.id("infosPassword")).sendKeys("password");
		driver.findElement(By.id("infosPasswordRepeat")).sendKeys("password");
		driver.findElement(By.id("btNext")).click();
		driver.findElement(By.id("dbServer")).clear();
		driver.findElement(By.id("dbServer")).sendKeys("some-mysql");
		driver.findElement(By.id("dbPassword")).sendKeys("admin");
		driver.findElement(By.id("btTestDB")).click();
		Thread.sleep(5000);
		driver.findElement(By.id("btCreateDB")).click();
		Thread.sleep(5000);
		driver.findElement(By.id("btNext")).click();
		
		System.out.println("Setup complete. Now: \n1) access the container using docker exec -it some-prestashop bash\n 2) remove directory \"install\"\n 3) rename \"admin\" directory to \"administrator\" ");
	}

}
