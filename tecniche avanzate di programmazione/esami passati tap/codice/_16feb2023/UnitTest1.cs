namespace _16feb2023;
public class Tests
{
    [Test]
    public void Test1()
    {
        var s = new[] { '0', '1', '2', '3', '4' };
        var threshold = '7';
        var howMany = 0;

        Assert.That(() => s.EnoughSmaller(threshold, howMany), Throws.TypeOf<ArgumentOutOfRangeException>());
    }

    [Test]
    public void Test2()
    {
        var s = new[] { "100", "200", "300", "400", "500" };
        var threshold = "700";
        var howMany = 42;

        Assert.That(s.EnoughSmaller(threshold, howMany), Is.False);
    }

    [TestCase(45)]
    public void Test3(int n)
    {
        if (n <= 0)
            Assert.Inconclusive("n is <= 0");

        var threshold = 7.42;
        int howMany = n;

        IEnumerable<double> GenS()
        {
            double x = -0.5;
            while (true)
            {
                yield return x - 1;
            }
        }

        var s = GenS();
        Assert.That(s.EnoughSmaller(threshold, howMany), Is.True);
    }

    [Test]
    public void Test4()
    {
        const int howMany = 7;
        var threshold = new MyClass(20);
        var s = new List<MyClass>();
        for (var i = 19; i >= 0; i--)
            s.Add(new MyClass(i));

        s.EnoughSmaller(threshold, howMany);
        Assert.That(MyClass.CallsNumber, Is.EqualTo(7));
    }
}
public class MyClass : IComparable
{
    public static int CallsNumber { get; private set; }
    private readonly int _value;

    public MyClass(int value)
    {
        _value = value;
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        MyClass other = (MyClass)obj;
        return _value == other._value;
    }

    public override int GetHashCode()
    {
        return _value.GetHashCode();
    }

    public int CompareTo(object? obj)
    {
        CallsNumber += 1;
        var myObj = obj as MyClass;
        if (myObj == null)
            throw new ArgumentException();
        
        return _value.CompareTo(myObj._value);
    }
}
