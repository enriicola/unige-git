namespace _4feb2022;
public class Tests
{
    [Test]
    public void Test1()
    {
        var source = new[] {"45", "-8gg", "lll lo sembra ma non lo e'"};
        Assert.That(() => source.GetContainedNumbers().Count(), Throws.TypeOf<ArgumentException>());
        // .Count() on a collection iterates over the elements of the it and counts them. The method returns the total count as an integer value.
    }

    [Test]
    public void Test2()
    {
        var source = new[] {"f55h7", "90", "-45", "H 6YY5"};
        var expected = new[] {557, 90, 45, 65};
        var actual = source.GetContainedNumbers();
        Assert.That(actual, Is.EqualTo(expected));
    }

    [Test]
    public void Test3()
    {
        var source = GenerateSequence();
        var expected = Enumerable.Range(0, 100);
        var actual = source.GetContainedNumbers().Take(100);
        Assert.That(actual, Is.EqualTo(expected));
    }
    private static IEnumerable<string> GenerateSequence()
    {
        var i = 0;
        while (true)
        {
            yield return $"a{i++}z";
        }
    }
}