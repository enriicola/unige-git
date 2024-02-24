# Operator overloading

Sappiamo cosa significa fare l'overloading dei metodi. Questa operazione si puo' fare anche sugli operatori gia' presenti nel linguaggio

```cs
DateTime x = DateTime.Now;
DateTime y = new DateTime(1982, 1, 1);
TimeSpan t = x - y;
DateTime k = x + t;
```

Possiamo ridefinire alcuni operatori del linguaggio, ma non quello di assegnazione poiche' e' un operatore core del linguaggio. Non posso definire nuovi operatori.

Non si fa spesso, lo si fa solamente quando e' conveniente a livello di leggibilita' (utilizzo spesso questo operatore)

## Esempio di definizione

```cs
public class C {
    public static C operator +(C x, int y) {/*...*/}
}
```

si puo' specificare anche il modo (implicito o esplicito)

```cs
// Queste sono conversioni
// Nota: conversioni e cast sono due cose diverse, il cast
// lo si fa quando si hanno una classe padre e una classe figlia
// mentre una conversione puo' avvenire anche da C a int
public static implicit operator C(int i) {/*...*/} // i -> c
public static explicit operator string (C from) {/*...*/} // c -> s

// un esempio di uso dei due operatori soprastanti sono
C c = 42;
int i = c; // operatore implicito
string s = (string)c; // operatore esplicito

// da notare che sarebbe stato piu' utile e sensato usare
string s = c.ToString();

// dipende dal cosa sembra migliore fare all'utente (hanno lo stesso risultato)
```

se si definisce `==` e' buona norma ridefinire `GetHashCode` (serve a sparpagliare gli elementi per poterli indicizzare)

alcuni operatori suggeriscono simmettria (se e' definito `operator +(C x, int i)` e' meglio ridefinire `operator +(int i, C c)`)

```cs
public static C operator +(C x, int y) {/*...*/}
public static C operator +(int y, C x) => x + y;
```

Come faccio a ridefinire l'hash code in maniera furba? ci sono degli algoritmi appositi per generare l'hash code

visual studio e resharper offrono il code snippet per ridefinire sia l'`==` che l'hash code

### parentesi su Equals

`Equals(c0, c1)` e `Equals(c1, c0)` sono equivalenti?

l'Equals originario dice che se sono entrambi null o sono lo stesso riferimento allora sono uguali

`Equals(fist, second)` equivale a `first.Equals(second)`

a questo punto, `c0.Equals(c1)` e' equivalente a `c1.Equals(c0)`? Non lo so, dipende da come sono definiti i metodi Equals nei due oggetti

se uno dei due e' null? e se viene chiamato equals sull'oggetto a null? Viene sollevata una `NullReferenceException`

```cs
var c1 = null;
var c2 = null;
c1.Equals(c2); // NullReferenceException
c2.Equals(c1); // NullReferenceException
Equals(c1, c2); // true
```