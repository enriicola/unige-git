package lab11_05_13.parser.ast;

import lab11_05_13.visitors.Visitor;

public class BoolLiteral extends SimpleLiteral<Boolean> {

	public BoolLiteral(boolean b) {
		super(b);
	}
	
	@Override
	public <T> T accept(Visitor<T> visitor) {
		return visitor.visitBoolLiteral(value);
	}
}
