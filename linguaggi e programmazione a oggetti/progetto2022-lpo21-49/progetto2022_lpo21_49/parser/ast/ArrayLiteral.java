package progetto2022_lpo21_49.parser.ast;

import progetto2022_lpo21_49.visitors.Visitor;

public class ArrayLiteral extends SimpleLiteral<ExpSeq>{

    public ArrayLiteral(ExpSeq expSeq) {
        super(expSeq);
    }

    @Override
    public <T> T accept(Visitor<T> visitor) {


        return visitor.visitArrayLiteral(value);
    }
}
