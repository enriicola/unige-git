package lab09_04_22.parser.ast;

import static java.util.Objects.requireNonNull;

public class SimpleProg implements Prog {
	private final StmtSeq stmtSeq;

	public SimpleProg(StmtSeq stmtSeq) {
		this.stmtSeq = requireNonNull(stmtSeq);
	}

	@Override
	public String toString() {
		return getClass().getSimpleName() + "(" + stmtSeq + ")";
	}
}
