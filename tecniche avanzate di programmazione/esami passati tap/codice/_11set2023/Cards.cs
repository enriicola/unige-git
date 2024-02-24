/*
Vogliamo fornire gli strumenti per implementare un elementare gioco di carte in cui i due giocatori si alternano a pescare da un mazzo, potenzialmente infinito (quindi in cui le carte si possono ripetere), fino ad avere una mano di tre carte. Vince chi nella sua mano ha la carta più alta. In caso di pareggio, vince chi ha iniziato a pescare per primo.
Completare la definizione degli operatori relazionali nella seguente interfaccia in modo che una carta sia più piccola di un’altra se il suo valore è inferiore (dove l’asso è il più piccolo possibile) oppure se ha lo stesso valore ma il suo seme è più debole (dove cuori/hearts > quadri/diamonds > fiori/clubs > picche/spades).

Scrivere l’extension-method FirstWins che, data una sequenza (potenzialmente infinita) di carte da gioco (IPlayingCard), s, produce una sequenza di booleani corrispondenti alla vittoria del primo giocatore.
Ad esempio, sul mazzo che contiene, nell’ordine, un 2 di picche, un 7 di quadri, un 7 di fiori, un re di picche, un 4 di picche, un 7 di denari, un 7 di fiori, una donna di quadri, un 2 di picche, un 6 di denari, un 3 di picche e un 6 di fiori, come in figura, dovrà restituire la sequenza false , false.

Infatti il primo giocatore (frecce blu) nella prima mano pesca un 2 di picche, un 7 di fiori e un 4 di picche, la sua carta più alta è il 7 di fiori. Il secondo giocatore (frecce rosa) pesca due 7 di quadri e un re di picche, che è la sua carta più alta. Il re di picche è più alto del 7 di fiori e quindi vince il secondo giocatore. Analogamente nella seconda mano la carta più alta del primo giocatore è un 7 di fiori, che è più bassa della donna di quadri che ha in mano il secondo giocatore.
Il metodo dovrà sollevare ArgumentException se il mazzo è finito e non contiene abbastanza carte per completare l’ultima mano. Ad esempio, se contiene solo 5 carte (non si riesce a completare la prima mano) o ne contiene 19 (non si riesce a completare la 4 mano).
*/
namespace _11set2023;
public enum Cards {Ace, Two, Three, Four, Five, Six, Seven, Jack, Queen, King} public enum Suits {Spades, Clubs, Diamonds, Hearts}
public interface IPlayingCard { 
    Cards Value { get ; } Suits Suit { get ; }
    static bool operator <=(IPlayingCard first, IPlayingCard second) {
        if (first.Value < second.Value) return true;
        if (first.Value > second.Value) return false;
        if (first.Suit <= second.Suit) return true;
        return false;}
    static bool operator >=(IPlayingCard first, IPlayingCard second) { return second <= first; }
}
public class PlayingCard : IPlayingCard { public Cards Value { get; } public Suits Suit { get; } public PlayingCard(Cards value, Suits suit) { Value = value; Suit = suit; } }
public static class Extensions {
    public static IEnumerable<bool> FirstWins(this IEnumerable<IPlayingCard> deck) { // : IPlayingCard NON SERVE !!!
        // var count = 1; // IPlayingCard player1; // IPlayingCard player2; // IPlayingCard winnerCard; // int winneerIndex;
        // using (var enumerator = deck.GetEnumerator()) {
        //     if(enumerator.MoveNext()) player1 = enumerator.Current;
        //     else throw new ArgumentException();
        //     while (enumerator.MoveNext()) {
        //         player2 = enumerator.Current;
        //         if(player1 >= player2){
        //             winnerCard = player1;
        //             winneerIndex = count;
        //         }
        //         else{
        //             winnerCard = player2;
        //             winneerIndex = count;
        //         }
        //         if(count%6 == 0 && winneerIndex%2 == 0) yield return true;
        //         else yield return false;
        //         player1 = enumerator.Current;
        //         count++;
        //     }
        // }
        var currentHand = new List<IPlayingCard>();
        using (var enumerator = deck.GetEnumerator()) {
            while (enumerator.MoveNext()) {
                currentHand.Add(enumerator.Current);
                if (currentHand.Count%6 == 0) {
                    var maxFirst = currentHand[0];
                    var maxSecond = currentHand[1]; // inside so that it can be index 1 (that's effectevely some cards)
                    for(int i=0; i<6; i+=2)
                        if (currentHand[i] >= maxFirst) 
                            maxFirst = currentHand[i];
                    for(int i=1; i<6; i+=2)
                        if (currentHand[i] >= maxSecond) 
                            maxSecond = currentHand[i];
                    yield return maxFirst >= maxSecond;
                    currentHand.Clear();
                }
            }
        }
        if (currentHand.Count%6 != 0)
            throw new ArgumentException();
        
        // if (count%6 != 0)
        //     throw new ArgumentException();
    }
}