package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProductPricesPO extends BasePagePO{

   private By retailPriceField = By.id("priceTE");

   public ProductPricesPO(WebDriver driver) {
      super(driver);
   }

   public void addPrice(String price) {
      clear(retailPriceField);
      type(retailPriceField, price);
      
      // return new ProductPricesPO(driver);
   }

}
