package lab09_04_22.parser;

import static java.util.Objects.requireNonNull;
import static lab09_04_22.parser.TokenType.*;
import static java.lang.System.err;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;

import lab09_04_22.parser.ast.*;

/*
Prog ::= StmtSeq EOF
StmtSeq ::= Stmt (';' StmtSeq)?
Stmt ::= 'var'? IDENT '=' Exp | 'print' Exp |  'if' '(' Exp ')' Block ('else' Block)? 
Block ::= '{' StmtSeq '}'
Exp ::= And (',' And)* 
And ::= Eq ('&&' Eq)* 
Eq ::= Add ('==' Add)*
Add ::= Mul ('+' Mul)*
Mul::= Atom ('*' Atom)*
Atom ::= 'fst' Atom | 'snd' Atom | '-' Atom | '!' Atom | BOOL | NUM | IDENT | '(' Exp ')'
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
	    // completare
	}

	/* parses a statement
	 * Stmt ::= 'var'? IDENT '=' Exp | 'print' Exp |  'if' '(' Exp ')' Block ('else' Block)? 
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
		}
	}

	/* parses the 'print' statement
	 * Stmt ::= 'print' Exp
	 */
	private PrintStmt parsePrintStmt() throws ParserException {
	    // completare
	}

	/* parses the 'var' statement
	 * Stmt ::= 'var' IDENT '=' Exp 
	 */
	private VarStmt parseVarStmt() throws ParserException {
	    // completare
	}

	/* parses the assignment statement
	 * Stmt ::= IDENT '=' Exp 
	 */
	private AssignStmt parseAssignStmt() throws ParserException {
	    // completare
	}

	/* parses the 'if' statement
	 * Stmt ::= 'if' '(' Exp ')' Block ('else' Block)? 
	 */
	private IfStmt parseIfStmt() throws ParserException {
	    // completare
	}

	/* parses a block of statements
	 * Block ::= '{' StmtSeq '}'
	 */
	private Block parseBlock() throws ParserException {
	    // completare
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
	    // completare
	}

	/*
	 * parses expressions, starting from the lowest precedence operator EQ which is left-associative
	 * Eq ::= Add ('==' Add)*
	 */
	private Exp parseEq() throws ParserException {
	    // completare
	}

	/*
	 * parses expressions, starting from the lowest precedence operator PLUS which is left-associative
	 * Add ::= Mul ('+' Mul)*
	 */
	private Exp parseAdd() throws ParserException {
	    // completare
	}

	/*
	 * parses expressions, starting from the lowest precedence operator TIMES which is left-associative
	 * Mul::= Atom ('*' Atom)*
	 */
	private Exp parseMul() throws ParserException {
	    // completare
	}

	/* parses expressions of type Atom
	 * Atom ::= 'fst' Atom | 'snd' Atom | '-' Atom | '!' Atom | BOOL | NUM | IDENT | '(' Exp ')'
	 */
	private Exp parseAtom() throws ParserException {
		switch (buf_tokenizer.tokenType()) {
		default:
			unexpectedTokenError();
		case NUM:
			return parseNum();
		case IDENT:
			return parseSimpleVariable();
		case MINUS:
			return parseMinus();
		case OPEN_PAR:
			return parseRoundPar();
		case BOOL:
			return parseBoolean();
		case NOT:
			return parseNot();
		case FST:
			return parseFst();
		case SND:
			return parseSnd();
		}
	}

	// parses number literals
	private IntLiteral parseNum() throws ParserException {
	    // completare
	}

	// parses boolean literals
	private BoolLiteral parseBoolean() throws ParserException {
	    // completare
	}

	// parses variable identifiers
	private SimpleVariable parseSimpleVariable() throws ParserException {
	    // completare
	}

	/* parses expressions with unary operator MINUS
	 * Atom ::= '-' Atom 
	 */
	private Sign parseMinus() throws ParserException {
	    // completare
	}

	/* parses expressions with unary operator FST
	 * Atom ::= 'fst' Atom 
	 */
	private Fst parseFst() throws ParserException {
	    // completare 
	}

	/* parses expressions with unary operator SND
	 * Atom ::= 'snd' Atom 
	 */	
	private Snd parseSnd() throws ParserException {
	    // completare
	}

	/* parses expressions with unary operator NOT
	 * Atom ::= '!' Atom 
	 */	
	 private Not parseNot() throws ParserException {
	     // completare
	}

	/* parses expressions delimited by parentheses
	 * Atom ::= '(' Exp ')'
	 */
	
	private Exp parseRoundPar() throws ParserException {
	    // completare
	}

	private static BufferedReader tryOpenInput(String inputPath) throws FileNotFoundException {
		return new BufferedReader(inputPath == null ? new InputStreamReader(System.in) : new FileReader(inputPath));
	}

	public static void main(String[] args) {
		try (var buf_reader = tryOpenInput(args.length > 0 ? args[0] : null);
				var buf_tokenizer = new BufferedTokenizer(buf_reader);
				var buf_parser = new BufferedParser(buf_tokenizer);) {
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
