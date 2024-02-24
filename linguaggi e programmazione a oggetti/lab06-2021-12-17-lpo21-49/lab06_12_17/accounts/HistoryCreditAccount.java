package lab06_12_17.accounts;

public class HistoryCreditAccount extends CreditAccount implements HistoryAccount {
        /* history > 0 means previous operation was deposit(history) 
	 * history < 0 means previous operation was withdraw(-history)
	 * history == 0 means no previous operation */
        private int history; 

        // private object method to be used in undo() and redo()
	private int operation(int amount) {
		if (amount >= 0)
			return this.deposit(amount);
		return this.withdraw(-amount);
	}

        // check to be used in undo() and redo()
				protected int requireNonZeroHistory() {
		if (this.history == 0)
			throw new IllegalStateException("Operation history is empty");
		return this.history;
	}

   protected HistoryCreditAccount(int limit, int balance, Client owner) {
      super(limit,balance,owner); // fa riferimento al costruttore della super classe CreditAccount
   }

	protected HistoryCreditAccount(int balance, Client owner) {
	   super(balance, owner);
	}

        // factory methods for the corresponding constructors
    
	public static HistoryCreditAccount newOfLimitBalance(int limit, int balance, Client owner) {
      return new HistoryCreditAccount(limit, balance, owner);
	}

	public static HistoryCreditAccount newOfBalance(int balance, Client owner) {
      return new HistoryCreditAccount(balance, owner);
	}

        // public object methods

	@Override
	public int deposit(int amount) {
      int bilancioNuovo = super.withdraw(amount);
      history = amount; // tengo nota del valore precedente del saldo del conto corrente
      return bilancioNuovo;
	}

	@Override
	public int withdraw(int amount) {
      int bilancioNuovo = super.withdraw(amount);
      history = -amount; // salvo in neg o pos per utilizzare il metodo operation()
      return bilancioNuovo;
	}

	@Override
	public long undo() {
      // operation rifà l'ultima operazione di cui ho tenuto nota con la variabile history
      // gestendo anche il segno meno o più, chiamando deposit o withdraw
      // il segno meno è perchè se voglio annullare un deposito, faccio un prelievo e viceversa

      int bilancioNuovo = operation(-requireNonZeroHistory());
      history = 0;
      return bilancioNuovo;
	}

	@Override
	public long redo() {
      // restituisce direttamente il metodo che rifà l'ultima operazione di cui ho tenuto conto
      // nella variabile history

	   return operation(requireNonZeroHistory());
	}
}
