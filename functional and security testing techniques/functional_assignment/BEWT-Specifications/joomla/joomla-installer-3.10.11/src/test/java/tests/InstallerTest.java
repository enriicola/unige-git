package java.tests;

import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import io.github.bonigarcia.wdm.WebDriverManager;


public class InstallerTest {
	
	protected WebDriver driver;
	
	@Test
	public void install() throws InterruptedException {
		WebDriverManager.chromedriver().clearDriverCache().setup();
		ChromeOptions chromeOptions = new ChromeOptions();
		chromeOptions.addArguments("--no-sandbox", "--headless", "--disable-gpu", "--window-size=1920x1080");
		driver = new ChromeDriver(chromeOptions);
		driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
		driver.manage().window().maximize();
		driver.get("http://localhost:8080");
		driver.findElement(By.id("jform_language_chzn")).click();
		driver.findElement(By.xpath("//*[@id=\"jform_language_chzn\"]/div/div/input")).sendKeys("English (United States)");
		driver.findElement(By.xpath("//*[@id=\"jform_language_chzn\"]/div/div/input")).sendKeys(Keys.ENTER);
		Thread.sleep(1000);
		driver.findElement(By.id("jform_site_name")).sendKeys("TestRigor joomla test");
		driver.findElement(By.id("jform_admin_email")).sendKeys("dario@fake.com");
		driver.findElement(By.id("jform_admin_user")).sendKeys("administrator");
		driver.findElement(By.id("jform_admin_password")).sendKeys("root");
		driver.findElement(By.id("jform_admin_password2")).sendKeys("root");
		driver.findElement(By.xpath("//*[@id=\"container-installation\"]/div/div/a")).click();
		driver.findElement(By.id("jform_db_host")).clear();
		driver.findElement(By.id("jform_db_host")).sendKeys("joomladb");
		driver.findElement(By.id("jform_db_user")).sendKeys("root");
		driver.findElement(By.id("jform_db_pass")).sendKeys("example");
		driver.findElement(By.id("jform_db_name")).sendKeys("joomla310");
		driver.findElement(By.xpath("//*[@id=\"adminForm\"]/div[1]/div/a[2]")).click();
		driver.findElement(By.id("jform_sample_file1")).click();
		driver.findElement(By.xpath("//*[@id=\"adminForm\"]/div[1]/div/a[2]")).click();
		driver.findElement(By.xpath("//*[@id=\"adminForm\"]/div[4]/div/input")).click();
		
		System.out.println("Setup complete. Remember to close the popup and hide the received messages.");
	}

}
