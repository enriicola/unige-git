package progetto2022_lpo21_49.parser.ast;

public abstract class SimpleLiteral<T> implements Exp {

	protected final T value;

	public SimpleLiteral(T n) {
		this.value = n;
	}

	@Override
	public String toString() {
		return getClass().getSimpleName() + "(" + value + ")";
	}
}
