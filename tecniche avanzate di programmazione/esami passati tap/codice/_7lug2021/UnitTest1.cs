namespace _7lug2021;
public class Tests
{
    [Test]
    public void Test1(){
        var s = new[] { 42.0, 49.0, 47.0, 18.0, 19.0, 28.0, 26.0 };
        var N = 2;
        Assert.That(() => s.Smooth(N).ToArray(), Throws.TypeOf<FiniteSourceException>());
    }
    [Test]
    public void Test2(){
        var s = GenerateDoubles(0.0);
        var N = -1;
        // sollevata senza enumerare la sorgente neppure parzialmente perchè prima di enumerare faccio controlli su N etc
        Assert.That(() => s.Smooth(N).ToList(), Throws.TypeOf<ArgumentOutOfRangeException>()); 
    }
    private static IEnumerable<double> GenerateDoubles(double d) { while (true) yield return d; }
    [Test]
    [TestCase(4, new[] { 0.0, 0.0, 0.0, 0.0 }, new[] { 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 }, 8)]
    // [TestCase(3, new[] { 1.0, 2.0, 3.0 }, new[] { 1.75, 1.8, 2, 1.8571428571428572, 1.875 }, 3)]
    [TestCase(2, new[] { 1.0, 2.0, 3.0 }, new[] { 2, 1.75, 1.8, 2, 2 }, 5)]
    // expected: 2 - 1,75 - 1,8 - 2 - 2 - 1,8 - 2 - 2 - 1,8 - 2 - 2 - 1,8 - 2 - 2 - 1,8 - 2 - 2 - 1,8 - 2 - 2
    // actual:   2 - 1,75 - 1,8 - 2 - 2 - 2 - 2 - 2 - 2 - 2 - 2 - 2 - 2 - 2 - 2 - 2 - 2 - 2 - 2 - 2
    public void Test3(int N, double[] sourceSample, double[] expectedSample, int howMany)
    { // la cerioli è malata 
        var s = Repeat(sourceSample);
        var expected = NElementsPlusRepeat(expectedSample, N);
        var actual = s.Smooth(N);

        Console.WriteLine("Controllo i primi " + howMany + " elementi");
        // print first 20 elements of s
        Console.WriteLine(("source:   ") + string.Join(" - ", s.Take(20)));
        // print first 20 elements of expected
        Console.WriteLine(("\nexpected: ") + string.Join(" - ", expected.Take(20)));

        Console.WriteLine(("actual:   ") + string.Join(" - ", actual.Take(20)));

        Assert.That(actual.Take(howMany), Is.EqualTo(expected.Take(howMany)));
    }
    private static IEnumerable<double> NElementsPlusRepeat(double[] d, int N){
        for (int i = 0; i < N; i++) yield return d[i];
        while (true) for(int i = N; i < d.Length; i++) yield return d[i];
    }
    private static IEnumerable<double> Repeat(double[] d){
        while (true) foreach (var item in d) yield return item;
    }
}