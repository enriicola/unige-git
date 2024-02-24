package code;
public class Calculator {
    public static void main(String[] args) throws Exception {
        int a = 1;
        int b = 3;
        int c = sum(a,b);
        System.out.println("Il risultato è "+c);
    }

    public static int sum(int a, int b) {
        return a+b;
        // return 0;
    }

    public static int sub(int a, int b) {
        return a-b;
    }
}
