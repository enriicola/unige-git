package lab10_05_06.parser.ast;

import lab10_05_06.visitors.Visitor;

public class MoreStmt extends More<Stmt, StmtSeq> implements StmtSeq {

	public MoreStmt(Stmt first, StmtSeq rest) {
		super(first, rest);
	}
	
	@Override
	public <T> T accept(Visitor<T> visitor) {
		return visitor.visitMoreStmt(first, rest);
	}
}
