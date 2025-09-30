namespace _6lug2022;
public static class Extensions
{
    public static IEnumerable<T> Repeat<T>(this IEnumerable<T> s, int multiplicity, T forbidden) /*where T : struct*/{
        if(multiplicity <= 0) throw new ArgumentOutOfRangeException();
        if(s.Contains(forbidden)) throw new ArgumentException();
        
        foreach(var item in s){
            for(int i = 0; i < multiplicity; i++){
                yield return item;
            }
        }
    }
}