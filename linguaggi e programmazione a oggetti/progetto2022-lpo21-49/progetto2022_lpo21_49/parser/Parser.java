package progetto2022_lpo21_49.parser;

import progetto2022_lpo21_49.parser.ast.Prog;

public interface Parser extends AutoCloseable {

	Prog parseProg() throws ParserException;

}