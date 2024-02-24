package lab06_12_17.accounts;

public interface Account {

	int deposit(int amount);

	int withdraw(int amount);

	int getBalance();

	Client getOwner();

	long getId();

	int getLimit();

	void setLimit(int limit);

}