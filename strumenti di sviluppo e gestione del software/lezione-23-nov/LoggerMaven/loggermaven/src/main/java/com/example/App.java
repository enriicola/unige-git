package com.example;

import org.apache.commons.lang3.StringUtils;

/**
 * Hello world!
 *
 */
public class App {
    public static void main(String[] args) throws Exception {
        String string = "welcome to www.baeldung.com";
        int charNum = StringUtils.countMatches(string, "w");
        int stringNum = StringUtils.countMatches(string, "com");
        System.out.println("numero di w: " + charNum);
        System.out.println("numero di com: " + stringNum);
    }
}
