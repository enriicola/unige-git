package lab11_05_13.parser.ast;

import lab11_05_13.visitors.Visitor;

public class IntLiteral extends SimpleLiteral<Integer> {

	public IntLiteral(int n) {
		super(n);
	}
	
	@Override
	public <T> T accept(Visitor<T> visitor) {
		return visitor.visitIntLiteral(value);
	}
}
