package progetto2022_lpo21_49.parser.ast;

import progetto2022_lpo21_49.visitors.Visitor;

public interface AST {
	<T> T accept(Visitor<T> visitor);
}
