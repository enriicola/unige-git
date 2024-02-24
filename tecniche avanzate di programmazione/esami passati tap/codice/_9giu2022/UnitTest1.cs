namespace _9giu2022;
public class Tests
{
    [Test]
    public void Test1()
    {
        var s1 = new[] {8, 11, 35};
        var s2 = new[] {100, 34, 23};
        var f = new Func<int, int>(x => x / 7);
        var expected = new[] {1, 14, 1, 4, 5, 3};
        var actual = s1.InterleavingApply(s2, f);
        Assert.That(actual, Is.EqualTo(expected));
    }

    [TestCase(new[] {'a', 'b', 'c'}, new[] {'1', '2', '3'})]
    [TestCase(new[] {'a', 'b', 'c'}, new[] {'1', '2', '3', '4'})]
    public void Test2(char[] a1, char[] a2)
    {
        if(a1.Length == a2.Length) Assert.Inconclusive("...");
        
        var f = new Func<char, bool>(x => char.IsDigit(x));
        Assert.That(() => a1.InterleavingApply(a2, f).Count(), Throws.TypeOf<DifferentLengthException>().With.Property("FirstIsLonger").EqualTo(a1.Length > a2.Length));
    }

    [Test]
    public void Test3()
    {
        var s1 = CycleSequence(new[] {7, 5, 17});
        var s2 = CycleSequence(new[] {2, 18, 42, 128, 512});
        var f = new Func<int, bool>(x => x % 2 == 0);
        var expected = CycleSequence(new[] {false, true}).Take(100).ToList();
        var actual = s1.InterleavingApply(s2, f).Take(100).ToList();
        Assert.That(actual, Is.EqualTo(expected));
    }
    IEnumerable<T> CycleSequence<T>(IEnumerable<T> source)
    {
        while (true)
        {
            foreach (var item in source)
            {
                yield return item;
            }
        }
    }
}