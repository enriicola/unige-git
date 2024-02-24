using System.Collections;
namespace _3lug2023;
// Completate le seguenti classi in modo che un oggetto di tipo MultipleEnumerable<T> incapsuli un array di IEnumerable, source, ottenendo un IEnumerable di array di T. In altre parole, la MoveNext su un suo enumeratore corrisponde a fare la MoveNext sugli enumeratori ottenuti dagli enumerable di source (nell’ordine ovvio) e il Current è un array contente i Current sugli stessi enumeratori.
public class MultipleEnumerable<T> : IEnumerable<T[]>
{
    IEnumerable<T>[] Source { get;}
    public MultipleEnumerable(IEnumerable<T>[] source)
    {
        Source = source;
    }
    public IEnumerator<T[]> GetEnumerator()
    {
        return new MultipleEnumerator<T>(Source.Select(e=> e.GetEnumerator()).ToArray());
    }
    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}
public class MultipleEnumerator<T> : IEnumerator<T[]>
{
    IEnumerator<T>[] Enumerators { get; }
    public MultipleEnumerator(IEnumerator<T>[] enumerators){
        Enumerators = enumerators;
    }
    public bool MoveNext(){
        foreach (var e in Enumerators)
            if (!(e.MoveNext())) return false;
        return true;
    }
    public void Reset(){
        foreach (var e in Enumerators)
            e.Reset();
    }
    public T[] Current{
        get { return Enumerators.Select(e => e.Current).ToArray(); }
    }
    object IEnumerator.Current {
        get{ return /*this.*/Current; }
    }
    public void Dispose(){
        foreach (var e in Enumerators)
            e.Dispose();
    }
}