namespace _4feb2022;
public static class Extensions
{
    public static IEnumerable<int> GetContainedNumbers(this IEnumerable<string> source)
    {
        if(source == null) throw new ArgumentNullException();
        foreach(var s in source){
            if(s == null) throw new ArgumentException();
            var number = "";
            foreach(var c in s){
                if(char.IsDigit(c)) number += c;
            }
            if(number == "") throw new ArgumentException();
            yield return int.Parse(number);
        }
    }
}