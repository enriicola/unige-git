// Utilizzando lo stile di programmazione test first, scrivere un metodo statico Censor che, presa una sequenza di elementi di tipo I e una
// stringa da censurare restituisce una nuova sequenza dove tutti gli elementi che contengono nel messaggio la stringa da censurare sono
// stati eliminati.
// Il metodo dovrà prendere come parametri:
// sequence, la sequenza sorgente. // Nota: questa sequenza può anche essere infinita;
// badWord, la stringa da censurare.
// Il metodo deve sollevare l'eccezione ArgumentNullException se sequence o uno dei suoi elementi sono null.
// L'ordine in cui procedere è simile al precedente laboratorio su test-first (e operator overloading). In questo laboratorio dovete
// considerare anche il caso in cui la sequenza sia infinita.
// Oltre ai test state-based, definite anche qualche test behavior-based. Ad esempio verificate che per ogni elemento visitato la property
// get sia invocata una e una sola volta, o che se si richiedono solo n elementi la property sugli elementi ulteriori (che non servono a
// costruire i primi n del risultato) non sia invocata.
// Potete anche verificare che la sequenza sia enumerata una sola volta e che MoveNext/Current siano invocati il numero atteso di volte.
// Per costruire gli stub/mock che vi servono per i test potete usare Moq o potete implementare delle classi "sceme"  da usare come/nei
// parametri. Potete anche usare un approccio ibrido e usare Moq per un tipo e una vostra implementazione per un altro. Pensate quale sia
// il modo più semplice e adottatelo.



namespace Censor
{
    public interface I
    {
        string Message { get; }
    }

    public static class CensorClass
    {
        public static IEnumerable<I> Censor(IEnumerable<I> sequence, string badWord)
        {
            static IEnumerable<I> Aux_Censor(IEnumerable<I> s, string bw)
            {
                using var iterator = s.GetEnumerator();
                while (iterator.MoveNext())
                {
                    var cur = iterator.Current;
                    if (cur is null) throw new ArgumentNullException(nameof(s), "la sequenza non può contenere elementi nulli");
                    if (!cur.Message.Contains(bw)) yield return cur;
                }
            }
            if(sequence is null) throw new ArgumentNullException(nameof(sequence),"la sequenza non può essere nulla");

            return Aux_Censor(sequence,badWord);
        }
    }
}