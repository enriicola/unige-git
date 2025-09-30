/*
Implementare, usando NUnit ed eventualmente Moq, i seguenti test relativi all’esercizio 1.
1. Scrivere un test parametrico, con due parametri di tipo array, rispettivamente di Cards e di
Suits che verifica che se i due giocatori pescano le stesse carte vince sempre il primo.
Se i parametri hanno lunghezza diversa o non multipla di 3 il test dovrà risultare inconclusive.
Altrimenti dovrà usare come argomento per la chiamata sotto test il mazzo in cui ogni carta è ripetuta due volte ed è costruita usando i dati nei parametri. 
Quindi la prima e la seconda carta avranno il valore del primo elemento del primo parametro e il seme del primo elemento del secondo parametro. La terza e 
quarta carta avranno il valore del secondo elemento del primo parametro e il seme del secondo elemento del secondo parametro e così via.
2. Scrivere un test per verificare che il metodo invocato su un mazzo di infinite carte generate casualmente produca un risultato contenente almeno 1000 elementi.
Hint In C# esiste la classe Random con metodi Next(), Next(int MinValue, int MaxValue), e Next(int MaxValue).
3. Scrivere un test per verificare che il metodo sollevi eccezione di tipo ArgumentException su un mazzo contenente 7 carte.
*/

namespace _11set2023;
public class Tests
{
    [TestCase(new Cards[] { Cards.Ace, Cards.Two }, new Suits[] { Suits.Spades, Suits.Clubs })]
    [TestCase(new Cards[] { Cards.Ace, Cards.Two, Cards.Three }, new Suits[] { Suits.Spades, Suits.Clubs, Suits.Diamonds })]
    public void Test1(Cards[] cards, Suits[] suits)
    {
        if(cards.Length != suits.Length || cards.Length % 3 != 0)
            Assert.Inconclusive();

        var deck = GenerateSequence(cards, suits);
        var actual = deck.FirstWins();

        var expected = new Queue<bool>();
        for (int i = 0; i < cards.Length; i += 3)
            expected.Enqueue(true);

        Assert.That(actual, Is.EqualTo(expected)); // non c'è bisogno di fare ToList() perché l'EqualTo "usa un foreach"
    }
    private IEnumerable<IPlayingCard> GenerateSequence(Cards[] cards, Suits[] suits)
    {
        for (int i = 0; i < cards.Length; i++){
            yield return new PlayingCard(cards[i], suits[i]);
            yield return new PlayingCard(cards[i], suits[i]);
        }
    }

    [Test]
    public void Test2()
    {
        var source = InfiniteSequence();
        var actual = source.FirstWins().Take(1000)./*ToArray().Length;*/Count();
        var expected = 1000;

        // Assert.That(actual, Is.GreaterThanOrEqualTo(expected));
        Assert.That(actual, Is.EqualTo(expected));
        
    }
    IEnumerable<IPlayingCard> InfiniteSequence()
    {
        var random = new Random();
        while (true)
            yield return new PlayingCard((Cards)random.Next(0, 10), (Suits)random.Next(0, 4));
    }
    [Test]
    public void Test3()
    {
        var cards = new Cards[] { Cards.Ace, Cards.Two, Cards.Three, Cards.Four, Cards.Five, Cards.Six, Cards.Seven };
        var suits = new Suits[] { Suits.Spades, Suits.Clubs, Suits.Diamonds, Suits.Hearts, Suits.Spades, Suits.Clubs, Suits.Diamonds };
        var source = GenerateSequence(cards, suits); // OCCHIO!!! -> 14 invece che 7 :/ 
        // Assert.That(() => source.FirstWins().ToList(), Throws.ArgumentException);
        Assert.That(() => source.FirstWins().ToList(), Throws.TypeOf<ArgumentException>());
    }
}