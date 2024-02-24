public class Test {

	public static void main(String[] args) {
		Person guido = new Person("Guido", "Guerrieri");
		assert guido.name.equals("Guido");
		assert guido.surname.equals("Guerrieri");
		assert guido.socialSN == 0;
		assert guido.isSingle();
		Person lorenza = new Person("Lorenza", "Delle Foglie");
		assert lorenza.socialSN == 1;
		assert lorenza.name.equals("Lorenza");
		assert lorenza.surname.equals("Delle Foglie");
		assert lorenza.isSingle();
		Person.join(lorenza, guido);
		assert lorenza.getSpouse() == guido && guido.getSpouse() == lorenza;
		assert !lorenza.isSingle() && !guido.isSingle();
		Person.divorce(guido, lorenza);
		assert lorenza.isSingle();
		assert guido.isSingle();
		CreditAccount guidoAcc = CreditAccount.newOfBalanceOwner(10_00, guido);
		CreditAccount lorenzaAcc = CreditAccount.newOfLimitBalanceOwner(-500_00, 100_00, lorenza);
		assert guidoAcc.id == 0;
		assert guidoAcc.owner == guido;
		assert guidoAcc.getBalance() == 10_00;
		assert guidoAcc.getLimit() == 0;
		assert lorenzaAcc.id == 1;
		assert lorenzaAcc.owner == lorenza;
		assert lorenzaAcc.getBalance() == 100_00;
		assert lorenzaAcc.getLimit() == -500_00;
		assert guidoAcc.deposit(100_00) == 110_00;
		assert lorenzaAcc.deposit(200_00) == 300_00;
		assert guidoAcc.withdraw(110_00) == 0;
		
		// commenta per testare IllegalArgumentException("bilancio minore del limite del conto")
		// lorenzaAcc.setLimit(100_00);
		assert lorenzaAcc.withdraw(200_00) == 100_00;
	}

}