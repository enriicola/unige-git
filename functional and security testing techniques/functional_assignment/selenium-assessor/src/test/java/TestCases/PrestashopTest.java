package TestCases;

import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.openqa.selenium.By;

import TestCases.PO.Prestashop.AddAttributePO;
import TestCases.PO.Prestashop.AddFeaturePO;
import TestCases.PO.Prestashop.AddNewProductPO;
import TestCases.PO.Prestashop.AddNewStatePO;
import TestCases.PO.Prestashop.AdminDashboardPO;
import TestCases.PO.Prestashop.EditProductPO;
import TestCases.PO.Prestashop.LocalizationPO;
import TestCases.PO.Prestashop.LoginAdministratorPO;
import TestCases.PO.Prestashop.ProductAttributesPO;
import TestCases.PO.Prestashop.ProductFeaturesPO;
import TestCases.PO.Prestashop.ProductPricesPO;
import TestCases.PO.Prestashop.ProductsPO;

public class PrestashopTest extends DriverLifeCycle{
	
	@Test //1
	public void testAddNewProduct() throws InterruptedException {
		LoginAdministratorPO login = new LoginAdministratorPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.DoLogin(username, password);
		ProductsPO products = (ProductsPO) admin.goToProducts();
		AddNewProductPO addNewProduct = (AddNewProductPO) products.goToAddProduct();
		products = (ProductsPO) addNewProduct.addProduct(By.id("name_1"), "Blue Jacket3");
		By locator = By.cssSelector("div[class='alert alert-success']");
		assertTrue(!driver.findElements(locator).isEmpty());
		
		String msg = driver.findElement(locator).getText();
		String expected = "Successful creation";
		assertTrue(msg.contains(expected));
		
		base.doLogout();
	}
	
	@Test //2
	public void testAddNewProductWithoutName() throws InterruptedException {
		LoginAdministratorPO login = new LoginAdministratorPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.DoLogin(username, password);
		ProductsPO products = (ProductsPO) admin.goToProducts();
		AddNewProductPO addNewProduct = (AddNewProductPO) products.goToAddProduct();
		products = (ProductsPO) addNewProduct.addProduct(By.id("name_1"), "");
		By locator = By.cssSelector("div[class='alert alert-danger']");
		assertTrue(!driver.findElements(locator).isEmpty());
		
		String msg = driver.findElement(locator).getText();
		String expected = "2 errors";
		assertTrue(msg.contains(expected));
		
		base.doLogout();
	}
	
	@Test //3
	public void testEditProduct() throws InterruptedException {
		LoginAdministratorPO login = new LoginAdministratorPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.DoLogin(username, password);
		ProductsPO products = (ProductsPO) admin.goToProducts();
		EditProductPO editProduct = (EditProductPO) products.goToEditProduct("Blue Jacket3");
		products = (ProductsPO) editProduct.editProduct(By.id("name_1"), "Deep Blue Jacket");
		
		By locator = By.cssSelector("div[class='alert alert-success']");
		assertTrue(!driver.findElements(locator).isEmpty());
		
		String msg = driver.findElement(locator).getText();
		String expected = "Successful update";
		assertTrue(msg.contains(expected));
		
		base.doLogout();
	}
	
	@Test	//4
	public void testAddNewState() throws InterruptedException {
		LoginAdministratorPO login = new LoginAdministratorPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.DoLogin(username, password);

		LocalizationPO localization = (LocalizationPO) admin.goToLocalization();
		AddNewStatePO addNewState = (AddNewStatePO) localization.goToLocalization ();
		localization = (LocalizationPO) addNewState.addNewState(By.id("name"), "Liguria", By.id("iso_code"), "1121", By.id("id_country"), By.id("id_zone"));
		By locator = By.cssSelector("div[class='alert alert-success']");
		
		String msg = driver.findElement(locator).getText();
		String expected = "Successful creation";
		assertTrue(msg.contains(expected));
		
		base.doLogout();	
	}

