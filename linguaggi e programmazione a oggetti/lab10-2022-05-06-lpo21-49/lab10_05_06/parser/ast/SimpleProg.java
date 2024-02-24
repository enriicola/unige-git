package lab10_05_06.parser.ast;

import static java.util.Objects.requireNonNull;

import lab10_05_06.visitors.Visitor;

public class SimpleProg implements Prog {
	private final StmtSeq stmtSeq;

	public SimpleProg(StmtSeq stmtSeq) {
		this.stmtSeq = requireNonNull(stmtSeq);
	}

	@Override
	public String toString() {
		return getClass().getSimpleName() + "(" + stmtSeq + ")";
	}
	
	@Override
	public <T> T accept(Visitor<T> visitor) {
		return visitor.visitSimpleProg(stmtSeq);
	}
}
