namespace _16feb2023;
public static class Extensions
{
    public static bool EnoughSmaller<T>(this IEnumerable<T>? s, T threshold, int howMany) where T : IComparable
    {
        if (threshold == null || s == null)
            throw new ArgumentNullException();
        if (!(howMany > 0))
            throw new ArgumentOutOfRangeException();

        using (var it = s.GetEnumerator())
        {
            while (it.MoveNext())
            {
                if (it.Current.CompareTo(threshold) < 0)
                    howMany--;
                if (0 == howMany)
                    return true;
            }
            return false;
        }
    }
}