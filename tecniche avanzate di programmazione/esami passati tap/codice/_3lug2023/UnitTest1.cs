using System.Collections;
using Moq;
namespace _3lug2023;
// Implementare, usando NUnit ed eventualmente Moq, i seguenti test relativi all’esercizio 1.
// 1. Sia receiver un oggetto di tipo MultipleEnumerable<T> che incapsula due sequenze, una con 2 elementi e l’altra con 3, a vostra scelta. Verificate che la MoveNext su un enumeratore relativo a receiver risponda vero sulle prime due chiamate e falso sulla terza.
// 2. Scrivere un test parametrico, con un parametro intero howMany, che verifica la correttez- za dei primi howMany elementi restituiti da un enumeratore relativo ad un oggetto di tipo MultipleEnumerable<T> che incapsula un array di 10 IEnumerable. In tale array, l’i-esimo elemento rappresenta la sequenza infinita dei multipli di i (partendo da 0, quindi 0, i, 2∗i e così via).
// Se il parametro howMany non è strettamente positivo il test dovrà risultare inconclusive.
// 3. Verificate che una invocazione della Dispose sull’enumeratore relativo ad un oggetto di tipo MultipleEnumerable<T> che incapsula 5 IEnumerable (a vostra scelta) generi una e una sola chiamata alla Dispose sull’enumeratore di ciascuno di essi.
public class Tests{
    [Test]
    public void Test1(){
        var source = new IEnumerable<int>[] {new[]{1, 2}, new[]{3, 4, 5}};
        var receiver = new MultipleEnumerable<int>(source).GetEnumerator();
        Assert.Multiple(() => { 
            Assert.That(receiver.MoveNext(), Is.True);
            Assert.That(receiver.MoveNext(), Is.True);
            Assert.That(receiver.MoveNext(), Is.False);
        });
    }
    [Test]
    public void Test2([Range(1, 10)] int howMany){
        if (!(howMany < 0)) Assert.Inconclusive();
        static IEnumerable M(int i){var x = 0; while(true) yield return x += i;}
        var source = new IEnumerable<int>[10];
        for (int i = 0; i < 10; i++)
            source[i] = (IEnumerable<int>)M(i);
        var receiver = new MultipleEnumerable<int>(source).GetEnumerator();
        Assert.Multiple(() => { 
            for (int i = 0; i < 10; i++){
                var expected = new int[10]; 
                for (int j = 0; j < 10; j++) expected[j] = j * i;
                receiver.MoveNext();
                Assert.That(receiver.Current, Is.EqualTo(expected));
            }
        });
    }
    public class MyMock : IEnumerable<int>{
        public int Calls { get; /*private*/ set; }
        public IEnumerator<int> GetEnumerator(){ return new MyEnum(this); }
        IEnumerator IEnumerable.GetEnumerator(){ return /*this.*/GetEnumerator(); }
    }
    public class MyEnum : IEnumerator<int>{
        public MyEnum(MyMock k) { _k = k; }
        MyMock _k;
        public bool MoveNext() => true;
        public int Current => 42;
        object IEnumerator.Current => 42;
        public void Dispose() { _k.Calls++; }
        public void Reset() { }
        // bool IEnumerator.MoveNext(){ return true; }
    }
    [Test]
    public void Test3(){
        var source = new IEnumerable<int>[] {new MyMock(), new MyMock(), new MyMock(), new MyMock(), new MyMock()};
        var receiver = new MultipleEnumerable<int>(source).GetEnumerator();
        receiver.Dispose();
        // var calls = source.Select(s => ((MyMock)s).Calls); // non serve :/
        Assert.Multiple(() => {
            for (int i = 0; i < 5; i++)
                Assert.That(((MyMock)source[i]).Calls,Is.EqualTo(1));
                // Assert.That(calls, Is.All.EqualTo(1));
        });
    }
    // usate Moq, facendo Mock sia di IEnumerable che di IEnumerator e usare il Mock<IEnumerator> che vi siete definiti per descrivere il risultato della GetEnumerator sul Mock di IEnumerable
    [Test]
    public void TestDisposeCallsForEachInnerEnumerator()
    {
        // Mock the IEnumerator<int>
        var mockEnumerator = new Mock<IEnumerator<int>>();
        mockEnumerator.Setup(e => e.MoveNext()).Returns(false); // Enumerator is done

        // Mock the IEnumerable<int>
        var mockEnumerable = new Mock<IEnumerable<int>>();
        mockEnumerable.Setup(e => e.GetEnumerator()).Returns(mockEnumerator.Object);

        // Create the MultipleEnumerable<int> instance with 5 mock IEnumerable<int> instances
        var source = new List<IEnumerable<int>>
        {
            mockEnumerable.Object,
            mockEnumerable.Object,
            mockEnumerable.Object,
            mockEnumerable.Object,
            mockEnumerable.Object
        };

        var receiver = new MultipleEnumerable<int>(source.ToArray()).GetEnumerator();
        receiver.Dispose();

        // Verify that Dispose was called once for each inner IEnumerator<int>
        mockEnumerator.Verify(e => e.Dispose(), Times.Exactly(5));
    }
}