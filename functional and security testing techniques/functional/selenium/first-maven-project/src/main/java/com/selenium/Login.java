package com.selenium;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class Login 
{
    public static void main(String[] args) throws InterruptedException {

        // declaration and instantiation of objects/variables
        
        // *** Insert HERE the settings *** 
        
        WebDriver driver = new ChromeDriver();
        String baseUrl = "https://bonigarcia.dev/selenium-webdriver-java/";
        String expectedTitle = "Hands-On Selenium WebDriver with Java";
        String actualTitle = "";
    
        // launch Chrome and direct it to the Base URL
        driver.get(baseUrl);
    
        // get the actual value of the title
        actualTitle = driver.getTitle();
        Thread.sleep(3000);
    
        // compare the actual title of the page with the expected one and print
        // the result as "Passed" or "Failed"
        if (actualTitle.contentEquals(expectedTitle)){
            System.out.println("Test Passed!");
        } else {
            System.out.println("Test Failed");
        }
    
        //close the browser
        driver.quit();
    }                                                                             
}

/*
• Add to the POM file the JUnit Jupiter dependency
    • JUnit Jupiter (Aggregator) dependency in MVN repository
• Create a LoginTest class
    • With two Test methods: testLoginOk and testLoginNotOk
• Execute the LoginTest class
• If you want deliver it in the Login Form Selenium WebDriver assignment
*/
