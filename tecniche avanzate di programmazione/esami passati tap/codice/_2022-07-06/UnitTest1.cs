namespace _6lug2022;

public class Tests
{
    [Test]
    public void Test1()
    {
        var s = new[] {8, 11, 35};
        var multiplicity = 2;
        var forbidden = 112;
        var expected = new[] {8, 8, 11, 11, 35, 35};
        var actual = s.Repeat(multiplicity, forbidden)/*.ToArray()*/;
        Assert.That(actual, Is.EqualTo(expected));
    }

    [Test]
    public void Test2()
    {
        var s = new[] {3.8, 24.31, 3.675};
        var multiplicity = 0;
        var forbidden = -4.67;
        Assert.That(() => s.Repeat(multiplicity, forbidden).ToArray(), Throws.TypeOf<ArgumentOutOfRangeException>());
    }

    [TestCase(0, 0)]
    [TestCase(1, 0)]
    [TestCase(2, 0)]
    [TestCase(7, 95)]
    public void Test3(int position, int badGuy)
    {
        if(position <= 0) Assert.Inconclusive();
        IEnumerable<int>GenerateSequence()
        {
            var r = new Random();
            var i = 0;
            while (true)
            {
                var next = r.Next();
                if (i == position) yield return badGuy;
                else yield return next;

                i++;
            }
        }

        var s = GenerateSequence();
        var multiplicity = 3;
        var forbidden = badGuy;
        if(position != 0)
            Assert.That(() => s.Repeat(multiplicity, badGuy).Take(multiplicity * position).ToArray(), Throws.TypeOf<ArgumentException>());
    }

}