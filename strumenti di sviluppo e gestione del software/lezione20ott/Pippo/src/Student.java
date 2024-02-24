public class Student extends Person {
    private String grade;
    private String daysAttended;

    public Student(String name, String grade, String daysAttended) { 
        super(name);
        this.grade = grade;
        this.daysAttended = daysAttended;
    }

    public static void main(String[] args) {
        // Person persons = null;
        // for (Person p : persons) {
            
        // }
        Student s = new Student("pippo", "-A", "47");
        System.out.println("voto old: "+s.grade+"\tdaysOld: "+s.daysAttended);
        s.inflateGrade();
        s.boostAttendance();
        System.out.println("voto new: "+s.grade+"\tdaysNew: "+s.daysAttended);
    }

    public void inflateGrade(){
        // this.grade.replace("-", "+"); // le Stringhe sono immutabili!!!
        this.grade = this.grade.replace("-", "+");
    }

    public void boostAttendance(){
        int foo = Integer.parseInt(this.daysAttended);
        // foo += 2;
        this.daysAttended = String.valueOf(foo+2);

    }
    
    @Override
    public String toString(){
        return "[Name: " + this.getName() + ", Grade: "+this.grade+ ", Days attended; " + this.daysAttended + "]";
    }
}