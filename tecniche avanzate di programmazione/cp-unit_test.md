# Unit testing

Lo unit testing e' quella fase di test in cui si testano
le singole **unita'** del programma (metodi, funzioni)

Con "testano" si intende controllare che le condizioni siano soddisfatte.

piu' riusciamo a isolare il problema, meglio e'. Quindi, piu' sono
piccole le unita', piu' e' semplice trovare l'errore (se c'e').

Voglio che il test sia automatico. Esistono di fatti dei test-framework apposta. Altrimenti tanto varrebbe farlo a mano

Il test deve essere deterministico, quindi dato un input, poter determinare sempre l'output. Deve essere veloce e usabile da chiunque. Alcuni test sono inevitabilmente lenti (es. cosa succede se il DB non risponde).

Nota: lo unit test deve basarsi su un singolo metodo, se questo metodo richiama un'altra unit, magari anche molto complicata, non si parla piu' di unit testing (magari di integration-testing).

Inoltre, il test e' una maniera furba di documentare il nostro codice, perche' inevitabilmente rimarra' aggiornato rispetto al software che stiamo sviluppando. Mentre una documentazione scritta a mano va aggiornata man mano.

\underline{NOTA}: esistono dei test che possono essere scritti in linguaggio naturale che poi vengono "trasformati" in un test scritto in linguaggio di programmazione. Esempio: nella casella di help scrivo "voglio prenotare" ed esce la voce per effettuare una prenotazione.

## Test driven development

Scrivo il codice anche in base ai test che dovra' passare. Storicamente, il test veniva scritto dopo (o durante) lo sviluppo di tutto il codice, mentre questo modello scrive prima i test che dovra' passare.

Quindi, scrivo un singolo test, e per questo test scrivo unicamente il singolo pezzo di codice per far si che tutto passi il test nuovo

La grande differenza e' che questo metodo di sviluppo si concentra sul progetto "a pezzetti".

Generalmente, il codice fa rifattorizzato spesso siccome il codice implementato cosi' pezzo per pezzo e' spesso scritto male. Dopo la rifattorizzazione rieseguo i test (potrei aver rotto qualcosa).

### **PROGETTO TAP**

nel progetto alcuni test ci sono gia', si usano uno alla volta per capire e implementare, poi bisogna implementare quelli mancanti. Saranno utili come documentazione per capire quando le specifiche testuali sono ambigue. Esempio: "questo numero e' positivo", significa strettamente positivo? guardo il test per capirlo.


Il **refactoring** migliora la qualita' del codice, dando magari dei nomi piu' significativi a degli identificatori che nel corso dello sviluppo hanno cambiato funzionalita', per esempio.

## Testing framework

Ne esistono molti, VS supporta nativamente MSTest (nativo), NUnit, xUnit.Net

\underline{Noi useremo NUnit}.

Fa parte della famiglia xUnit (JUnit, CppUnit...), e' free, ben documentato e supportato da ReSharper (e VS tramite NUnut Test Adapter).

in VS si puo' creare un test aggiungendolo come progetto a una solution, questo importa automaticamente le libreire e i namespace necessari (tramite using)

Hanno introdotto una nuova funzionalita' chiamata `global using`. Questo crea un file apposito per gli using (credo)

I test sono metodi, quindi vivono dentro delle classi.

```cs
[TestFixture]
class Test {
    [Test]
    public bool TestPositive() {
        // ...
    }
}
```

nota che le `[..]` servono per annotare che una data classe e' per i test (`[TestFixture]`) mentre un metodo etichettato con `[Test]` e' un metodo di test. Queste annotazioni servono al test framework per dichiarare quale metodo e' un test da eseguire e quale no.

Questa notazione vale per NUnit ovviamente (`[TestFixture], [Test]` sono contenuti in `NUnit.Framework`).

```cs
namespace TestProject1 {
    [TextFixture]
    public class Tests {
        [SetUp]
        public void Setup() {...}

        public void NotATest() {...}

        [Test]
        public void Test1(){...}
        [Test]
        public void Test2(){...}
    }
}
```

Una **sessione** e' un blocco di test dentro a una singola classe

