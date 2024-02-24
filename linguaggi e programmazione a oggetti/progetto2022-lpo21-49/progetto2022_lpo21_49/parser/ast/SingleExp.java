package progetto2022_lpo21_49.parser.ast;

//import lab11_05_13.visitors.Visitor;

import progetto2022_lpo21_49.visitors.Visitor;

public class SingleExp extends Single<Exp> implements ExpSeq {

    public SingleExp(Exp single) {
        super(single);
    }

    @Override
    public <T> T accept(Visitor<T> visitor) {
        return visitor.visitSingleExp(single);
    }
}