	@Test	//5
	public void testAddNewEmptyState() throws InterruptedException {
		LoginAdministratorPO login = new LoginAdministratorPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.DoLogin(username, password);

		LocalizationPO localization = (LocalizationPO) admin.goToLocalization();
		AddNewStatePO addNewState = (AddNewStatePO) localization.goToLocalization ();
		localization = (LocalizationPO) addNewState.addNewState(By.id("name"), "", By.id("iso_code"), "", By.id("id_country"), By.id("id_zone"));
		By locator = By.cssSelector("div[class='alert alert-danger']");
		
		String msg = driver.findElement(locator).getText();
		String expected = "2 errors";
		assertTrue(msg.contains(expected));
		
		base.doLogout();
	}

	@Test	//6
	public void testCheckTaxes() throws InterruptedException {
		LoginAdministratorPO login = new LoginAdministratorPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.DoLogin(username, password);
		ProductsPO products = (ProductsPO) admin.goToProducts();
		AddNewProductPO addNewProduct = (AddNewProductPO) products.goToAddProduct();
		ProductPricesPO productPrices = (ProductPricesPO) addNewProduct.goToPrices();
		productPrices.addPrice("10");
		
		By finalPriceLocator = By.id("finalPrice");
		String finalPrice = driver.findElement(finalPriceLocator).getText();
		assertTrue(finalPrice.equals("12.20"));

		base.doLogout();
	}

	@Test	//7
	public void testCheckTaxes10percent() throws InterruptedException {
		LoginAdministratorPO login = new LoginAdministratorPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.DoLogin(username, password);
		ProductsPO products = (ProductsPO) admin.goToProducts();
		AddNewProductPO addNewProduct = (AddNewProductPO) products.goToAddProduct();
		ProductPricesPO productPrices = (ProductPricesPO) addNewProduct.goToPrices();
		productPrices.addPrice("10");

		productPrices.selectDropdown(By.id("id_tax_rules_group"), "IT Reduced Rate (10%)");
		
		By finalPriceLocator = By.id("finalPrice");
		String finalPrice = driver.findElement(finalPriceLocator).getText();
		assertTrue(finalPrice.equals("11.00"));

		base.doLogout();
	}

	@Test	//8
	public void testAddNewproductFeatures() throws InterruptedException{
		LoginAdministratorPO login = new LoginAdministratorPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.DoLogin(username, password);
		ProductFeaturesPO productFeature = (ProductFeaturesPO) admin.goToProductFeatures();
		AddFeaturePO addFeature = (AddFeaturePO) productFeature.goToAddFeature();
		productFeature = addFeature.addFeature("Strong");

		By locator = By.cssSelector("div[class='alert alert-success']");
		assertTrue(!driver.findElements(locator).isEmpty());
		
		String msg = driver.findElement(locator).getText();
		String expected = "Successful creation";
		assertTrue(msg.contains(expected));
		
		base.doLogout();
	}

	@Test	//9
	public void testAddEmptyproductFeatures() throws InterruptedException{
		LoginAdministratorPO login = new LoginAdministratorPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.DoLogin(username, password);
		ProductFeaturesPO productFeature = (ProductFeaturesPO) admin.goToProductFeatures();
		AddFeaturePO addFeature = (AddFeaturePO) productFeature.goToAddFeature();
		productFeature = addFeature.addFeature("");

		By locator = By.cssSelector("div[class='alert alert-danger']");
		assertTrue(!driver.findElements(locator).isEmpty());
		
		String msg = driver.findElement(locator).getText();
		String expected = "The field name is required at least in English (English).";
		assertTrue(msg.contains(expected));
		
		base.doLogout();
	}

	@Test	//10
	public void testAddNewproductAttribute() throws InterruptedException{
		LoginAdministratorPO login = new LoginAdministratorPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.DoLogin(username, password);
		ProductAttributesPO productAttribute = (ProductAttributesPO) admin.goToProductAttributes();
		AddAttributePO addAttribute = (AddAttributePO) productAttribute.goToAddAttribute();
		productAttribute = addAttribute.addAttribute("Quantity", "Qnt");

		By locator = By.cssSelector("div[class='alert alert-success']");
		assertTrue(!driver.findElements(locator).isEmpty());
		
		String msg = driver.findElement(locator).getText();
		String expected = "Successful creation";
		assertTrue(msg.contains(expected));
		
		base.doLogout();
	}
}
