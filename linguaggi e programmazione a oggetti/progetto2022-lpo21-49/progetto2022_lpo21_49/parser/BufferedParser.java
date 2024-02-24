package progetto2022_lpo21_49.parser;

import static java.util.Objects.requireNonNull;
import static progetto2022_lpo21_49.parser.TokenType.*;
import static java.lang.System.err;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;

import progetto2022_lpo21_49.parser.ast.*;


/*
Prog ::= StmtSeq EOF
StmtSeq ::= Stmt (';' StmtSeq)?
Stmt ::= 'var'? IDENT '=' Exp | 'print' Exp |  'if' '(' Exp ')' Block ('else' Block)? | 'while' '(' Exp ')' Block
Block ::= '{' StmtSeq '}'
Exp ::= And (',' And)*
And ::= Eq ('&&' Eq)*
Eq ::= Add ('==' Add)*
Add ::= Mul ('+' Mul)*
Mul::= Unary ('*' Unary)*
Unary ::= 'fst' Unary | 'snd' Unary | '-' Unary | '!' Unary | 'length' Unary | AtomOrArrayAcc
AtomOrArrayAcc ::= Atom ('[' Exp ']')?
Atom ::= BOOL | NUM | IDENT | '(' Exp ')' | '[' ExpSeq ']'
ExpSeq ::= Exp (';' ExpSeq)?
 */

public class BufferedParser implements Parser {

	private final BufferedTokenizer buf_tokenizer; // the buffered tokenizer used by the parser

	/*
	 * reads the next token through the buffered tokenizer associated with the
	 * parser; TokenizerExceptions are chained into corresponding ParserExceptions
	 */
	private void nextToken() throws ParserException {
		try {
			buf_tokenizer.next();
		} catch (TokenizerException e) {
			throw new ParserException(e);
		}
	}

	// decorates error message with the corresponding line number
	private String line_err_msg(String msg) {
		return "on line " + buf_tokenizer.getLineNumber() + ": " + msg;
	}

	/*
	 * checks whether the token type of the currently recognized token matches
	 * 'expected'; if not, it throws a corresponding ParserException
	 */
	private void match(TokenType expected) throws ParserException {
		final var found = buf_tokenizer.tokenType();
		if (found != expected)
			throw new ParserException(line_err_msg(
					"Expecting " + expected + ", found " + found + "('" + buf_tokenizer.tokenString() + "')"));
	}

	/*
	 * checks whether the token type of the currently recognized token matches
	 * 'expected'; if so, it reads the next token, otherwise it throws a
	 * corresponding ParserException
	 */
	private void consume(TokenType expected) throws ParserException {
		match(expected);
		nextToken();
	}

	// throws a ParserException because the current token was not expected
	private void unexpectedTokenError() throws ParserException {
		throw new ParserException(line_err_msg(
				"Unexpected token " + buf_tokenizer.tokenType() + "('" + buf_tokenizer.tokenString() + "')"));
	}

	// associates the parser with a corresponding non-null buffered tokenizer
	public BufferedParser(BufferedTokenizer tokenizer) {
		this.buf_tokenizer = requireNonNull(tokenizer);
	}

	/* parses a program
	 * Prog ::= StmtSeq EOF
	 */
	@Override
	public Prog parseProg() throws ParserException {
		nextToken(); // one look-ahead symbol
		var prog = new SimpleProg(parseStmtSeq());
		match(EOF); // last token must have type EOF
		return prog;
	}

	@Override
	public void close() throws IOException {
		if (buf_tokenizer != null)
			buf_tokenizer.close();
	}

	/* parses a non empty sequence of statements, MoreStmt binary operator is right associative
	 * StmtSeq ::= Stmt (';' StmtSeq)? 
	 */
	private StmtSeq parseStmtSeq() throws ParserException {
		var stmt = parseStmt();
		if (buf_tokenizer.tokenType() == STMT_SEP) {
			nextToken();
			return new MoreStmt(stmt, parseStmtSeq());
		}
		return new SingleStmt(stmt);
	}

	/* parses a statement
	 * Stmt ::= 'var'? IDENT '=' Exp | 'print' Exp |  'if' '(' Exp ')' Block ('else' Block)? | 'while' '(' Exp ')' Block

	 */
	private Stmt parseStmt() throws ParserException {
		switch (buf_tokenizer.tokenType()) {
			default:
				unexpectedTokenError();
			case PRINT:
				return parsePrintStmt();
			case VAR:
				return parseVarStmt();
			case IDENT:
				return parseAssignStmt();
			case IF:
				return parseIfStmt();
			case WHILE:
				return parseWhileStmt();

		}
	}

