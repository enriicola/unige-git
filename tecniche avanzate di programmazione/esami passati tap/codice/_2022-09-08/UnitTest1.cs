namespace _8set2022;
public class Tests
{ 
    public class MyException : Exception
    {
        private static int _count;
        public int Index { get; } = ++_count;
        public MyException() { }
        public MyException(string message) : base(message) { }
        public MyException(string message, Exception innerException) :
            base(message, innerException) { }
    }
    
    [Test]
    public void Test1()
    {
        int Generator(int a, int b) => a + b;
        var actual = new Dictionary<int, IEnumerable<int>>();
        var i = 0;
        const int seed = 1;
        foreach(var line in ExtraMath.GeneralizedTartaglia(seed, Generator).Take(5))
        {
            actual.Add(i++, line);
        }
        var expected = new Dictionary<int, IEnumerable<int>>() {
            { 0, new[] { 1 } },
            { 1, new[] { 1,1 } },
            { 2, new[] { 1,2,1 } },
            { 3, new[] { 1,3,3,1 } },
            { 4, new[] { 1,4,6,4,1 } },
        };
        Assert.That(actual, Is.EqualTo(expected));
    }
    
    [Test]
    public void Test2()
    {
        string Concat(string a, string b) => a.Length != 4 && b.Length != 4 ? a + b : throw new MyException("concat");
        try
        {
            var generator = Concat;
            var seed = "x";
            ExtraMath.GeneralizedTartaglia(seed, generator); // non metto var, tanto deve lanciare un'eccezione
        }
        catch (AggregateException aex)
        {
            var indexList = new List<int>();
            foreach(MyException exception in aex.InnerExceptions)
            {
                indexList.Add(exception.Index);
            }
            Assert.That(indexList, Is.EqualTo(new[] {1,2,3,4}));
        }
    }
    
    [TestCase(5)]
    [TestCase(0)]
    public void Test3(int lineNumber)
    {
        if (lineNumber <= 0) Assert.Inconclusive();
        int isCalled = 0;
        int Generator(int a, int b) => a + b;
        const int seed = 1;
        var triangle = ExtraMath.GeneralizedTartaglia(seed, Generator).Take(lineNumber); 
        foreach(var line in triangle)
        {
            var lenght = line.ToArray().Length; //nella prima e nella seconda riga non ci sono somme ma la seconda si annulla con il -2
            if (lenght != 1)
                isCalled += lenght - 2;
        }
        Assert.That(isCalled, Is.EqualTo(((lineNumber-1)*(lineNumber-2))/2)); }
}