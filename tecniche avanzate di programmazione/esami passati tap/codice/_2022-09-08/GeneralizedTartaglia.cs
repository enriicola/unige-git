namespace _8set2022;
public class ExtraMath
{ /**/
    public static IEnumerable<IEnumerable<T>> GeneralizedTartaglia<T>(T seed, Func<T,T,T> generator)
    {
        var dict = new Dictionary<int, List<T>>();
        var exceptions = new List<Exception>();
        var line = 0;
        while (true)
        {
            dict.Add(line, new List<T>());
            for (var i = 0; i <= line; i++)
            {
                if (i == line || i == 0)
                    dict[line].Add(seed);
                else
                {
                    var aux = dict[line - 1].ToArray();
                    try
                    {
                        dict[line].Add(generator(aux[i - 1], aux[i]));
                    }
                    catch (Exception ex)
                    {
                        exceptions.Add(ex);
                    }
                }
            }
            if (exceptions.Count > 0)
                throw new AggregateException("Multiple errors during row creation", exceptions);
            line++;
            yield return dict[line-1];
        }
    }
}