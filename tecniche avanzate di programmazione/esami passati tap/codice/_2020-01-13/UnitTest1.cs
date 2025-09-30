using Moq; using Range = System.Range; namespace _13gen2020;
public class Tests{
    public enum Day { Mo, Tu, We, Th, Fr } public enum Colors { Bianco, Grigio, Nero }
    public class C<T> : I<T> {
        private I<T> _fieldImplementation;
        public T Value { get; set; }
        public C(T value) { Value = value; }
        public override bool Equals(object? obj) { return obj is C<T> elem && Value.Equals(elem.Value); }
        public override int GetHashCode() { return Value.GetHashCode(); }
        public T P => _fieldImplementation.P; }
    [Test]
    public void Test1() {
        var e0 = new Mock<I<Day>>(); e0.Setup(x => x.P).Returns(Day.Mo);
        var e1 = new Mock<I<Day>>(); e1.Setup(x => x.P).Returns(Day.Mo);
        var e3 = new Mock<I<Day>>(); e3.Setup(x => x.P).Returns(Day.Mo);
        var e4 = new Mock<I<Day>>(); e4.Setup(x => x.P).Returns(Day.Mo);
        var arr = new[] { e0.Object, e1.Object, null, e3.Object, e4.Object };
        Assert.That(() => arr.Indexing(), Throws.TypeOf<ArgumentNullException>()); }
    [Test]
    public void Test2() {
        var e0 = new Mock<I<Day>>();
        e0.Setup(x => x.P).Returns(Day.Mo);
        var e1 = new Mock<I<Day>>();
        e1.Setup(x => x.P).Returns(Day.Mo);
        var e2 = new Mock<I<Day>>();
        e2.Setup(x => x.P).Returns(Day.We);
        var e3 = new Mock<I<Day>>();
        e3.Setup(x => x.P).Returns(Day.Mo);
        var e4 = new Mock<I<Day>>();
        e4.Setup(x => x.P).Returns(Day.Fr);
        var e5 = new Mock<I<Day>>();
        e5.Setup(x => x.P).Returns(Day.We);
        var arr = new[] { e0.Object, e1.Object, e2.Object, e3.Object, e4.Object, e5.Object };
        var result = arr.Indexing();
        Assert.Multiple(() =>{ Assert.That(result[Day.Mo], Is.EqualTo(new[] { e0.Object, e1.Object, e3.Object }));
            Assert.That(result[Day.Tu], Is.Empty);
            Assert.That(result[Day.We], Is.EqualTo(new[] { e2.Object, e5.Object }));
            Assert.That(result[Day.Th], Is.Empty);
            Assert.That(result[Day.Fr], Is.EqualTo(new[] { e4.Object })); }); }
    [TestCase(9)]
    public void Test3(int howMany) {
        var arr = new I<Colors>[3 * howMany];
        var e0 = new Mock<I<Colors>>();
        e0.Setup(x => x.P).Returns(Colors.Bianco);
        var e1 = new Mock<I<Colors>>();
        e1.Setup(x => x.P).Returns(Colors.Grigio);
        var e2 = new Mock<I<Colors>>();
        e2.Setup(x => x.P).Returns(Colors.Nero);
        for (int i = 0; i < arr.Length; i += 3){
            arr[i] = e0.Object;
            arr[i + 1] = e1.Object;
            arr[i + 2] = e2.Object;
        }
        var result = arr.Indexing();
        Assert.Multiple(() => { Assert.That(result[Colors.Bianco].Take(Range.All).Count(x => x.P == Colors.Bianco), Is.EqualTo(howMany));
            Assert.That(result[Colors.Grigio].Take(Range.All).Count(x => x.P == Colors.Grigio), Is.EqualTo(howMany));
            Assert.That(result[Colors.Nero].Take(Range.All).Count(x => x.P == Colors.Nero), Is.EqualTo(howMany)); });
    }
}