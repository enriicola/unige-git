package progetto2022_lpo21_49.visitors;

import progetto2022_lpo21_49.parser.ast.*;

public interface Visitor<T> {

	T visitArrayAcc(Exp left, Exp right);

	T visitLength(Exp exp);

	T visitMoreExp(Exp first, ExpSeq rest);

	T visitSingleExp(Exp single);

	T visitWhileStmt(Exp exp, Block thenBlock);

	T visitArrayLiteral(ExpSeq expSeq);

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
