package lab11_05_13.visitors;

import lab11_05_13.parser.ast.Block;
import lab11_05_13.parser.ast.Exp;
import lab11_05_13.parser.ast.Stmt;
import lab11_05_13.parser.ast.StmtSeq;
import lab11_05_13.parser.ast.Variable;

public interface Visitor<T> {
	T visitAdd(Exp left, Exp right);

	T visitAssignStmt(Variable var, Exp exp);

	T visitIntLiteral(int value);

	T visitEq(Exp left, Exp right);

	T visitMoreStmt(Stmt first, StmtSeq rest);

	T visitMul(Exp left, Exp right);

	T visitPrintStmt(Exp exp);

	T visitSimpleProg(StmtSeq stmtSeq);

	T visitSign(Exp exp);

	T visitSimpleVariable(Variable var); // the only corner case ...

	T visitSingleStmt(Stmt stmt);

	T visitVarStmt(Variable var, Exp exp);

	T visitNot(Exp exp);

	T visitAnd(Exp left, Exp right);

	T visitBoolLiteral(boolean value);

	T visitIfStmt(Exp exp, Block thenBlock, Block elseBlock);

	T visitBlock(StmtSeq stmtSeq);

	T visitPairLit(Exp left, Exp right);

	T visitFst(Exp exp);

	T visitSnd(Exp exp);
}
