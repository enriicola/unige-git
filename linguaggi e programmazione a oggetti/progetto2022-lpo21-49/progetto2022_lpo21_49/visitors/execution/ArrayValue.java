package progetto2022_lpo21_49.visitors.execution;

import java.util.Arrays;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicIntegerArray;

public class ArrayValue implements Value{
    private final Value[] value;

    public ArrayValue(Value[] values){
       value=Objects.requireNonNull(values);
    }

    @Override
    public ArrayValue toArray() {
        return this;
    }

    @Override
    public boolean equals(Object obj) {
        if (this==obj) return true;
        if(obj instanceof ArrayValue array)
            return Arrays.equals(this.value, array.value);
        return false;
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(this.value);
    }

    @Override
    public String toString() {
        StringBuilder ArrToString=new StringBuilder("[");
        for (int i=0; i<this.value.length; i++){
            ArrToString.append(this.value[i]);
            if (i!=this.value.length-1)
                ArrToString.append(";");
        }
        ArrToString.append("]");
        return ArrToString.toString();
    }

    public Value[] getValue() {
        return value.clone();
    }

    public Value get(int i){
        return value[i];
    }
}