	/* parses the 'print' statement
	 * Stmt ::= 'print' Exp
	 */
	private PrintStmt parsePrintStmt() throws ParserException {
		consume(PRINT); // or nextToken() since PRINT has already been recognized
		return new PrintStmt(parseExp());
	}

	/* parses the 'var' statement
	 * Stmt ::= 'var' IDENT '=' Exp 
	 */
	private VarStmt parseVarStmt() throws ParserException {
		consume(VAR); // or nextToken() since VAR has already been recognized
		var simpleVar = parseSimpleVariable();
		consume(ASSIGN);
		return new VarStmt(simpleVar, parseExp());
	}

	/* parses the assignment statement
	 * Stmt ::= IDENT '=' Exp 
	 */
	private AssignStmt parseAssignStmt() throws ParserException {
		var simpleVar = parseSimpleVariable();
		consume(ASSIGN);
		return new AssignStmt(simpleVar, parseExp());
	}

	/* parses the 'if' statement
	 * Stmt ::= 'if' '(' Exp ')' Block ('else' Block)? 
	 */
	private IfStmt parseIfStmt() throws ParserException {
		consume(IF); // or nextToken() since IF has already been recognized
		var exp = parseRoundPar();
		var thenBlock = parseBlock();
		if (buf_tokenizer.tokenType() != ELSE)
			return new IfStmt(exp, thenBlock);
		nextToken();
		return new IfStmt(exp, thenBlock, parseBlock());
	}

	/*
	 * parses the 'while' statement
	 * Stmt ::= 'while' '(' Exp ')' Block
	 */
	private WhileStmt parseWhileStmt() throws ParserException {
		consume(WHILE);
		var exp = parseRoundPar();
		var thenBlock = parseBlock();
		return new WhileStmt(exp, thenBlock);
	}

	/* parses a block of statements
	 * Block ::= '{' StmtSeq '}'
	 */
	private Block parseBlock() throws ParserException {
		consume(OPEN_BLOCK);
		var stmts = parseStmtSeq();
		consume(CLOSE_BLOCK);
		return new Block(stmts);
	}

	
	/*
	 * parses expressions, starting from the lowest precedence operator PAIR_OP which is left-associative
	 * Exp ::= And (',' And)*
	 */
	
	private Exp parseExp() throws ParserException {
		var exp = parseAnd();
		while (buf_tokenizer.tokenType() == PAIR_OP) {
			nextToken();
			exp = new PairLit(exp, parseAnd());
		}
		return exp;
	}
	
	/*
	 * parses expressions, starting from the lowest precedence operator AND which is left-associative
	 * And ::= Eq ('&&' Eq)* 
	 */
	private Exp parseAnd() throws ParserException {
		var exp = parseEq();
		while (buf_tokenizer.tokenType() == AND) {
			nextToken();
			exp = new And(exp, parseEq());
		}
		return exp;
	}

	/*
	 * parses expressions, starting from the lowest precedence operator EQ which is left-associative
	 * Eq ::= Add ('==' Add)*
	 */
	private Exp parseEq() throws ParserException {
		var exp = parseAdd();
		while (buf_tokenizer.tokenType() == EQ) {
			nextToken();
			exp = new Eq(exp, parseAdd());
		}
		return exp;
	}

	/*
	 * parses expressions, starting from the lowest precedence operator Add which is left-associative
	 * Add ::= Mul ('+' Mul)*
	 */
	private Exp parseAdd() throws ParserException {
		var exp = parseMul();
		while (buf_tokenizer.tokenType() == PLUS) {
			nextToken();
			exp = new Add(exp, parseMul());
		}
		return exp;
	}



	/*
	 * parses expressions, starting from the lowest precedence operator Mul which
	 * is left-associative
	 * Mul::= Unary ('*' Unary)*
	 */
	private Exp parseMul() throws ParserException {
		var exp = parseUnary();
		while (buf_tokenizer.tokenType() == TIMES) {
			nextToken();
			exp = new Mul(exp, parseUnary());
		}
		return exp;
	}

	// Unary ::= 'fst' Unary | 'snd' Unary | '-' Unary | '!' Unary | 'length' Unary | AtomOrArrayAcc
	private Exp parseUnary() throws ParserException {
		switch (buf_tokenizer.tokenType()) {
			case FST:
				return parseFst();
			case SND:
				return parseSnd();
			case MINUS:
				return parseMinus();
			case NOT:
				return parseNot();
			case LENGTH:
				return parseLength();
			// va bene metterlo nel default?;
			default:
				return parseAtomOrArrayAcc();
		}
	}


