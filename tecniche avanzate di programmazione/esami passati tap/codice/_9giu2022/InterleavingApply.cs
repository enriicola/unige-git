namespace _9giu2022;
[Serializable]
public class DifferentLengthException : Exception
{
    public bool FirstIsLonger { get; }
    public DifferentLengthException(bool firstIsLonger = true) { FirstIsLonger = firstIsLonger; }
    public DifferentLengthException(string message, bool firstIsLonger = true) : base(message) { FirstIsLonger = firstIsLonger; }
    public DifferentLengthException(string message, Exception inner, bool firstIsLonger = true) : base(message, inner) { FirstIsLonger = firstIsLonger; }
}
[Serializable]
public class FunctionApplicationException : Exception
{
    public FunctionApplicationException() { }
    public FunctionApplicationException(string message) : base(message) { }
    public FunctionApplicationException(string message, Exception inner) : base(message, inner) { }
}
public static class Extensions
{
    public static IEnumerable<TRes> InterleavingApply<T, TRes>(this IEnumerable<T> s1, IEnumerable<T> s2, Func<T, TRes> f)
    {
        using (var it1 = s1.GetEnumerator())
        using (var it2 = s2.GetEnumerator())
        {
            var firstHasNext = it1.MoveNext();
            var secondHasNext = it2.MoveNext();
            while (firstHasNext && secondHasNext) {
                TRes r1;
                TRes r2;

                try{
                    r1 = f(it1.Current);
                    r2 = f(it2.Current);
                }
                catch (Exception ex) {
                    throw new FunctionApplicationException(nameof(f), ex);
                }

                yield return r1;
                yield return r2;
                firstHasNext = it1.MoveNext();
                secondHasNext = it2.MoveNext();
            }

            if (firstHasNext && !secondHasNext)
                throw new DifferentLengthException(true);
            if (!firstHasNext && secondHasNext)
                throw new DifferentLengthException(false);
        }
    }
}