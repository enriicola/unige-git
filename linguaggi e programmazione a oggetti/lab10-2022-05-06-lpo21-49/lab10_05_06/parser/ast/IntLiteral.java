package lab10_05_06.parser.ast;

import lab10_05_06.visitors.Visitor;

public class IntLiteral extends SimpleLiteral<Integer> {

	public IntLiteral(int n) {
		super(n);
	}
	
	@Override
	public <T> T accept(Visitor<T> visitor) {
		return visitor.visitIntLiteral(value);
	}
}
