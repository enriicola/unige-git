using Moq;
namespace _30gen2023;
public class Tests{
    [Test]
    public void Test1(){
        var l = new List<IIdentified>();
        foreach(var elem in new[] { 8, -70, 5, 7, 5 }){
            var m = new Mock<IIdentified>();
            m.Setup(x => x.Key).Returns(elem);
            l.Add(m.Object);
        }
        Assert.Multiple(() => { Assert.That(l.Lookup(8), Is.EqualTo(0)); Assert.That(l.Lookup(5), Is.EqualTo(2)); Assert.That(l.Lookup(11), Is.Null); });
    }
    [Test]
    public void Test2(){
        var r = new Random();
        int next;
        IEnumerable<int?> Infinite(){
            for (var i = 0; i < 42; i++){
                do{ next = r.Next();
                } while (next == 42);
                yield return next;
            }
            yield return null;
            while (true) { yield return r.Next();}
        }
        var l = new List<IIdentified?>();
        foreach(var item in Infinite().Take(50).ToArray()){
            if (item == null) l.Add(null);
            else{
                var m = new Mock<IIdentified>();
                m.Setup(x => x.Key).Returns((int)item);
                l.Add(m.Object);
            }
        }
        Assert.That(() => l.Lookup(42), Throws.TypeOf<ArgumentNullException>());
    }
    [TestCase(20)]
    public void Test3(int size){
        if (size < 20) Assert.Inconclusive(nameof(size));
        var db = new Impl[size];
        for (var i = 0; i < size; i++)
            db[i] = new Impl(i);
        
        var what = 10;
        var actual = db.Lookup(what);
        Assert.Multiple(() =>{ for (int i = 0; i <= what; i++) Assert.That(db[i].Count, Is.EqualTo(1));
                               for (int i = what+1; i < size; i++) Assert.That(db[i].Count, Is.EqualTo(0)); });
    }
}
