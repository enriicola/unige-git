public class Cerchio extends Forma{
    private double ray;
    
    public Cerchio(double ray){
        this.ray = ray;
    }

    @Override
    public double area(){
        return Math.PI * Math.pow(ray, 2);
    }

    public double perimeter(){
        return extracted();
    }

    public double extracted(){
        return 2*Math.PI*ray;
    }
}
