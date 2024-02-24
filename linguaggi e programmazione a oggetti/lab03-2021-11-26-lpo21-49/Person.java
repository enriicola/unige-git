// import javax.swing.text.StyledEditorKit.BoldAction; l'ha messa visual studio??
// invariant: 
// name!=null && surname!=null && socialSN>=0 && spouse!=this &&
// (p1.spouse==p2) == (p2.spouse==p1) && (p1==p2) == (p1.socialSN==p2.socialSN)

// 1 - Class (static) variables: First the public class variables, then the protected, and then the private.
// 2 - Instance variables: First public, then protected, and then private.
// 3 - Constructors
// 4 - Methods: These methods should be grouped by functionality rather than by scope or accessibility. For example, a private class method can be in between two public instance methods. The goal is to make reading and understanding the code easier.


public class Person{
    // variabili di classe
    private static long nextSocialSN; // non l'avevo messo :(
    private final static String validator = "[A-Z][a-z]+( [A-Z][a-z]+)*";
    
    // variabili di istanza
    public final String name;
    public final String surname;
    public final long socialSN; // deve essere una variabile di campo e non di oggetto 
    private Person spouse; // errore: l'avevo dichiarato public (btw spouse è opzionale)

    // costruttori
    public Person(String name, String surname){
        this.name = auxNameValidator(name);
        this.surname = auxNameValidator(surname);
        this.socialSN = nextSocialSN();
        // this.spouse = null; // non c'era nelle soluzioni :(
    }
    public Person(String name, String surname, Person spouse){ // non c'era nelle soluzioni :(
        this.name = auxNameValidator(name);
        this.surname = auxNameValidator(surname);
        this.socialSN = nextSocialSN();
        this.spouse = spouse;
    }

    // metodi di classe aux e privati per valitazione generazione del socialN
    private static String auxNameValidator(String name){
        if(name.matches(Person.validator))
            return name;
        throw new IllegalArgumentException(name + "non è un nome valido >:(");
    }

    // private static long auxSocialSN_Validator(long socialSN){ //mi sa che non serve il validatore per il codice fiscale...
    //     if(socialSN >= 0)
    //         return socialSN;
    //     throw new IllegalArgumentException("inserisci un codice fiscale valido!");
    // } // c'ero quasi...
    private static long nextSocialSN(){
        if(Person.nextSocialSN < 0)
            throw new RuntimeException("Non ci sono più socialN disponibili");
        return Person.nextSocialSN++;
    }
    // metodi nostri che non sono nelle soluzioni...
    private static boolean auxDifferentReferences(Object a, Object b){
        if(a == b)
            throw new IllegalArgumentException();
        return true;
    }
    private static boolean auxPersonValidator(Person p1, Person p2){
        if((p1.spouse==p2) == (p2.spouse==p1) && (p1==p2) == (p1.socialSN==p2.socialSN))
            return true;
        throw new IllegalArgumentException();
    }

    // metodi publici di classe per cambiare lo stato civile delle coppie
    // decidere sull'opportunità che join e divorce siano metodi di oggetto o di classe. (è di classe)
    public static void join(Person p1, Person p2){
        if(p1.socialSN!=p2.socialSN && p1.isSingle() && p2.isSingle()){
            p1.spouse = p2;
            p2.spouse = p1;
        }
        else
            throw new IllegalArgumentException(); //cosa crea precisamente "IllegalArgumentException"?
    }

    public static void divorce(Person p1, Person p2){
        if(p1==p2.spouse && p2==p1.spouse){
            p1.spouse = null; // lancia NullPointerException se p1 è già null
            p2.spouse = null;
        }
        else
            throw new IllegalArgumentException("errore: p1 e p2 non sono coniugi!");
    } 

    //metodi d'oggetto
    public boolean isSingle(){
        return (this.spouse == null);
    }
    public Person getSpouse(){ // mancava getSpouse :(
        return this.spouse;
    }
}