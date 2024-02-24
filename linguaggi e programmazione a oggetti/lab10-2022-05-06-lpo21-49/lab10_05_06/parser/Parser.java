package lab10_05_06.parser;

import lab10_05_06.parser.ast.Prog;

public interface Parser extends AutoCloseable {

	Prog parseProg() throws ParserException;

}