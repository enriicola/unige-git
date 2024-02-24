// invarianti:
// (balance >= limit) && (id >= 0) && (c1==c2) == (c1.id==c2.id)
// soluzioni: this.owner!=null && this.id>=0 && this.balance>=this.limit && \forall CreditAccount c1,c2; (acc1.id==acc2.id)==(acc1==acc2)

public class CreditAccount{
// https://www.tutorialspoint.com/What-are-class-variables-instance-variables-and-local-variables-in-Java

    private static long nextId; // nel nostro non c'era
    public static final int default_limit = 0;

    // private non accessibili dalle altre classi
    public int limit; // in centesimi
    public int balance; // in centesimi 
    public final Person owner;
    public final long id; // deve essere una variabile di campo e non di oggetto 

    // metodi di classe private aux per validare le -->pre-condizioni dei metodi pubblici<-- e assicurare che gli invarianti vengano rispettati.
    private static int auxBalanceValidator(int limit, int balance){
        if(balance < limit)
            throw new IllegalArgumentException("bilancio maggiore del limite del conto");
        return limit;
    }
    // private static int requireLimitBelowBalance(int limit, int balance) {
	// 	if (limit > balance)
	// 		throw new IllegalArgumentException();
	// 	return limit;
	// } // soluzione del prof
    private static int auxIdValidator(int id){
        if(id < 0)
            throw new IllegalArgumentException();
        return id;
    }
    private static boolean auxAccountValidator(CreditAccount c1, CreditAccount c2){
        if((c1 == c2) == (c1.id==c2.id))
            return true;
        throw new IllegalArgumentException();
    }
    private static Person requireNonNull(Person p){ // non nostro, c'era nelle soluzioni
        if(p == null)
            throw new IllegalArgumentException();
        return p;
    }
    private static int requirePositive(int amount){ // non nostro, c'era nelle soluzioni. ci stava però, avremmo potuto usarlo per controllare il codice sotto
        if(amount <= 0)
            throw new IllegalArgumentException();
        return amount;
    }
    private static long nextId(){ // non nostro, c'era nelle soluzioni
        if(CreditAccount.nextId < 0)
            throw new RuntimeException("Non ci sono altri id disponibili!");
        return CreditAccount.nextId++;
    }

    // instance methods
    public int getLimit(){
        return this.limit;
    }
    public int getBalance(){
        return this.balance;
    }
    public int deposit(int amount){
        // if(amount <= 0)
        //     throw new IllegalArgumentException();
        // else
        //     this.balance = this.balance + amount;
        // return this.balance; // se non metto il return da errore...
        // soluzione del prof: //ma overflow possibile :/
        return this.balance = Math.addExact(this.balance, requirePositive(amount));
    }
    public int withdraw(int amount){
        // if(amount<=0 || (this.balance - amount < this.limit))
        //     throw new IllegalArgumentException();
        // else
        //     this.balance = this.balance - amount;
        // return this.balance; // se non metto il return da errore...
        // soluzione del prof: //ma overflow possibile :/ ... balance può essere negativo...
        int bilancioNuovo = this.balance = Math.subtractExact(this.balance, requirePositive(amount));
        auxBalanceValidator(this.limit, bilancioNuovo);
        return this.balance = bilancioNuovo;
    }
    public void setLimit(int limit){
        // if(this.balance<limit)
        //     throw new IllegalArgumentException();
        // else
        //     this.limit=limit;
        // soluzione del prof:
        this.limit = auxBalanceValidator(limit,this.balance);
    }
    
    // costruttori
    public CreditAccount(int limit, int balance, Person owner){
        // this.limit = limit;
        // this.balance = balance;
        // this.owner = owner;
        this.balance = CreditAccount.requirePositive(balance);
        this.limit = CreditAccount.auxBalanceValidator(limit, balance); // modificata aux per fargli restituire limit invece di balance, fa comunque lo stesso controllo
        this.owner = requireNonNull(owner); // siccome sono metodi di questa classe, non è obbligatorio specificarla
        this.id = nextId(); // siccome sono metodi di questa classe, non è obbligatorio specificarla
    }
    public CreditAccount(int balance, Person owner){
        // this.balance = balance;
        // this.owner = owner;
        // soluzione del prof:
        this(default_limit, balance, owner); // default_limit è var. di questa classe, non è obbligatorio specificarla
    }

    // metodi di classe (factory)
    public static CreditAccount newOfLimitBalanceOwner(int limit, int balance, Person owner){
        // if(balance < 0)
        //     throw new IllegalArgumentException();
        // CreditAccount c = new CreditAccount(limit, balance, owner);
        // return c;
        // soluzione del prof:
        return new CreditAccount(limit,balance,owner);
    }

    public static CreditAccount newOfBalanceOwner(int balance, Person owner){
        // if(balance < 0)
        //     throw new IllegalArgumentException();
        // CreditAccount c = new CreditAccount(default_limit, balance, owner);
        // return c;
        // soluzione del prof:
        return new CreditAccount(balance,owner);
    }
}