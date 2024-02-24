package lab09_04_22.parser.ast;

import static java.util.Objects.requireNonNull;

public class IfStmt implements Stmt {
	private final Exp exp; // non-optional field
	private final Block thenBlock; // non-optional field
	private final Block elseBlock; // optional field

	public IfStmt(Exp exp, Block thenBlock, Block elseBlock) {
	    // completare
	}

	public IfStmt(Exp exp, Block thenBlock) {
	    // completare
	}

	@Override
	public String toString() {
		return getClass().getSimpleName() + "(" + exp + "," + thenBlock + "," + elseBlock + ")";
	}

}
