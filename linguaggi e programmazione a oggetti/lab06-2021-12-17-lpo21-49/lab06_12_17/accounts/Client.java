package lab06_12_17.accounts;

public interface Client {

	String getName();

	String getSurname();

	long getSocialSN();

	Person getSpouse();

	boolean isSingle();

}