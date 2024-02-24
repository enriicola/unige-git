package lab09_04_22.parser;

import lab09_04_22.parser.ast.Prog;

public interface Parser extends AutoCloseable {

	Prog parseProg() throws ParserException;

}