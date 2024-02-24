package lab10_05_06.parser.ast;

import lab10_05_06.visitors.Visitor;

public class PairLit extends BinaryOp {
	public PairLit(Exp left, Exp right) {
		super(left, right);
	}

	@Override
	public <T> T accept(Visitor<T> visitor) {
		return visitor.visitPairLit(left, right);
	}
}
