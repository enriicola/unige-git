namespace _5giu2023;
public class InconsistentSourceException : Exception{
    public InconsistentSourceException() {}
    public InconsistentSourceException(string message) : base (message) {}
    public InconsistentSourceException(string message, Exception inner) : base (message, inner) {}
}
public static class Extentions
{
    public static IEnumerable<int[]> MultipleApply<T>(this IEnumerable<Func<T, int>> s, T v, int n) // <T> needs to be specified in order to use the extension method syntax
    {
        if (s == null) throw new ArgumentNullException("s");
        if (n <= 0) throw new ArgumentOutOfRangeException("n");

        return  MultipleApplyHelper(s, v, n);
    }

    private static IEnumerable<int[]> MultipleApplyHelper<T>(IEnumerable<Func<T, int>> s, T v, int n)
    {
        using (var it = s.GetEnumerator())
        {
            var array = new int[n];
            var i = 0;
            while (it.MoveNext())
            {
                array[i++] = it.Current(v);
                if (i == n){
                    yield return array;
                    array = new int[n]; // reset
                    i = 0;
                }
            } // end while = finite source

            if (s.Count() % n != 0)
                throw new InconsistentSourceException();
        }
    }
}