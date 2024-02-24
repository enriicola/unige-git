using ArgumentException = System.ArgumentException;
/*
Scrivere l’extension-method Zip che, dato un array s di sequenze di elementi di tipo T, dove T è un parametro di tipo, produce una sequenza di array di elementi di tipo T.
L’elemento i-esimo del risultato è l’array contenente nella cella j-esima, l’elemento i-esimo della j-esima sequenza in input.
Ad esempio, sull’array
[ [1, 2, 3, 4], [10, 20, 30, 40], [100, 200, 300, 400] ]
si avrà come risultato la sequenza
[ [1, 10, 100], [2, 20, 200], [3, 30, 300], [4, 40, 400] ]
Il metodo dovrà sollevare
• ArgumentNullException se s o uno dei suoi elementi è null;
• ArgumentException se gli elementi di s hanno lunghezze differenti.
Si noti che le sequenze usate come elementi del’array argomento di Zip (e quindi il suo risultato) possono essere infinite.
*/
namespace _7feb2020;
public static class Extensions{
    public static IEnumerable<T[]> Zip<T>(this IEnumerable<T>[] s){
        if (s == null) throw new ArgumentNullException(nameof(s));
        var result = new List<T>();
        var enumerators = new IEnumerator<T>[s.Length];
        for(int i = 0; i < s.Length; i++){
            if (s[i] == null) throw new ArgumentNullException(nameof(s));
            enumerators[i] = s[i].GetEnumerator();
        }
        var rows = s.Length;
        while(enumerators.MoveNextAll()){
            for (var r = 0; r < rows; r++)
                result.Add(enumerators[r].Current); // result[c, r] = matrix[r, c];
            yield return result.ToArray();
            result.Clear();
        }
        for(int i = 0; i < s.Length; i++) //check if not equal lengths
            if (enumerators[i].MoveNext())
                throw new ArgumentException("Some sequences have different lengths", nameof(s));
    }
    public static bool MoveNextAll<T>(this IEnumerator<T>[] enumerators){ // method to move next all enumerators
        foreach (var enumerator in enumerators)
            if (!enumerator.MoveNext()) return false;
        return true;
    }
}
/*
if (s == null) throw new ArgumentNullException(nameof(s));
var enumerators = new IEnumerator<T>[s.Length];
for (int i = 0; i < s.Length; i++){
    if (s[i] == null) throw new ArgumentNullException(nameof(s));
    enumerators[i] = s[i].GetEnumerator();
}
for(int i = 0; i < s.Length; i++){
    using (var current_enumerator = enumerators[i]){
        while(current_enumerator.MoveNext()){
            var res = new List<T>();
            res.Add(current_enumerator.Current);
            for(int j = 0; j < s.Length; j++){
                if (j == i) continue;
                if (enumerators[j].MoveNext())
                    res.Add(enumerators[j].Current);
                else
                    throw new ArgumentException("Sequences have different lengths", nameof(s));
            }
            yield return res.ToArray();
        }
    }
}
*/