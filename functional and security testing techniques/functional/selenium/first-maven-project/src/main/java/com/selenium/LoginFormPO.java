package com.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginFormPO extends BasePagePO{
    private By usernameInput = By.id("username");
    private By passwordInput = By.id("password");
    private By submitButton = By.cssSelector("button");
    private By invalidBox = By.id("invalid");
    String url = "https://bonigarcia.dev/selenium-webdriver-java/login-form.html";


    public LoginFormPO(WebDriver driver) {
        super(driver);
        visit(url);
    }

    public BasePagePO with(String username, String pwd){
        type(usernameInput, username);
        type(passwordInput, pwd);
        click(submitButton);
        if (getUrl().equals(url))
            return this;
        return new LoginSuccessPO(driver);
    }

    public boolean invalidBoxIsPresent(){
        return isIn(invalidBox);
    }
    
}