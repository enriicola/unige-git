namespace pippoquiz;
public class C
{
    public int P { get; init; }

    public C(int x = 42)
    {
        P = x;
    }

    public IEnumerable<bool> M(int a)
    {
        for (int i = 0; i < a; i++)
            yield return true;

        if (a == P)
            throw new ArgumentException();

        while (true)
            yield return false;
    }
}

[TestFixture]
public class CTest
{
    [Test]
    public void T1()
    {
        Assert.That(new C().M(7), Is.Not.Empty);
    }

    [Test]
    public void T2()
    {
        Assert.That(new C(7).M(7), Is.Not.Empty);
    }

    // [Test]
    // public void T3()
    // {
    //     Assert.That(new C(7).M(7), Throws.TypeOf<ArgumentException>());
    // }

    [Test]
    public void T4()
    {
        Assert.That(() => new C(7).M(7), Throws.TypeOf<ArgumentException>());
    }

    [Test]
    public void T5()
    {
        Assert.That(() => new C(7).M(7).Any(), Throws.TypeOf<ArgumentException>());
    }

    [Test]
    public void T6()
    {
        Assert.That(() => new C(7).M(7).Take(10), Throws.TypeOf<ArgumentException>());
    }

    [Test]
    public void T7()
    {
        Assert.That(() => new C(7).M(7).ToArray(), Throws.TypeOf<ArgumentException>());
    }

    // [Test]
    // public void T8()
    // {
    //     Assert.That(new C(7).M(7).ToArray(), Throws.TypeOf<ArgumentException>());
    // }

    [Test]
    public void T9()
    {
        var source = new C() { P = 57 };
        Assert.That(source.M(57).Take(7).ToArray(),
            Is.EqualTo(new[] { true, true, true, true, true, true, true }));
    }
}
