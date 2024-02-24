public class Main {
    public static void main(String[] args) throws Exception {
        System.out.println("Hello, World!");

        Forma f1 = new Cerchio(20);
        System.out.println("Area: "+f1.area()+" Perimetro: "+f1.perimeter());

        Forma f2 = new Rettangolo(10, 5);
        System.out.println("Area: "+f2.area()+" Perimetro: "+f2.perimeter());

        System.out.println("\n testf1: "+f1.toString());
        System.out.println("\n testf2: "+f2.toString());
    }
}
