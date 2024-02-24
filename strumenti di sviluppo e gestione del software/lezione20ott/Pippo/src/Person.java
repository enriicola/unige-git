public class Person{
    private String name;
    
    public Person(String name){
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public boolean hasSameName(Person person){
        return person.name.equals(this.name);
    }

    @Override
    public String toString(){
        return "[Name: " + this.name + "]";
    }

    public static boolean hasNext() {
        return false;
    }
}