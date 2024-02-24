package lab10_05_06.parser.ast;

import lab10_05_06.visitors.Visitor;

public class BoolLiteral extends SimpleLiteral<Boolean> {

	public BoolLiteral(boolean b) {
		super(b);
	}
	
	@Override
	public <T> T accept(Visitor<T> visitor) {
		return visitor.visitBoolLiteral(value);
	}
}