### Requisiti per usare il test runner

I test non possono avere dei parametri forniti al tempo della chiamata. I test devono essere pubblici, perche' i test e il progetto sono su due dll separati. Il costruttore deve essere senza parametri. I metodi di test non devono avere parametri e il tipo di ritorno deve essere void (e annotati da `[Test]`).

In realta' i test possono avere parametri ma non posso passarli alla funzione, vanno passati in una maniera specifica.

```cs
/*
    Lo schema suggerito per i nomi dei test e' 
    <Classe>_<Metodo>_<CosaTesto>Returns<CosaRitorno>as<TipoDiRitorno>()
*/
[Test]
public void Parser_Parse_ValidArgString42Returns42AsInt() {
    // 1. Creo il setup (tutto quello che mi serve per testare)
    // In genere l'oggetto su cui far la chiamata e gli argomenti
    // da passargli
    var p = new Parser();

    // 2. Call under Test
    // Invoco il metodo per controllare il risultato
    // In questo caso il metodo Parse sulla stringa "42"
    var returnValue = p.Parse("42");

    // 3. Asserzione
    Assert.That(returnValue, Is.EqualTo(42));

    // 4. Tear-down
    // nel caso avessi allocato memoria, la rilascio
    // NOTA: in C# e Java non posso farlo, lo fa in automatico
    // l'unica cosa che posso fare e' rendere irragiungibile
    // la variabile p che abbiamo creato
    // non e' molto utile in quanto subito dopo chiudo il metodo
    // in un test serio, avendo magari un test che inserisce in una BDD
    // dobbiamo eliminare ovviamente la roba inserita con il test
    p = null;
}
```

### Stili di Assert

In generale c'e' una classe `Assert`, con altre classi specifiche per altre strutture (`AssertArray`...), dentro alle quali troviamo dei meotodi per asserire alcuni valori.

```cs
Assert.AreEqual
Assert.True
CollectionAssert.AreEquivalent
...
```

E' un modo abbastanza vecchiotto per asserire dei valori (`modello classico`).

Il `modello a vincoli` invece ho un'unica classe `Assert`, un unico metodo `That`, come primo argomento il risultato della chiamata e come secondo argomento un vincolo.

```cs
// NUnit usa questo paradigma
Assert.That(..., Is.EqualTo(...))
Assert.That(..., Is.True)
Assert.That(..., Is.EqivalentTo(...))
...
```

Ci sono le varie classi factory che raggruppano vincoli significativamente simili tra di loro.

il `modello fluent` invece usa un tipo specifico di asserzioni

```cs
actual.Should().BeEqualTo(...).And(...)
```

In pratica concateno tutti i risultati delle asserzioni. E' molto potente, ma non sempre leggibile.

E' diverso dal modello a vincoli perche' a vincoli si fa un'asserzione alla volta. Il modello fluent ci permette di fare molte asserzioni tutte insieme. E' possibile che escano fuori delle espressioni fuorvianti.

### Stili di assert su NUnit

\underline{Esisteva} il modello classico, ora non e' piu' aggiornato e viene mantenuto per retrocompatibilita'. Ora si usa (e noi useremo) il modello a constraint (`Assert.That(..., Is.EqualTo(...))`, come terzo parametro opzionale c'e' il messaggio da visualizzare in caso di fallimento (C'e' gia' di default)). E' utile questo modello perche' a differenza del modello fluent (e classico) sa dirmi esattamente dove l'asserzione non e' andata a buon fine.

#### Cos'e' un constraint

Un qualunque oggetto che implementa `IResolveConstraint`, possiamo definirli custom. Nel 99% delle volte esiste gia' quello di cui ho bisogno

La chiamata del metodo deve essere discorsiva

```cs
// le classi helper sono
// Is, Has, Does, Contains, Throws...
Assert.That(actual, Is.Ordered.Ascending.And.Contains(3));
// A differenza dello stile fluent, non agisco mai su actual (actual.Should()...)
```

### Testing eccezioni

E' possibile usare le assert aspettandosi delle eccezioni

