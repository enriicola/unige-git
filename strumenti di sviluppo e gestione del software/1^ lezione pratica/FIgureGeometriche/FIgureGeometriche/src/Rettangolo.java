public class Rettangolo extends Forma{
    // attributi
    private double length, heigth;

    // costruttore
    public Rettangolo(double length, double heigth){
        this.heigth = heigth;
        this.length = length;
    }

    // metodi 
    public double area(){
        return heigth*length;
    }
    public double perimeter() {
        return (heigth+length)*2;
    }
}