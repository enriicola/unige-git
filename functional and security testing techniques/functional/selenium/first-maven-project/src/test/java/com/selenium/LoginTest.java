package com.selenium;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

/**
 * Unit test for simple App.
 */
public class LoginTest 
{

    WebDriver driver;
    private LoginFormPO login;
    private LoginSuccessPO loginSuccess;

    @BeforeAll
    public static void setup() {
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\josea\\Downloads\\chromedriver_win32\\chromedriver.exe");
    }

    @BeforeEach
    public void setupTest() {
        driver = new ChromeDriver();
        login = new LoginFormPO(driver);
    }

    @Test
    public void testLoginOk() {
        loginSuccess = (LoginSuccessPO) login.with("user", "user");
        assertTrue(loginSuccess.successBoxIsPresent());
    }

    @Test
    public void testLoginNotOk() {
        login.with("user", "error");
        assertTrue(login.invalidBoxIsPresent());
    }
}
