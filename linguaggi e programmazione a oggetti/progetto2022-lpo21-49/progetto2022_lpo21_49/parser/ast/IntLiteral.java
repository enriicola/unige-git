package progetto2022_lpo21_49.parser.ast;

import progetto2022_lpo21_49.visitors.Visitor;

public class IntLiteral extends SimpleLiteral<Integer> {

	public IntLiteral(int n) {
		super(n);
	}
	
	@Override
	public <T> T accept(Visitor<T> visitor) {
		return visitor.visitIntLiteral(value);
	}
}
