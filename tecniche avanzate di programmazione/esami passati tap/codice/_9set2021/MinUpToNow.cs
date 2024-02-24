namespace _9set2021;
public static class Extensions
{
    public static IEnumerable<T> MinUpToNow<T>(this IEnumerable<T> leftSeq, IEnumerable<T> rightSeq) where T : IComparable<T>
    {
        if (leftSeq == null || rightSeq == null)
            throw new ArgumentNullException();

        var leftEnumerator = leftSeq.GetEnumerator();
        var rightEnumerator = rightSeq.GetEnumerator();
        var leftHasNext = leftEnumerator.MoveNext();
        var rightHasNext = rightEnumerator.MoveNext();

        while (leftHasNext && rightHasNext)
        {
            if (leftEnumerator.Current == null || rightEnumerator.Current == null)
                throw new ArgumentNullException();

            if (leftEnumerator.Current.CompareTo(rightEnumerator.Current) <= 0)
                yield return leftEnumerator.Current;
            else
                yield return rightEnumerator.Current;

            leftHasNext = leftEnumerator.MoveNext();
            rightHasNext = rightEnumerator.MoveNext();
        }

        if (leftHasNext || rightHasNext)
            throw new ArgumentException("Sequences have unequal lengths.");
    }
}
