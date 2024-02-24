namespace _9set2021;
public class Tests
{
    [Test]
    public void Test1()
    {
        var leftSeq = new[] { "bianco", "rosso", "verde" };
        var rightSeq = GenerateStrings("pippo");
        Assert.That(() => leftSeq.MinUpToNow(rightSeq).Take(5).ToList(), Throws.TypeOf<ArgumentException>());
    }

    [Test]
    public void Test2()
    {
        var leftSeq = new[] { "qui", "quo", "qua", "paperino", "paperone" };
        var rightSeq = new[] { "topolino", "pippo", "pluto", "tip", "tap" };
        // var expected = new[] { "qui", "pippo", "pippo", "paperino", "paperino" }; >:(
        var expected = new[] { "qui", "pippo", "pluto", "paperino", "paperone" };
        var actual = leftSeq.MinUpToNow(rightSeq);
        Assert.That(actual, Is.EquivalentTo(expected));
    }

    [Test]
    public void Test3([Range(0, 1000, 100)] int errorIndex)
    {
        var leftSeq = GenerateStrings("rosa");
        var rightSeq = GenerateStrings("viola", errorIndex);
        // rightSeq[errorIndex] = null;
        Assert.Throws<ArgumentNullException>(() => leftSeq.MinUpToNow(rightSeq).ToList()); // se mi aspetto un'eccezione, devo usare lambda e ToList() SE MI ASPETTO UNA LISTA
    }
    // generate infinite sequences of strings
    private static IEnumerable<string?> GenerateStrings(string? s, int? errorIndex = null) // se errorIndex non c'è, viene messo a null
    {
        var i = 0;
        while (true)
        {
            if (i++ == errorIndex && errorIndex != null)
                yield return null;
            yield return s;
        }
    }
}