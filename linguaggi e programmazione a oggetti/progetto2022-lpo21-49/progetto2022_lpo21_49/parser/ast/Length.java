package progetto2022_lpo21_49.parser.ast;

//import lab11_05_13.visitors.Visitor;

import progetto2022_lpo21_49.visitors.Visitor;

public class Length extends UnaryOp {

    public Length(Exp exp) {
        super(exp);
    }

    @Override
    public <T> T accept(Visitor<T> visitor) {
        return visitor.visitLength(exp);
    }
}
