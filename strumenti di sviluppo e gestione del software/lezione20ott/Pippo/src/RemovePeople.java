import java.util.ArrayList;

public class RemovePeople {
    public static void main(String[] args) {
    Person ben = new Person("Ben");
    ArrayList<Person> persons = new ArrayList<Person>(); 
    persons.add(new Person(new String("Ben")));
    persons.add(new Person(new String("Alyssa")));
    persons.add(new Person(new String("Alice")));
    // for (Person person : persons){ // non può essere fatto in modo concorrente
    for(int i=0; i<persons.size(); i++){ // soluzione all'antica
        Person person = persons.get(i);
        if (person.hasSameName(ben)) {
            persons.remove(person);
        }
    }

        System.out.println(persons);
    }
}   