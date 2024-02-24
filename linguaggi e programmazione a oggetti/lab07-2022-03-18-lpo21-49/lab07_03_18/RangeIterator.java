package lab07_03_18;

import java.util.Iterator;
import java.util.NoSuchElementException;

class RangeIterator implements Iterator<Integer> {

    private int index;
    private final int end; 

    public RangeIterator(int start, int end){
        this.index = start;
        this.end = end;
    }

    @Override
    public boolean hasNext() {    
	    return (index < this.end);
    }

    @Override
    public Integer next() {
        return index++; // incremento post-fisso
    }

}
