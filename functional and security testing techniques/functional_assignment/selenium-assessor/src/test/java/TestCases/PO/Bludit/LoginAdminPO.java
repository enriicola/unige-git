package TestCases.PO.Bludit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginAdminPO extends BasePagePO{

   public LoginAdminPO(WebDriver driver) {
      super(driver);
      visit("http://localhost:8080/admin");
   }
   
   private By usernameLocator = By.name("username");
   private By passwordLocator = By.name("password");
   private By loginButton = By.cssSelector(".uk-button");
   // uk-width-1-1 uk-button uk-button-primary uk-button-large

    public BasePagePO doLogin(String username, String password) {
        type(usernameLocator, username);
        type(passwordLocator, password);
        click(loginButton);
        if (getUrl().equals("http://localhost:8080/admin")) 
            return this;
        else
            return new AdminDashboardPO(driver);
      }
}
