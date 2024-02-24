public class Cerchio extends Forma {
    private double ray;

    public Cerchio(double ray) {
        this.ray = ray;
    }

    @Override
    public double area(){
        return Math.PI * Math.pow(ray, 2);
    }

    public double perimeter(){
        return extracted();
    }

    private double extracted() { // generato in automatico
        return 2*Math.PI*ray;
    }

    // public double extracted(){ // scritto a mano
        // return 2*Math.PI*ray;
    // }

    @Override
    public String toString() {
        return "Cerchio [ray=" + ray + "]";
    }    
}
