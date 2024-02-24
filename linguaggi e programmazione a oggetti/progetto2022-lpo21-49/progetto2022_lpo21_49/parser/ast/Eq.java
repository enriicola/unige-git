package progetto2022_lpo21_49.parser.ast;

import progetto2022_lpo21_49.visitors.Visitor;

public class Eq extends BinaryOp {
	public Eq(Exp left, Exp right) {
		super(left, right);
	}

	@Override
	public <T> T accept(Visitor<T> visitor) {
		return visitor.visitEq(left, right);
	}
}
