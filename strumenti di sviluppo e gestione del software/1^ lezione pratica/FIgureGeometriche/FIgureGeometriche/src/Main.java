// https://www.nicolabovolato.it/blog/tutorial-java/ereditarieta/
public class Main {
    public static void main(String[] args) throws Exception {
        // System.out.println("Hello, World!");
        // Quadrato q = new Quadrato(10);
        // System.out.println("Area: "+q.area()+" Perimetro: "+q.perimeter());

        Forma f1 = new Cerchio(20);
        System.out.println("Area: "+f1.area()+" Perimetro: "+f1.perimeter());

        Forma f2 = new Rettangolo(10, 5);
        System.out.println("Area: "+f2.area()+" Perimetro: "+f2.perimeter());
    }
}
