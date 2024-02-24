package lab10_05_06.visitors.typechecking;

import static lab10_05_06.visitors.typechecking.SimpleType.*;

import lab10_05_06.environments.EnvironmentException;
import lab10_05_06.environments.GenEnvironment;
import lab10_05_06.parser.ast.Block;
import lab10_05_06.parser.ast.Exp;
import lab10_05_06.parser.ast.Stmt;
import lab10_05_06.parser.ast.StmtSeq;
import lab10_05_06.parser.ast.Variable;
import lab10_05_06.visitors.Visitor;

public class Typecheck implements Visitor<Type> {

	private final GenEnvironment<Type> env = new GenEnvironment<>();

	// useful to typecheck binary operations where operands must have the same type
	private void checkBinOp(Exp left, Exp right, Type type) {
		type.checkEqual(left.accept(this));
		type.checkEqual(right.accept(this));
	}

	// static semantics for programs; no value returned by the visitor

	@Override
	public Type visitSimpleProg(StmtSeq stmtSeq) {
		try {
			stmtSeq.accept(this);
		} catch (EnvironmentException e) { // undeclared variable
			throw new TypecheckerException(e);
		}
		return null;
	}

	// static semantics for statements; no value returned by the visitor

	@Override
	public Type visitAssignStmt(Variable v, Exp exp) {
	    // completare
	}

	@Override
	public Type visitPrintStmt(Exp exp) {
		exp.accept(this);
		return null;
	}

	@Override
	public Type visitVarStmt(Variable v, Exp exp) {
	    // completare
	}

	@Override
	public Type visitIfStmt(Exp exp, Block thenBlock, Block elseBlock) {
	    // completare
	}

	@Override
	public Type visitBlock(StmtSeq stmtSeq) {
	    // completare
	}

	// static semantics for sequences of statements
	// no value returned by the visitor

	@Override
	public Type visitSingleStmt(Stmt stmt) {
	    // completare
	}

	@Override
	public Type visitMoreStmt(Stmt first, StmtSeq rest) {
	    // completare
	}

	// static semantics of expressions; a type is returned by the visitor

	@Override
	public SimpleType visitAdd(Exp left, Exp right) {
		checkBinOp(left, right, INT);
		return INT;
	}

	@Override
	public SimpleType visitIntLiteral(int value) {
	    // completare
	}

	@Override
	public SimpleType visitMul(Exp left, Exp right) {
	    // completare
	}

	@Override
	public SimpleType visitSign(Exp exp) {
	    // completare
	}

	@Override
	public Type visitSimpleVariable(Variable var) {
	    // completare
	}

	@Override
	public SimpleType visitNot(Exp exp) {
		BOOL.checkEqual(exp.accept(this));
		return BOOL;
	}

	@Override
	public SimpleType visitAnd(Exp left, Exp right) {
	    // completare
	}

	@Override
	public SimpleType visitBoolLiteral(boolean value) {
	    // completare
	}

	@Override
	public SimpleType visitEq(Exp left, Exp right) {
	    // completare
	}

	@Override
	public PairType visitPairLit(Exp left, Exp right) {
	    // completare
	}

	@Override
	public Type visitFst(Exp exp) {
	    // completare
	}

	@Override
	public Type visitSnd(Exp exp) {
	    // completare
	}

}
