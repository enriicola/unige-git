package lab10_05_06.parser.ast;

import lab10_05_06.visitors.Visitor;

public interface AST {
	<T> T accept(Visitor<T> visitor);
}
