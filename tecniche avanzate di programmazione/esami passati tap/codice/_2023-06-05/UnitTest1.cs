namespace _5giu2023;
public class Tests
{
    [Test]
    public void Test1()
    {
        var v = 2;
        var n = 3;
        var s = new Func<int, int>[] { x => 2 * x, x => 3 * x, x => 4 * x, x => 5 * x, x => 6 * x, x => 7 * x };
        var expected = new[] { new[] {4, 6, 8}, new[] {10, 12, 14}};
        var actual = s.MultipleApply(v, n);
        Assert.That(actual, Is.EqualTo(expected));
    }

    [Test]
    public void Test2()
    {
        var v = "boom";
        var n = 2;
        var s = new Func<string, int>[] { str => 2 * str.Length, str => 3 * str.Length, str => 4 * str.Length,
                                          str => 5 * str.Length, str => 6 * str.Length, str => 7 * str.Length,
                                          str => 8 * str.Length, str => 9 * str.Length, str => 10 * str.Length
                                        };
        Assert.Throws<InconsistentSourceException>(() => s.MultipleApply(v, n).ToArray());
        // str => string.IsNullOrEmpty(str) ? 1 : 0;
    }

    [Test]
    public void Test3()
    {
        var v = "boom";
        var n = 0;
        var s = NonFinisconoMai();
        Assert.Throws<ArgumentOutOfRangeException>(() => s.MultipleApply(v, n).ToArray());
    }
    public IEnumerable<Func<string, int>> NonFinisconoMai()
    {
        while (true)
        {
            yield return str => 2 * "RotoloniRegina".Length;
        }
    }
}