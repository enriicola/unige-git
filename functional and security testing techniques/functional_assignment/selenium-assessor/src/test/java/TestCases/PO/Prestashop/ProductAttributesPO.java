package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProductAttributesPO extends BasePagePO{

   public ProductAttributesPO(WebDriver driver) {
         super(driver);
   }

   public AddAttributePO goToAddAttribute() {
      click(By.id("page-header-desc-attribute_group-new_attribute_group"));
      return new AddAttributePO(driver);
   }
}