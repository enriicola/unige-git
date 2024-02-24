# Laboratorio di LPO, 13 maggio 2022: specifica e realizzazione di un interprete

### Scopo del laboratorio
Questo terzo e ultimo laboratorio propedeutico al progetto finale  è dedicato alla realizzazione di un interprete per il semplice linguaggio di cui
sono stati sviluppati il parser e il typechecker nei laboratori precedenti. Anche in questo caso, vista la complessità dell'attività,
buona parte dei sorgenti sono condivisi in forma completa nel repository, inclusi quelli relativi allo sviluppo del parser (soluzione del laboratorio 9) e del typechecker  (soluzione del laboratorio 10) e all'implementazione degli ambienti (package `lab11_05_13.environments`). Come nei laboratori precedenti, i principali obiettivi sono
- la comprensione del codice già presente;
- il completamento di alcuni metodi della classe `Execute` (i dettagli si trovano in fondo a questo README).

L'interprete viene implementato tramite opportuna visita dell'albero della sintassi astratta (AST) generato dal parser, utilizzando il
[*visitor pattern*](https://2021.aulaweb.unige.it/mod/resource/view.php?id=106145) in modo analogo al laboratorio precedente.

#### Definizione della semantica dinamica in OCaml
Come per la semantica statica, la [semantica dinamica](https://2021.aulaweb.unige.it/mod/resource/view.php?id=109487) del linguaggio è definita in modo non ambiguo e sintetico da un programma in OCaml contenuto nel file `semantica-dinamica.ml`. 
In esso sono definiti i nodi dell'albero della sintassi astratta, i valori utilizzati dalla semantica dinamica (interi, booleani e coppie), gli scope e ambienti (environment) per la gestione delle variabili, le eccezioni che corrispondono ai vari errori di tipo della semantica dinamica, le funzioni principali che definiscono la semantica (`executeProg`, `executeStmt`, `executeBlock`, `executeStmtSeq`, `evalExp`), più altre definizioni ausiliarie.

In fondo al file `semantica-dinamica.ml` trovate anche qualche semplice test eseguibile.

#### Implementazione degli ambienti in Java
Sebbene i sorgenti del package `lab11_05_13.environments` siano completi, è importante comprenderne bene il codice. 
Gli scope sono oggetti di tipo `Map<Variable,T>`, ossia dizionari con chiavi di tipo `Variable` e valori di tipo generico `T`, implementati con la classe `java.util.HashMap`; l'uso del parametro di tipo `T` permette di usare lo stesso codice per ambienti statici e dinamici. Per gli ambienti dinamici, il parametro `T` corrisponde all'interfaccia `Value` (vedi dettagli sotto). 

Gli ambienti sono liste di scope implementate con la classe `java.util.LinkedList` dove gli scope sono ordinati per annidamento: il primo elemento della lista è lo scope più annidato, l'ultimo è quello più esterno. 

**Nota bene**: tutti i metodi dell'interfaccia `lab11_05_13.environments.Environment` sono usati dall'interprete implementato nella classe `lab11_05_13.visitors.execution.Execute`, in particolare, il metodo `update()` per gestire l'assegnazione di variabili.

#### Implementazione dei valori in Java
I valori interi e booleani sono oggetti delle classi `lab11_05_13.visitors.execution.IntValue` e `lab11_05_13.visitors.execution.BoolValue`, che estendono
la classe `lab11_05_13.visitors.execution.SimpleValue<T>` che definisce oggetti che contengono semplici valori implementabili con classi predefinite
come `Integer` e `Boolean`; le coppie sono oggetti della classe `lab11_05_13.visitors.execution.PairValue`. I metodi `equals()` e `hashCode()` sono stati ridefiniti per gestire correttamente l'operatore di uguaglianza tra valori, così come il metodo `toString()`, necessario per l'esecuzione dello statement `print`. 

L'interfaccia `lab11_05_13.visitors.execution.Value`, che rappresenta l'insieme di tutti i possibili valori, contiene metodi default di conversione
che hanno i seguenti scopi (per esempi d'uso di questi metodi fare riferimento ai metodi `visitAdd()` e `visitNot()` nella classe `Execute`):
- sono necessari affinché il codice Java dell'interprete sia corretto dal punto di vista dei tipi;
- effettuano un controllo dinamico dei tipi dei valori, necessario quando l'interprete viene eseguito con l'opzione `-ntc` (no typechecking). 
Il comportamento di default dei metodi di conversione è sollevare un'eccezione di tipo `InterpreterException`; i metodi sono ridefiniti nelle classi che implementano `Value`, quando la conversione è corretta; per esempio, il metodo `int toInt()` è ridefinito nella classe `IntValue` in modo che venga restituito il numero contenuto nell'oggetto di tipo `IntValue`.   

### Interprete in Java e metodi da completare
L'unica classe da completare è `lab11_2023.visitors.execution.Execute` che implementa l'interprete mediante il visitor pattern, in modo analogo
a quanto fatto per il typechecker del laboratorio precedente.

È importante notare le differenze tra le funzioni di visita dell'AST definite in OCaml (`executeProg`, `executeStmt`, `executeBlock`, `executeStmtSeq`, `evalExp`) e i metodi di visita della classe `Execute`; tali diversità sono dovute all'uso di due paradigmi di programmazione diversi, quello funzionale senza nozione di stato modificabile (OCaml) e quello object-oriented con oggetti modificabili (Java).

* In Java gli ambienti sono oggetti modificabili e l'interprete è un oggetto visitor che contiene il campo `env` (l'ambiente dinamico) che corrisponde a un unico oggetto che viene via via modificato durante la visita dell'AST mediante i metodi dell'interfaccia `lab11_05_13.environments.Environment` aggiungendo o cancellando scope, inserendo nuove dichiarazioni nello scope più annidato (ossia il primo nella lista degli scope) o modificando i valori associati alle variabili già dichiarate.
* I metodi di visita non hanno bisogno di parametri di tipo `Environment` né di restituire oggetti di tipo `Environment`. Il tipo di ritorno corrisponde sempre a un oggetto `Value` che sarà diverso da `null` solo per i nodi visitati di tipo `Exp`; infatti, la visita dei nodi di tipo `Prog`, `Stmt` e `StmtSeq` non restituisce alcun valore.

Gli unici metodi di visita già completi sono `Value visitSimpleProg(StmtSeq stmtSeq)`, `Value visitPrintStmt(Exp exp)`, `IntValue visitAdd(Exp left, Exp right)` e `BoolValue visitNot(Exp exp)`;  l'elenco dei metodi di visita da completare è il seguente:

- `Value visitAssignStmt(Variable v, Exp exp)`
- `Value visitVarStmt(Variable v, Exp exp)`
- `Value visitIfStmt(Exp exp, Block thenBlock, Block elseBlock)`
- `Value visitBlock(StmtSeq stmtSeq)`
- `Value visitSingleStmt(Stmt stmt)`
- `Value visitMoreStmt(Stmt first, StmtSeq rest)`
- `IntValue visitIntLiteral(int value)`
- `IntValue visitMul(Exp left, Exp right)`
- `IntValue visitSign(Exp exp)`
- `Value visitSimpleVariable(Variable var)`
- `BoolValue visitAnd(Exp left, Exp right)`
- `BoolValue visitBoolLiteral(boolean value)`
- `BoolValue visitEq(Exp left, Exp right)`
- `PairValue visitPairLit(Exp left, Exp right)`
- `Value visitFst(Exp exp)`
- `Value visitSnd(Exp exp)`

### Tests
Potete utilizzare i test nei seguenti folder
- `tests/success`: programmi corretti rispetto alla sintassi e ai tipi
- `tests/failure/syntax`: programmi con errori di sintassi (come nel laboratorio precedente)
- `tests/failure/static-semantics/`: programmi corretti sintatticamente, ma con errori di tipo
- `tests/failure/static-semantics-only/`: programmi corretti sintatticamente che sono eseguiti senza errori con l'opzione `-ntc` (no typechecking) nonostante contengano degli errori di tipo. 
