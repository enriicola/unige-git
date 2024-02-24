package lab11_05_13.visitors.execution;

import java.io.PrintWriter;

import lab11_05_13.environments.EnvironmentException;
import lab11_05_13.environments.GenEnvironment;
import lab11_05_13.parser.ast.Block;
import lab11_05_13.parser.ast.Exp;
import lab11_05_13.parser.ast.Stmt;
import lab11_05_13.parser.ast.StmtSeq;
import lab11_05_13.parser.ast.Variable;
import lab11_05_13.visitors.Visitor;

import static java.util.Objects.requireNonNull;

public class Execute implements Visitor<Value> {

	private final GenEnvironment<Value> env = new GenEnvironment<>();
	private final PrintWriter printWriter; // output stream used to print values

	public Execute() {
		printWriter = new PrintWriter(System.out, true);
	}

	public Execute(PrintWriter printWriter) {
		this.printWriter = requireNonNull(printWriter);
	}

	// dynamic semantics for programs; no value returned by the visitor

	@Override
	public Value visitSimpleProg(StmtSeq stmtSeq) {
		try {
			stmtSeq.accept(this);
			// possible runtime errors
			// EnvironmentException: undefined variable
		} catch (EnvironmentException e) {
			throw new InterpreterException(e);
		}
		return null;
	}

	// dynamic semantics for statements; no value returned by the visitor

	@Override
	public Value visitAssignStmt(Variable var, Exp exp) {
	    // completare
	}

	@Override
	public Value visitPrintStmt(Exp exp) {
		printWriter.println(exp.accept(this));
		return null;
	}

	@Override
	public Value visitVarStmt(Variable var, Exp exp) {
	    // completare
	}

	@Override
	public Value visitIfStmt(Exp exp, Block thenBlock, Block elseBlock) {
	    // completare
	}

	@Override
	public Value visitBlock(StmtSeq stmtSeq) {
	    // completare
	}

	// dynamic semantics for sequences of statements
	// no value returned by the visitor

	@Override
	public Value visitSingleStmt(Stmt stmt) {
	    // completare
	}

	@Override
	public Value visitMoreStmt(Stmt first, StmtSeq rest) {
	    // completare
	}

	// dynamic semantics of expressions; a value is returned by the visitor

	@Override
	public IntValue visitAdd(Exp left, Exp right) {
		return new IntValue(left.accept(this).toInt() + right.accept(this).toInt());
	}

	@Override
	public IntValue visitIntLiteral(int value) {
	    // completare
	}

	@Override
	public IntValue visitMul(Exp left, Exp right) {
	    // completare
	}

	@Override
	public IntValue visitSign(Exp exp) {
	    // completare
	}

	@Override
	public Value visitSimpleVariable(Variable var) {
	    // completare
	}

	@Override
	public BoolValue visitNot(Exp exp) {
		return new BoolValue(!exp.accept(this).toBool());
	}

	@Override
	public BoolValue visitAnd(Exp left, Exp right) {
	    // completare
	}

	@Override
	public BoolValue visitBoolLiteral(boolean value) {
	    // completare
	}

	@Override
	public BoolValue visitEq(Exp left, Exp right) {
	    // completare
	}

	@Override
	public PairValue visitPairLit(Exp left, Exp right) {
	    // completare
	}

	@Override
	public Value visitFst(Exp exp) {
	    // completare
	}

	@Override
	public Value visitSnd(Exp exp) {
	    // completare
	}

}