	//AtomOrArrayAcc::=Atom('[' Exp ']')?
	private Exp parseAtomOrArrayAcc() throws ParserException{
		var exp = parseAtom();
		if (buf_tokenizer.tokenType() == OPEN_ARR) {
			nextToken();
			var arrayAcc = new ArrayAcc(exp, parseExp());
			consume(CLOSE_ARR);
			return arrayAcc;
		}
		return exp;
	}
	// Unary ::= 'length' Unary
	private Length parseLength()  throws ParserException{
		consume(LENGTH);
		return new Length(parseUnary());
	}


	/*
	 * parses expressions of type Atom
	 * Atom ::= BOOL | NUM | IDENT | '(' Exp ')' | '[' ExpSeq ']'
	 *
	 */
	private Exp parseAtom() throws ParserException {
		switch (buf_tokenizer.tokenType()) {
			default:
				unexpectedTokenError();
			case BOOL:
				return parseBoolean();
			case NUM:
				return parseNum();
			case IDENT:
				return parseSimpleVariable();
			case OPEN_PAR:
				return parseRoundPar();
			case OPEN_ARR:
				return parseArrayPar();
		}
	}


	private Exp parseArrayPar() throws ParserException{
		consume(OPEN_ARR); // this check is necessary for parsing correctly the 'if' statement
		var exp = parseExpSeq();
		consume(CLOSE_ARR);
		return new ArrayLiteral(exp);
	}


	//ExpSeq::= Exp (';' ExpSeq)?
	private ExpSeq parseExpSeq() throws ParserException{
		var exp = parseExp();
		if (buf_tokenizer.tokenType() == STMT_SEP) {
			nextToken();
			return new MoreExp(exp, parseExpSeq());
		}
		return new SingleExp(exp);
	}
	// parses number literals
	private IntLiteral parseNum() throws ParserException {
		var val = buf_tokenizer.intValue();
		consume(NUM); // or nextToken() since NUM has already been recognized
		return new IntLiteral(val);
	}

	// parses boolean literals
	private BoolLiteral parseBoolean() throws ParserException {
		var val = buf_tokenizer.boolValue();
		consume(BOOL); // or nextToken() since BOOL has already been recognized
		return new BoolLiteral(val);
	}

	// parses variable identifiers
	private SimpleVariable parseSimpleVariable() throws ParserException {
		var name = buf_tokenizer.tokenString();
		consume(IDENT); // this check is necessary for parsing correctly the 'var' statement
		return new SimpleVariable(name);
	}

	/* parses expressions with unary operator MINUS
	 * Unary ::= '-' Atom
	 */
	private Sign parseMinus() throws ParserException {
		consume(MINUS); // or nextToken() since MINUS has already been recognized
		return new Sign(parseUnary());
	}

	/* parses expressions with unary operator FST
	 * Unary ::= 'fst' Atom
	 */
	private Fst parseFst() throws ParserException {
		consume(FST); // or nextToken() since FST has already been recognized
		return new Fst(parseUnary());
	}

	/* parses expressions with unary operator SND
	 * Unary ::= 'snd' Atom
	 */	
	private Snd parseSnd() throws ParserException {
		consume(SND); // or nextToken() since SND has already been recognized
		return new Snd(parseUnary());
	}

	/* parses expressions with unary operator NOT
	 * Unary ::= '!' Atom
	 */	
	 private Not parseNot() throws ParserException {
		consume(NOT); // or nextToken() since NOT has already been recognized
		return new Not(parseUnary());
	}

	/* parses expressions delimited by parentheses
	 * Unary ::= '(' Exp ')'
	 */
	
	private Exp parseRoundPar() throws ParserException {
		consume(OPEN_PAR); // this check is necessary for parsing correctly the 'if' statement
		var exp = parseExp();
		consume(CLOSE_PAR);
		return exp;
	}

	private static BufferedReader tryOpenInput(String inputPath) throws FileNotFoundException {
		return new BufferedReader(inputPath == null ? new InputStreamReader(System.in) : new FileReader(inputPath));
	}

	public static void main(String[] args) {
		try (var buf_reader = tryOpenInput(args.length > 0 ? args[0] : null);
				var buf_tokenizer = new BufferedTokenizer(buf_reader);
				var buf_parser = new BufferedParser(buf_tokenizer)) {
			var prog = buf_parser.parseProg();
			System.out.println(prog);
		} catch (IOException e) {
			err.println("I/O error: " + e.getMessage());
		} catch (ParserException e) {
			err.println("Syntax error " + e.getMessage());
		} catch (Throwable e) {
			err.println("Unexpected error.");
			e.printStackTrace();
		}

	}

}