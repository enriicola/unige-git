package lab11_05_13.parser.ast;

import lab11_05_13.visitors.Visitor;

public interface AST {
	<T> T accept(Visitor<T> visitor);
}
