namespace _7lug2021;
public static class Extensions
{
    public static IEnumerable<double> Smooth(this IEnumerable<double> s, int N) {
        if (s == null) throw new ArgumentNullException();
        if (N < 0) throw new ArgumentOutOfRangeException();
        // if (s is ICollection<double> c && c.Count == 0) throw new FiniteSourceException();
        var buffer = new Queue<double>();
        
        using (var enumerator = s.GetEnumerator()){
            var current_index = 0;

            while (enumerator.MoveNext()){
                buffer.Enqueue(enumerator.Current);

                if (current_index >= N && current_index < N*2+1)
                    yield return buffer.Average();

                if (current_index >= N*2+1){
                    yield return buffer.Average();
                    buffer.Dequeue();
                }
                current_index++;
            }
        }
        throw new FiniteSourceException();
    }
}
public class FiniteSourceException : Exception{}