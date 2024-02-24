import java.util.Scanner;

public class ConsoleApp {
    String name = "Console Application Bis";

    public static void main(String[] args) throws Exception {
        
        int table[] = new int[4];
        ConsoleApp myConsole = new ConsoleApp();
        System.out.println("******" + myConsole.name + "*******");
        System.out.println("Hello Everyone");
        System.out.println("Welcome to this channel");
        System.out.println("Please suscribe");
        System.out.println("This video is about Java programming");
        myConsole.readValues(table);
        myConsole.printMax(table);
        System.out.println("1");
        System.out.println("2");
        System.out.println("3");
        System.out.println("4");
        System.out.println("5");
        System.out.println("6");
        System.out.println("7");
    }

    private void readValues(int[] table) {
        Scanner scan = new Scanner(System.in);
        for (int index = 0; index < table.length; index++) {
           System.out.println("Please enter number " + (index+1) + "/" + table.length);
           table[index] = scan.nextInt();
        }
      scan.close();
    }

    private void printMax(int[] table) {
        int max = table[0];
        for (int index = 0; index < table.length; index++) {
            if (table[index] > max) 
                max = table[index];
        }
        System.out.println("the largest number is " + max);
    }
}