```cs
Assert.That(actual, Throws.InstanceOf<ArgumentNullException>());
Assert.That(actual, Throws.InstanceOf<ArgumentNullException>().With.Property("InnerException").EqualTo("InnerExceptionGiven"));

[Test]
public void Parser_Parse_NullArgThrows () {
    Assert.That(() => new Parser().Parse(null), Throws.TypeOf<ArgumentNullException>);
}

// NOTA: () => new ... e' necessario, perche' trasforma una chiamata di metodo in una action che viene utilizzata come parametro per l'Assert.That, quindi viene valutata come una funzione, e quindi e' possibile determinare se solleva o no un'eccezione

// InstanceOf: lei e le sue eccezioni figlie (inner exception)
// TypeOf: proprio quell'eccezione li' (e basta)
```

## SetUp e TearDown

Nei nostri test spesso ci sono dei pattern che sono ricorrenti.

```cs
...
var p = new ...
...
// tear down
p = null
```

il test runner offre delle feature per fare queste operazioni in tutti i test senza doverle per forza scrivere ogni volta

```cs
[SetUp]
public void init() {
    _parser = new Parser();
}

[TearDown]
public void CleanUp(){
    _parser = null;
}

[Test]
public void Parser_Parse_ValidString(){
    _parser.Parse(/*...*/);
}
```

Potremmo voler usare una batteria di test su un utente nuovo, per esempio, e un'altra su un utente gia' esistente

```cs
[TestFixture]
public class TestNewCustomer {
    private Customer customer;

    [SetUp]
    public void init() {
        customer = new Customer();
    }

    [TearDown]
    public void CleanUp() {
        customer = null;
    }

    /*
        NOTA: i TearDown che si occupano della memoria sono sostanzialmente
        inutili, siccome alla fine di ogni test l'istanza viene autonomamente rilasciata
    */
}

[TestFixture]
public class TestOldCustomer {
    // ...
}
```

Ovviamente, quando facciamo queste modifiche proviamo a runnare tutti i test per vedere di non aver combinato disastri

\underline{NOTA}: creare un campo statico nella classe di test da usare come customer e' un'idea **terribile**

nel caso di classe di test che estende un'altra classe di test, se il padre ha un metodo SetUp/TearDown, il figlio li eredita. Vengono eseguiti i SetUp nell'ordine dei costruttori e i TearDown nell'ordine inverso

Verrebbero eseguiti prima il SetUp del padre, poi il SetUp del figlio, poi il TearDown del figlio, poi il TearDown del padre.

```cs
[OneTimeSetup]
[OneTimeTearDown]
```

sono due annotazioni che vengono eseguite prima del primo test (e dopo l'ultimo rispettivamente)

```cs
[Ignore("...")][Test]
```

E' un'annotazione che serve per far si che in questo momento questo specifico test non venga eseguito insieme agli altri (magari e' incompleto o inconsistente)

```cs
[TestCase(42.42)]
public void PriceUpTo100NoDiscount(double price){
    if(price < 0)
        Assert.Inconclusive("price cannot be less than 0");
}
```

Questa asserzione specifica che il risultato non e' significativo (ne' giusto ne' sbagliato)

La differenza tra ignore e inconclusive e' che l'inconclusive viene eseguito e specifica meglio il punto in cui il test non serve.

```cs
[Category]
```

E' possibile annotare un test con una nuova categoria per poter eseguire, per esempio, solo i test appartenenti a quella categoria

### Come testare le classi internal?

Dobbiamo ricorrere ad un attributo di livello assembly

```cs
[assembly:InternalsVisibleTo("nome del progetto di test")]
```

In questo modo posso far vedere alla classe di test anche le classi internal della classe da testare

La stringa sara' il nome della .dll da usare, a volte capita che ci sia la firma (delle cifre)

possiamo usare questa annotazione anche per far vedere le nostre classi internal ai nostri colleghi di progetto

### Code Coverage

Come faccio a sapere se ho fatto abbastanza test? Purtroppo, c'e' sempre un bug non trovato. E' importante capire quando pero' la qualita' del codice e' accettabile. La code coverage e' una misura che indica quale percentuale di sorgenti viene coperta dall'esecuzione dei test (nel caso ideale il 100% )