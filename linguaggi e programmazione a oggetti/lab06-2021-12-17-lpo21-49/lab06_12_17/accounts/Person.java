package lab06_12_17.accounts;

/* invariant
 * name.matches(validName) && surname.matches(validName) && socialSN>=0 && spouse!=this && 
 * \forall Person p1,p2; (p1.spouse==p2) == (p2.spouse==p1) && (p1==p2) == (p1.socialSN==p2.socialSN) 
 */

public class Person implements Client {
	private static long nextSocialSN;
	private final static String validName = "[A-Z][a-z]+( [A-Z][a-z]+)*";
	public final String name;
	public final String surname;
	public final long socialSN; // social security number
	private Person spouse; // optional :)

	// private auxiliary class methods for validation and security social number generation
	
	private static Object requireNonNull(Object o) {
		if (o == null)
			throw new NullPointerException();
		return o;
	}

	private static String requireValidName(String name) {
		if (!name.matches(validName))
			throw new IllegalArgumentException("Illegal name: " + name);
		return name;
	}

	private static long nextSocialSN() {
		if (nextSocialSN < 0)
			throw new RuntimeException("No more available numbers");
		return nextSocialSN++;
	}

	// public class methods to change the civil status of couples

	public static void join(Person p1, Person p2) {
		if (p1.spouse != null || p2.spouse != null || p1 == p2)
			throw new IllegalArgumentException();
		p1.spouse = p2;
		p2.spouse = p1;
	}

	public static void divorce(Person p1, Person p2) {
		requireNonNull(p1);
		if (p1 != p2.spouse)
			throw new IllegalArgumentException();
		p1.spouse = null;
		p2.spouse = null;
	}

	// constructor

	public Person(String name, String surname) {
		this.name = requireValidName(name);
		this.surname = requireValidName(surname);
		socialSN = nextSocialSN();
	}

	// object methods

	@Override
	public Person getSpouse() {
		return spouse;
	}

	@Override
	public boolean isSingle() {
		return spouse == null;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public String getSurname() {
		return surname;
	}

	@Override
	public long getSocialSN() {
		return socialSN;
	}

}
