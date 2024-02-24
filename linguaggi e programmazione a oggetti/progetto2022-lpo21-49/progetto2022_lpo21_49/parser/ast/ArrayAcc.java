package progetto2022_lpo21_49.parser.ast;

import progetto2022_lpo21_49.visitors.Visitor;

public class ArrayAcc extends BinaryOp {

    //protected final Exp atom;
    public ArrayAcc(Exp left, Exp right) {
        super(left,right);
    }

    @Override
    public <T> T accept(Visitor<T> visitor) {
        return visitor.visitArrayAcc(left,right);
    }
}
