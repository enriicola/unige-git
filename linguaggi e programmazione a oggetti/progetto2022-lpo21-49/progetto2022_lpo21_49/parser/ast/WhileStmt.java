package progetto2022_lpo21_49.parser.ast;

//import lab11_05_13.visitors.Visitor;

import progetto2022_lpo21_49.visitors.Visitor;

import static java.util.Objects.requireNonNull;

public class WhileStmt implements Stmt {
    private final Exp exp; // non-optional field
    private final Block thenBlock; // non-optional field

    public WhileStmt(Exp exp, Block thenBlock) {
        this.exp = requireNonNull(exp);
        this.thenBlock = requireNonNull(thenBlock);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" + exp + "," + thenBlock + ")";
    }

    @Override
    public <T> T accept(Visitor<T> visitor) {
        return visitor.visitWhileStmt(exp,thenBlock);
    }
}