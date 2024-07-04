package java.test;

import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.Select;

import io.github.bonigarcia.wdm.WebDriverManager;

public class InstallerTest {
	
	protected WebDriver driver;
	
	@Test
	public void install() {
		WebDriverManager.chromedriver().clearDriverCache().setup();
		ChromeOptions chromeOptions = new ChromeOptions();
		chromeOptions.addArguments("--no-sandbox", "--disable-gpu", "--window-size=1920x1080");
		driver = new ChromeDriver(chromeOptions);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.manage().window().maximize();
		driver.get("http://localhost:8080");
		driver.findElement(By.linkText("set up the wiki")).click();
		new Select(driver.findElement(By.id("uselang"))).selectByVisibleText("en - English");
		new Select(driver.findElement(By.id("ContLang"))).selectByVisibleText("en - English");
		driver.findElement(By.xpath(("//*[@id=\"bodyContent\"]/div/div[1]/div[2]/form/div[3]/input[2]"))).click();
		driver.findElement(By.xpath("//*[@id=\"bodyContent\"]/div/div[1]/div[8]/form/div/input[3]")).click();
		driver.findElement(By.id("mysql_wgDBserver")).clear();
		driver.findElement(By.id("mysql_wgDBserver")).sendKeys("database");
		driver.findElement(By.id("mysql__InstallUser")).clear();
		driver.findElement(By.id("mysql__InstallUser")).sendKeys("wikiuser");
		driver.findElement(By.id("mysql__InstallPassword")).sendKeys("example");
		driver.findElement(By.xpath("//*[@id=\"bodyContent\"]/div/div[1]/div[2]/form/div[6]/input[3]")).click();
		driver.findElement(By.xpath("//*[@id=\"bodyContent\"]/div/div[1]/div[2]/form/div/input[3]")).click();
		driver.findElement(By.id("config_wgSitename")).sendKeys("E2E Web Testing wiki");
		driver.findElement(By.id("config__AdminName")).sendKeys("admin");
		driver.findElement(By.id("config__AdminPassword")).sendKeys("Password001");
		driver.findElement(By.id("config__AdminPasswordConfirm")).sendKeys("Password001");
		driver.findElement(By.id("config__AdminEmail")).sendKeys("admin@wiki.example");
		driver.findElement(By.id("config_wgPingback")).click();
		driver.findElement(By.xpath("//*[@id=\"bodyContent\"]/div/div[1]/div[2]/form/div[7]/input[3]")).click();
		driver.findElement(By.id("config__RightsProfile_fishbowl")).click();
		WebElement disableEmail = driver.findElement(By.id("config_wgEnableEmail"));
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", disableEmail);
		disableEmail.click();
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		WebElement visualEditor = driver.findElement(By.id("config_ext-VisualEditor"));
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", visualEditor);
		driver.findElement(By.id("config_ext-CiteThisPage")).click();
		driver.findElement(By.id("config_ext-Echo")).click();
		driver.findElement(By.id("config_ext-Interwiki")).click();
		driver.findElement(By.id("config_ext-Linter")).click();
		driver.findElement(By.id("config_ext-Nuke")).click();
		driver.findElement(By.id("config_ext-ReplaceText")).click();
		driver.findElement(By.id("config_ext-WikiEditor")).click();
		driver.findElement(By.id("config_ext-VisualEditor")).click();
		driver.findElement(By.id("config_ext-CodeEditor")).click();
		driver.findElement(By.id("config__MainCacheType_none")).click();
		driver.findElement(By.xpath("//*[@id=\"bodyContent\"]/div/div[1]/div[2]/form/div[7]/input[3]")).click();
		driver.findElement(By.xpath("//*[@id=\"bodyContent\"]/div/div[1]/div[2]/form/div[3]/input[3]")).click();
		driver.findElement(By.xpath("//*[@id=\"bodyContent\"]/div/div[1]/div[2]/form/div/input[2]")).click();
		System.out.println("Setup complete. Now copy the LocalSettings.php into the container");
	}

}
