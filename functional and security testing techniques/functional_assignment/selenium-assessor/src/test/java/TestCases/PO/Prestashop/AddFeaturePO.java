package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AddFeaturePO extends BasePagePO{

   public AddFeaturePO(WebDriver driver) {
      super(driver);
   }

   public ProductFeaturesPO addFeature(String name) {
      type(By.id("name_1"), name);
      click(By.id("feature_form_submit_btn"));
      return new ProductFeaturesPO(driver);
   }

}
