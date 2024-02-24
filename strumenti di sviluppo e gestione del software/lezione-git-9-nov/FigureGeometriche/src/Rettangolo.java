public class Rettangolo extends Forma {

    private double lunghezza;
    private double altezza;
    
    public Rettangolo(double lunghezza, double larghezza) {
        this.lunghezza = lunghezza;
        this.altezza = larghezza;
    }

    @Override
    public double area() {
        return lunghezza*altezza;
    }

    @Override
    public double perimetro() {
        return 2*(altezza*lunghezza);
    }
    
}
