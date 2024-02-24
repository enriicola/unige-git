public class Rettangolo extends Forma{
    private double length, heigth;

    public Rettangolo(double length, double heigth) {
        this.length = length;
        this.heigth = heigth;
    }

    @Override
    public double area(){
        return heigth*length;
    }
    
    public double perimeter(){
        return (heigth+length)*2;
    }

    @Override
    public String toString() {
        return "Rettangolo [length=" + length + ", heigth=" + heigth + "]";
    }
}
