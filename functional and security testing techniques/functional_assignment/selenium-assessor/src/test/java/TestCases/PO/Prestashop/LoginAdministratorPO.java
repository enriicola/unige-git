package TestCases.PO.Prestashop;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginAdministratorPO extends BasePagePO{
    public LoginAdministratorPO(WebDriver driver) {
        super(driver);
        visit("http://localhost:8080/administrator");
    }

    private By usernameLocator = By.id("email");
    private By passwordLocator = By.id("passwd");
    private By submitButtonLocator = By.name("submitLogin");

    public BasePagePO DoLogin(String username, String password) {
        type(usernameLocator, username);
        type(passwordLocator, password);
        click(submitButtonLocator);
        if (getUrl().equals("http://localhost:8080/administrator")) {
            return this;
        }
        else {
            return new AdminDashboardPO(driver);
        }
    }

    
}
