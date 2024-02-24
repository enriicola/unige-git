package lab07_03_18;

import java.util.Iterator;

public class Range implements Iterable<Integer> {

    private final int start, end;

    // defines a range from start (inclusive) to end (exclusive)
    public Range(int start, int end) {
        this.start = start;
        this.end = end;
    }

    // defines a range from 0 (inclusive) to end (exclusive)
    public Range(int end) {
        this(0,end);
    }

    // implements the abstract method of Iterable, returns a new RangeIterator
    @Override 
    public RangeIterator iterator() { 
	    return new RangeIterator(this.start, this.end);
    }

}