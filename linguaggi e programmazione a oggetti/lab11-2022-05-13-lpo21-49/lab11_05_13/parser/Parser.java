package lab11_05_13.parser;

import lab11_05_13.parser.ast.Prog;

public interface Parser extends AutoCloseable {

	Prog parseProg() throws ParserException;

}