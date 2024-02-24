namespace _13gen2020;
public interface I<T> { T P { get; } }
public static class Extensions
{
    public static Dictionary<T, I<T>[]> Indexing<T>(this I<T>?[]? s) where T : Enum {
            if (s == null)
                throw new ArgumentNullException();
                
            var elements = Enum.GetValues(typeof(T));
            var myDict = new Dictionary<T, I<T>[]>();
            foreach (var element in elements)
                myDict.Add((T)element, new I<T>[] { });
            
            foreach (var ss in s) {
                if (ss == null)
                    throw new ArgumentNullException();
                myDict[ss.P] = myDict[ss.P].Append(ss).ToArray();
            }
            return myDict;
        }
}