namespace _7feb2020;
[TestFixture]
public class Tests {
    [Test]
    public void Test1() {
        IEnumerable<int>[] s = { new[] { 1 }, new[] { 1, 2 }, new[] { 1, 2, 3 } };
        // E' importante il take, perche' altrimenti l'IEnumerable non viene "caricato"
        Assert.That(() => s.Zip().Take(2).ToArray(), Throws.InstanceOf<ArgumentException>());
    }
    [Test]
    public void Test2() {
        IEnumerable<int>[] s = { new[] { 1, 2, 3, 4 }, new[] { 10, 20, 30, 40 }, new[] { 100, 200, 300, 400 } };
        var actual = s.Zip();
        IEnumerable<int[]> expected = new[] { new[] { 1, 10, 100 }, new[] { 2, 20, 200 }, new[] { 3, 30, 300 }, new[] { 4, 40, 400 } };
        // Console.WriteLine("\nActual:"); foreach (var i in actual){
                                        //     foreach (var j in i)
                                        //         Console.Write(j + " ");
                                        //     Console.WriteLine();
                                        // }
        Assert.That(actual, Is.EqualTo(expected));
    }
    [Test]
    [TestCase(45)]
    public void Test3(int approx) {
        IEnumerable<T> Repeat<T>(T[] source) {
            while (true)
                foreach (var i in source)
                    yield return i;
        }
        const int a = 1;
        const int b = 2;
        const int c = 3;
        IEnumerable<int>[] s = {
            Repeat(new [] {a, b, c}),
            Repeat(new [] {b, c, a}),
            Repeat(new [] {c, a, b})
        };
        var res = s.Zip().Take(approx);
        var expected = Repeat(new[] {
            new[] { a, b, c },
            new[] { b, c, a },
            new[] { c, a, b }
        }).Take(approx);
        Assert.That(res, Is.EqualTo(expected));
    }
}