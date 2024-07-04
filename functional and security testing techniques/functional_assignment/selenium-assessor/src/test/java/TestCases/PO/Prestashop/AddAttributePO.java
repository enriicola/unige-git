package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AddAttributePO extends BasePagePO{

   public AddAttributePO(WebDriver driver) {
      super(driver);
   }

   public ProductAttributesPO addAttribute(String name, String publicName) throws InterruptedException {
      type(By.id("name_1"), name);
      type(By.id("public_name_1"), publicName);
      
      click(By.id("attribute_group_form_submit_btn"));
      return new ProductAttributesPO(driver);
   }

}