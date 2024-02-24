namespace _20230911e1;
using System.Collections;
/*
Vogliamo fornire gli strumenti per implemetare un elementare gioco di carte di cui i
due giocatori si alternano a pescare da un mazzo, potenzialmente infinito (quindi in
cui le carte si possono ripetere), fino ad avere una mano di tre carte.
Vince chi nella sua mano ha la carta più alta.
In caso di pareggio, vince chi ha iniziato a pescare per primo.

Completare la definizione deli operatori relazionali nella seguente interfaccia in
modo che una carta sia più piccola di un'altra se il suo valore è inferiore (dove
l'asso è il più piccolo possibile) oppure se ha lo stesso valore ma il suo seme è
più debole (dove cuori/hearts > quadri>diamonds > fiori/clubs > picche/spades).
Vedi sotto definizione.

Scrivere l'extension method FirstWins che, data una sequenza (potenzialmente infinita)
di carte da gioco (IPlayingCard), s, produce una sequenza di booleani corrispondenti
alla vittoria del primo giocatore.

Ad esempio, sul mazzo che contiene, nell'ordine:
2 picche - 7 quadri - 7 fiori - re picche - 4 picche - 7 quadri -
7 fiori - donna quadri - 2 picche - 6 denari - 3 picche - 6 fiori
dovrà restituire la sequenza false, false.

Infatti il primo giocatore nella prima mano pesca un 2 picche, 7 fiori e 4 picche, la
sua carta più alta è 7 fiori.
Il secondo giocatore pesca due 7 quadri, un re di picche che è la sua carta più alta.
Il re picche è più alto del 7 fiori e quindi vince il secondo giocatore.
Analogamente nella seconda mano la carta più alta del primo giocatore è un 7 fiori,
che è più bassa della donna di quadri che ha in mano il secondo giocatore.

Il metodo dovrà sollevare ArgumentException se il mazzo è finito e non contiene
abbastanza carte per completare l'ultima mano.

Ad esempio, se contiene solo 5 carte (non si riesce a completare la prima mano)
o ne contiene 19 (non si riesce a completare la 4 mano).
*/
public static class Class1
{
    /*
    public static IEnumerable<bool> FirstWins (this IEnumerable<T> s) where T : IPlayingCard
    Questo è un modo più generico di dichiarare l'extension method, perché permette di essere
    utilizzato su qualsiasi tipo che implementi l'interfaccia IPlayingCard.

    Tuttavia, l'intestazione per l'esercizio è più specifica, perché dichiara
    che "l'extension method può essere utilizzato su sequenze di oggetti di tipo IPlayingCard".

    Quale intestazione utilizzare dipende dalle esigenze specifiche.

    Se vuoi che l'extension method possa essere utilizzato su qualsiasi tipo che implementi
    l'interfaccia IPlayingCard, allora dovrai utilizzare l'intestazione generica.

    Se vuoi che l'extension method possa essere utilizzato solo su sequenze di oggetti di tipo
    IPlayingCard, allora dovrai utilizzare l'intestazione specifica.
    */
    /* 
    
    */
    public static IEnumerable<bool> FirstWins(this IEnumerable<IPlayingCard> s)
    {
        //VS dice che è meglio l'inizializzazione fatta in questo modo di un array:
        //var PlayerOne = new PlayingCard[10];
        //var PlayerOne = new IPlayingCard[10];
        //var PlayerTwo = new IPlayingCard[10];
        //IPlayingCard[] PlayerOne = Array.Empty<PlayingCard>();
        //IPlayingCard[] PlayerTwo = Array.Empty<PlayingCard>();
        //Evitare allocazione di matrice di lunghezza zero
        //IPlayingCard[] PlayerOne = {};
        //IPlayingCard[] PlayerTwo = {};
        PlayingCard baseCard = new PlayingCard(Cards.Ace, Suits.Spades);
        IPlayingCard[] PlayerOne = { baseCard };
        IPlayingCard[] PlayerTwo = { baseCard };
        int count = 0;
        int round = 0;

        foreach (var elem in s)
        {
            //Contiamo fino a 6 perchè il numero di carte da dare nella mano
            if (count == 6)
            {
                round++;
                Array.Resize(ref PlayerOne, PlayerOne.Length + 1);
                PlayerOne[round] = baseCard;
                Array.Resize(ref PlayerTwo, PlayerTwo.Length + 1);
                PlayerTwo[round] = baseCard;
                count = 0;
            }
            //Dispari
            if (count % 2 != 0)
            {
                if (elem >= PlayerOne[round])
                    PlayerOne[round] = elem;
            }
            //Pari
            if (count % 2 == 0)
            {
                if (elem >= PlayerTwo[round])
                    PlayerTwo[round] = elem;
            }
            count++;
        }

        for (int i = 0; i < (s.Count() / 6); i++)
        {
            if (PlayerOne[i] >= PlayerTwo[i])
            {
                yield return true;
            }
            else
                yield return false;
        }


        //L'eccezione va messa a inizio del codice o alla fine??
        //Si èuò anche utilizzare uno using con dentro il codice di M per poter
        //poi catturare correttamente l'eccezione
        if (s.Count() % 6 != 0)
        {
            throw new ArgumentException();
        }
        
        
    }

    public enum Cards { Ace, Two, Three, Four, Five, Six, Seven, Jack, Queen, King}
    public enum Suits { Spades, Clubs, Diamonds, Hearts}
    public interface IPlayingCard
    {
        Cards Value { get; }
        Suits Suit { get; }

        static bool operator <= (IPlayingCard first, IPlayingCard second)
        {

            if(first.Value < second.Value){
                return true;
            }
            else
            {
                if(first.Value == second.Value)
                {
                    //Hai il dubbio che qui ci vada <= oppure <
                    if(first.Suit <= second.Suit)
                    {
                        return true;
                    }
                }
            }
            return false;
        }
        static bool operator >=(IPlayingCard first, IPlayingCard second)
        {
            
            if (first.Value > second.Value)
            {
                return true;
            }
            else
            {
                if (first.Value == second.Value)
                {
                    //Hai il dubbio che qui ci vada >= oppure >
                    if (first.Suit >= second.Suit)
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    public class PlayingCard : IPlayingCard
    {
        public Cards Value { get; }
        public Suits Suit { get; }

        public PlayingCard(Cards value, Suits suit)
        {
            Value = value;
            Suit = suit;
        }
        
    }
}
