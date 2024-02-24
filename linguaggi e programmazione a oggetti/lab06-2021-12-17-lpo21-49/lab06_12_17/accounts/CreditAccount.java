package lab06_12_17.accounts;

/*
 * invariant owner!=null && id>=0 && balance>=limit && \forall CreditAccount c1,c2; (acc1.id==acc2.id)==(acc1==acc2)
 */


public class CreditAccount implements Account {
	private static long nextId;
	public static final int default_limit = 0; // in cents

	private int limit; // in cents
	private int balance; // in cents
	public final Client owner;
	public final long id;

	// private auxiliary class methods for validation and identifier generation

	protected static Client requireNonNull(Client c) {
		if (c == null)
			throw new NullPointerException();
		return c;
	}

	protected static int requirePositive(int amount) {
		if (amount <= 0)
			throw new IllegalArgumentException();
		return amount;
	}

	protected static int requireLimitBelowBalance(int limit, int balance) {
		if (limit > balance)
			throw new IllegalArgumentException();
		return limit;
	}

	private static long nextId() {
		if (nextId < 0)
			throw new RuntimeException("No more available ids");
		return nextId++;
	}

	// constructors

	protected CreditAccount(int limit, int balance, Client owner) {
		this.balance = requirePositive(balance);
		this.limit = requireLimitBelowBalance(limit, balance);
		this.owner = requireNonNull(owner);
		id = nextId();
	}

	protected CreditAccount(int balance, Client owner) {
		this(default_limit, balance, owner);
	}

	// factory class methods

	public static CreditAccount newOfLimitBalanceOwner(int limit, int balance, Person owner) {
		return new CreditAccount(limit, balance, owner);
	}

	public static CreditAccount newOfBalanceOwner(int balance, Person owner) {
		return new CreditAccount(balance, owner);
	}

	// object methods
	@Override
	public int deposit(int amount) { // amount in cents
		return balance = Math.addExact(balance, requirePositive(amount)); // overflow is possible
	}

	@Override
	public int withdraw(int amount) { // amount in cents
		int newBalance = Math.subtractExact(balance, requirePositive(amount)); // balance can be negative, overflow is possible!
		requireLimitBelowBalance(limit, newBalance);
		return balance = newBalance;
	}

	@Override
	public int getBalance() {
		return balance;
	}

	@Override
	public int getLimit() {
		return limit;
	}

	@Override
	public void setLimit(int limit) { // setter method
		this.limit = requireLimitBelowBalance(limit, balance);
	}

	@Override
	public Client getOwner() {
		return owner;
	}

	@Override
	public long getId() {
		return id;
	}

}
