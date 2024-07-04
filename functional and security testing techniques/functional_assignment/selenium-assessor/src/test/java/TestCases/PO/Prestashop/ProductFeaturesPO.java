package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProductFeaturesPO extends BasePagePO{

   public ProductFeaturesPO(WebDriver driver) {
         super(driver);
   }

   public AddFeaturePO goToAddFeature() {
      click(By.id("page-header-desc-feature-new_feature"));
      return new AddFeaturePO(driver);
   }
}