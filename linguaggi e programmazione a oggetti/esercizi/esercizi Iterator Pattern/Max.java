import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

public class Max{

    public static Integer max(Collection<Integer> col){
        // Integer pippo = 0;
        // // for (iterable_type iterable_element : collection)
        // for (Integer i : col)
        //     if(i > pippo)
        //         pippo = i;

        // return pippo;
        if(col.isEmpty()) // se col==nul lancia NullPointerException
            return null;
        var it = col.iterator(); // tipo inferenza Iterator<Integer>
                                 // https://docs.oracle.com/javase/tutorial/java/generics/genTypeInference.html
        int max = it.next(); // unboxing implicito, lascia NullPointerException se it.next è null
        while(it.hasNext()){
            int i = it.next(); // unboxing implicito, lascia NullPointerException se it.next è null
            if(i > max)
                max =i;
        }
         return max;   
    }

    public static void main(String[] args) {
        Set<Integer> s = new HashSet<>();

        // s refers to set {}
        assert max(s) == null;

        s.addAll(Arrays.asList(1, 2, 3, 4));

        // s refers to set {1,2,3,4}
        assert max(s) == 4;
    }
}