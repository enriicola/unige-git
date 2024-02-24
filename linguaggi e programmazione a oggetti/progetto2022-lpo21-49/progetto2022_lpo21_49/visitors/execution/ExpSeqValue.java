package progetto2022_lpo21_49.visitors.execution;

import java.util.LinkedList;

public class ExpSeqValue implements Value{
    private final static LinkedList<Value> expSeq=new LinkedList<>();

    public static Value AddExp(Value v){
        if(v!=null)expSeq.add(v);
        return v;
    }

    public static void clearExpSeq(){
        expSeq.clear();
    }

    public static ArrayValue toArrayValue(){
        Value[] res=new Value[expSeq.size()];
        res=expSeq.toArray(res);
        return new ArrayValue(res);
    }
}
