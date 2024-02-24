package progetto2022_lpo21_49.visitors.execution;

public class BoolValue extends SimpleValue<Boolean> {

	public BoolValue(Boolean value) {
		super(value);
	}

	@Override
	public boolean toBool() {
		return value;
	}

}
