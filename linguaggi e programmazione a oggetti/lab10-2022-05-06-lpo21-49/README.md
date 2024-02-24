# Laboratorio di LPO, 6 maggio 2022: specifica e realizzazione di un typechecker

### Scopo del laboratorio
Questo secondo laboratorio propedeutico al progetto finale  è dedicato alla realizzazione di un typechecker per il semplice linguaggio di cui
è stato sviluppato il parser nel laboratorio precedente. Anche in questo caso, vista la complessità dell'attività,
buona parte dei sorgenti sono condivisi in forma completa nel repository, inclusi quelli relativi allo sviluppo del parser (soluzione del laboratorio precedente) e all'implementazione degli ambienti (package `lab10_05_06.environments`). Come nel laboratorio precedente, i principali obiettivi sono
- la comprensione del codice già presente;
- il completamento di alcuni metodi della classe `Typecheck` (i dettagli si trovano in fondo a questo README).

La fase di typececking viene implementata tramite opportuna visita dell'albero della sintassi astratta (AST) generato dal parser, utilizzando il
*visitor pattern* (vedere [slide](https://2021.aulaweb.unige.it/mod/resource/view.php?id=106145)).

#### Definizione della semantica statica in OCaml
Come spiegato nelle [slide di riferimento](https://2021.aulaweb.unige.it/mod/resource/view.php?id=107884), la semantica statica del linguaggio è definita in modo non ambiguo e sintetico da un programma in OCaml contenuto nel file `semantica-statica.ml`. 
In esso sono definiti i nodi dell'albero della sintassi astratta, i tipi utilizzati dalla semantica statica (i tipi semplici `int` e `bool` e il tipo composto `pair`), gli scope e ambienti (environment) per la gestione delle dichiarazioni di variabili, le eccezioni che corrispondono ai vari errori di tipo della semantica statica, le funzioni principali che definiscono le regole di tipo (`typecheckProg`, `typecheckStmt`, `typecheckBlock`, `typecheckStmtSeq`, `typecheckExp`), più altre definizioni ausiliarie.

In fondo al file `semantica-statica.ml` trovate anche qualche semplice test eseguibile.

#### Implementazione degli ambienti in Java
Sebbene i sorgenti del package `lab10_05_06.environments` siano completi, è importante comprenderne bene il codice. 
Gli scope sono oggetti di tipo `Map<Variable,T>`, ossia dizionari con chiavi di tipo `Variable` e valori di tipo generico `T`, implementati con la classe `java.util.HashMap`; l'uso del parametro di tipo `T` permette di riusare lo stesso codice anche per gli ambienti dinamici, che saranno necessari nel prossimo laboratorio per implementare la semantica dinamica del linguaggio. Per gli ambienti statici, il parametro `T` corrisponde all'interfaccia `Type`
(vedi dettagli sotto). 

Gli ambienti sono liste di scope implementate con la classe `java.util.LinkedList` dove gli scope sono ordinati per annidamento: il primo elemento della lista è lo scope più annidato, l'ultimo è quello più esterno. 

**Nota bene**: tutti i metodi dell'interfaccia `lab10_05_06.environments.Environment` sono usati dal typechecker implementato nella classe `lab10_05_06.visitors.typechecking.Typecheck`, a parte il metodo `update()` che è utile solamente per l'implementazione della semantica dinamica, argomento del prossimo laboratorio.

#### Implementazione dei tipi in Java
I tipi semplici `int` e `bool` sono costanti del tipo `enum` `lab10_05_06.visitors.typechecking.SimpleType`, mentre i tipi composti `pair` sono oggetti della classe `lab10_05_06.visitors.typechecking.PairType`

L'interfaccia `lab10_05_06.visitors.typechecking.Type`, che rappresenta l'insieme di tutti i possibili tipi, contiene dei metodi di default ausiliari che facilitano le operazioni di controllo dei tipi implementati nel typechecker.

### Typechecker in Java e metodi da completare
L'unica classe da completare è `lab10_05_06.visitors.typechecking.TypeCheck` che implementa il typechecker mediante il visitor pattern.

È importante notare le differenze tra le funzioni di visita dell'AST definite in OCaml (`typecheckProg`, `typecheckStmt`, `typecheckBlock`, `typecheckStmtSeq`, `typecheckExp`) e i metodi di visita della classe `Typecheck`; tali diversità sono dovute all'uso di due paradigmi di programmazione diversi, quello funzionale senza nozione di stato modificabile (OCaml) e quello object-oriented con oggetti modificabili (Java).

* In Java gli ambienti sono oggetti modificabili e il typechecker è un oggetto visitor che contiene il campo `env` (l'ambiente statico) che corrisponde a un unico oggetto che viene via via modificato durante la visita dell'AST mediante i metodi dell'interfaccia `lab10_05_06.environments.Environment` aggiungendo o cancellando scope o inserendo nuove dichiarazioni nello scope più annidato (ossia il primo nella lista degli scope).
* I metodi di visita non hanno bisogno di parametri di tipo `Environment` né di restituire oggetti di tipo `Environment`. Il tipo di ritorno corrisponde sempre a un oggetto `Type` che sarà diverso da `null` solo per i nodi visitati di tipo `Exp`; infatti, la visita dei nodi di tipo `Prog`, `Stmt` e `StmtSeq` non restituisce alcun tipo.

Gli unici metodi di visita già completi sono `Type visitSimpleProg(StmtSeq stmtSeq)`, `Type visitPrintStmt(Exp exp)`, `SimpleType visitAdd(Exp left, Exp right)` e `SimpleType visitNot(Exp exp)`;  l'elenco dei metodi di visita da completare è il seguente:
- `Type visitAssignStmt(Variable v, Exp exp)`
- `Type visitVarStmt(Variable v, Exp exp)`
- `Type visitIfStmt(Exp exp, Block thenBlock, Block elseBlock)`
- `Type visitBlock(StmtSeq stmtSeq)`
- `Type visitSingleStmt(Stmt stmt)`
- `Type visitMoreStmt(Stmt first, StmtSeq rest)`
- `SimpleType visitIntLiteral(int value)`
- `SimpleType visitMul(Exp left, Exp right)`
- `SimpleType visitSign(Exp exp)`
- `Type visitSimpleVariable(Variable var)`
- `SimpleType visitAnd(Exp left, Exp right)`
- `SimpleType visitBoolLiteral(boolean value)`
- `SimpleType visitEq(Exp left, Exp right)`
- `PairType visitPairLit(Exp left, Exp right)`
- `Type visitFst(Exp exp)`
- `Type visitSnd(Exp exp)`

### Tests
Potete utilizzare i test nei seguenti folder
- `tests/success`: programmi corretti rispetto alla sintassi e ai tipi
- `tests/failure/syntax`: programmi con errori di sintassi (come nel laboratorio precedente)
- `tests/failure/static-semantics/`: programmi corretti sintatticamente, ma con errori di tipo






