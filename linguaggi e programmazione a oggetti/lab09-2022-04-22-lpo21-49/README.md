# Laboratorio di LPO, 22 aprile 2022: parser top-down ricorsivi 

## Scopo del laboratorio
Questo è il primo dei tre laboratori propedeutici al progetto finale e dedicati
allo sviluppo di un interprete di un semplice linguaggio di programmazione.

Ognuno dei tre laboratori sarà incentrato sulle diverse fasi di progettazione e implementazione di un linguaggio di programmazione: 
1. analisi lessicale e sintattica: sviluppo di un tokenizer, di un parser e implementazione dell'albero della sintassi astratta (AST);
2. semantica statica: sviluppo di un typechecker per il controllo dei tipi, basato su una opportuna visita dell'AST;
3. semantica dinamica: sviluppo di un interprete (ossia, di una macchina virtuale) in grado di valutare le espressioni ed eseguire le istruzioni
del linguaggio; l'implementazione sarà basata su un altro tipo di visita dell'AST.

Il progetto finale di LPO consisterà nell'estensione del linguaggio implementato in questi ultimi laboratori, quindi le soluzioni proposte
per essi saranno un buon punto di partenza per la realizzazione del codice da consegnare. 

Questo laboratorio è incentrato sulla fase 1 indicata sopra; sviluppare un tokenizer e un parser non è un compito semplice, anche per un linguaggio giocattolo: si tratta di più di 700 linee di codice (escludendo commenti e linee vuote) distribuite su una quarantina di file diversi! Per semplicità buona parte del codice è già presente nel repository, i principali obiettivi sono
- la comprensione del codice già presente;
- il completamento del codice di alcune classi (i dettagli si trovano in fondo a questo README).

A tale scopo è utile consultare le slide della [lezione sui parser top-down ricorsivi e i
tipi enum](https://2021.aulaweb.unige.it/mod/resource/view.php?id=101555)

### Specifica della sintassi del linguaggio
La grammatica EBNF del linguaggio si trova commentata all'inizio del file `lab_09_04_22.parser.BufferedParser` già in forma adatta per lo sviluppo di un parser con associatività sintattica da sinistra degli operatori binari; è una guida indispensabile per lo sviluppo del codice della classe
`lab_09_04_22.parser.BufferedParser`.
```txt
Prog ::= StmtSeq EOF
StmtSeq ::= Stmt (';' StmtSeq)?
Stmt ::= 'var'? IDENT '=' Exp | 'print' Exp |  'if' '(' Exp ')' Block ('else' Block)? 
Block ::= '{' StmtSeq '}'
Exp ::= And (',' And)* 
And ::= Eq ('&&' Eq)* 
Eq ::= Add ('==' Add)*
Add ::= Mul ('+' Mul)*
Mul::= Atom ('*' Atom)*
Atom ::= 'fst' Atom | 'snd' Atom | '-' Atom | '!' Atom | BOOL | NUM | IDENT | '(' Exp ')'
```
La grammatica si basa su alcune categorie lessicali definite in `lab_09_04_22.parser.BufferedTokenizer` e associate a costanti di tipo 
`lab_09_04_22.parser.TokenType`: la costante `IDENT` rappresenta gli identificatori di variabile, le costanti `BOOL` e `NUM` i literal di tipo booleano e naturale.
La costante `EOF` identifica il token end-of-file. I programmi corretti sintatticamente sono definiti dal non-terminale `Prog` e consistono di sequenze non vuote di istruzioni separate dal simbolo terminale `;`.

### Tokenizer
Il parser  `lab_09_04_22.parser.BufferedParser` usa `lab_09_04_22.parser.BufferedTokenizer` (il tokenizer che implementa l'interfaccia
`lab_09_04_22.parser.Tokenizer`) e il tipo `lab_09_04_22.parser.TokenType` di tutti i possibili token; entrambi i sorgenti nel repository sono completi e funzionanti. La nozione di token è un'astrazione della nozione di lessema
che permette di passare dalla sintassi concreta a quella astratta. Per esempio, il tipo  `STMT_SEP` corrisponde al token che separa due istruzioni;
il parser si riferisce a esso indipendentemente dalla sua sintassi concreta (il simbolo `;`). In questo modo il codice risulterà più leggibile e più facilmente modificabile: nel caso si volesse usare un simbolo diverso, basterà modificare `lab_09_04_22.parser.BufferedTokenizer` lasciando invariato il codice del parser in `lab_09_04_22.parser.BufferedParser`. In modo del tutto simile, vengono definiti i tipi di token per le
parole chiave (keyword), ossia quelle stringhe riservate che non possono essere usate come identificatori; per esempio, `PRINT` corrisponde alla parola chiave usata per l'istruzione di stampa; il parser si riferisce a questo tipo di token indipendentemente dalla sua rappresentazione concreta (la stringa `print`).

<!-- Come noterete, la parte di definizione  dei token è statica, ossia realizzata tramite variabili di classe, poiché sarebbe poco pratico e non particolarmente
utile creare tokenizer a partire dalla stessa classe in grado di definire token diversi. -->
I campi di classe `keywords` e `symbols` definiscono i dizionari che associano
alle parole chiavi e ai simboli concreti il loro corrispondente tipo di token; i simboli sono stringhe di caratteri non alfanumerici, mentre le keyword sono stringhe di lettere che non possono essere usate come identificatori; vedere per esempio il programma `tests/failure/prog09.txt`.

Le costanti di tipo `Group` rappresentano i gruppi dell'espressione regolare contenuta nel campo `regEx` e usata dal `matcher` del tokenizer;
il loro ordine è importante per un corretto funzionamento del tokenizer e deve coincidere con l'ordine in cui le varie sotto espressioni vengono
combinate per definire `regEx`:

```java
regEx = String.join(regExUnion, symbolRegEx, keywordRegEx, skipRegEx, identRegEx, numRegEx); // concatena nell'ordine 'symbolRegEx' ... 'numRegEx' usando 'regExUnion' come separatore 
```
In questo modo il metodo `assignTokenType()` della classe `lab_09_04_22.parser.BufferedTokenizer` può usare correttamente il
metodo predefinito `ordinal()` del tipo `Group` per restituire il numero naturale che corrisponde alla posizione di ogni costante definita in `Group` e individuare il corretto tipo di token riconosciuto dal tokenizer.

**Importante**: le costanti `Group.SKIP`, `Group.IDENT` e `Group.NUM` sono diverse da
`TokenType.SKIP`, `TokenType.IDENT` e `TokenType.NUM`: le prime si riferiscono a gruppi dell'espressione regolare `regEx`, le seconde ai corrispondenti tipi di token (`SKIP` spazi bianchi e commenti su singola linea, `IDENT` identificatori, `NUM` literal numerici); l'ordine con cui sono dichiarate le costanti di tipo `lab09_04_22.parser.TokenType` non è rilevante per il riconoscimento dei token, come accade invece per il tipo `Group`. L'uso dell'istruzione
`import static lab09_04_22.parser.TokenType.*` permette di usare il nome semplice per riferirsi alle costanti di tipo `TokenType` all'interno di `lab09_04_22.parser.BufferedTokenizer`; per esempio,  `SKIP`, `IDENT` e `NUM` sono un'abbreviazione di `TokenType.SKIP`, `TokenType.IDENT` e `TokenType.NUM`.

Il tokenizer `lab_09_04_22.parser.BufferedTokenizer` implementa l'interfaccia `lab_09_04_22.parser.Tokenizer` con i seguenti metodi usati nella classe `lab_09_04_22.parser.BufferedParser`:
```java
public interface Tokenizer extends AutoCloseable {

	TokenType next() throws TokenizerException;

	TokenType tokenType();

	String tokenString();

	int intValue();

	boolean boolValue();

	void close() throws IOException;

	int getLineNumber();
}
```
Il metodo  `next()` serve per avanzare nella lettura del buffered reader associato al tokenizer: il metodo
solleva l'eccezione controllata (checked) `TokenizerException` se non esiste un prossimo valido token, altrimenti restituisce
il tipo del token appena riconosciuto. Il tipo `SKIP` non viene mai restituito dal metodo `next()` ma è usato internamente dal tokenizer
per gestire spazi bianchi e commenti, che vengono scartati.

Il metodo `tokenType()` restituisce il tipo del token appena riconosciuto (coincide con l'ultimo valore restituito da `next()`);
solleva l'eccezione `IllegalStateException` se nessun token è stato riconosciuto.

Il metodo `tokenString()` restituisce il lessema corrispondente al token appena riconosciuto; solleva l'eccezione
`IllegalStateException` se nessun token è stato riconosciuto.

Il metodo `intValue()` restituisce il valore del token di tipo `NUM` che è stato appena riconosciuto; 
 solleva l'eccezione `IllegalStateException` se nessun token di tipo `NUM` è stato riconosciuto.

Il metodo `boolValue()` restituisce il valore del token di tipo `BOOL` che è stato appena riconosciuto; 
 solleva l'eccezione `IllegalStateException` se nessun token di tipo `BOOL` è stato riconosciuto.

Il metodo `close()` è necessario perché la classe `BufferedTokenizer` implementa l'interfaccia `AutoCloseable`; ciò permette di usare il costrutto `try-with-resources` nel metodo `main` di `BufferedParser`, per gestire in modo automatico l'apertura e la chiusura dello stream di input; un commento analogo si applica alla classe `BufferedParser`.

Il metodo `getLineNumber()` restituisce la linea corrente analizzata dal tokenizer, grazie all'uso
di `java.io.LineNumberReader`; in questo modo i messaggi di errore di sintassi possono riferirsi al corrispondente numero di linea per una maggiore chiarezza.

### Implementazione dell'albero della sintassi astratta (AST)
Il package `lab_09_04_22.parser.ast` contiene tutte le definizioni per l'implementazione dell'albero della sintassi astratta (AST).
L'interfaccia `AST` introduce il tipo più generale che include qualsiasi tipo di nodo dell'AST; le sotto-interfacce `Prog`, `StmtSeq`, `Stmt`, `Exp` e `Variable`
rappresentano sottotipi di nodi, corrispondenti alle categorie sintattiche
principali. In questo laboratorio le interfacce non contengono metodi, ma servono solo per rappresentare vari tipi di nodi
non compatibili tra di loro; per esempio, `Exp` non è sottotipo di `Stmt` e `Stmt` non è sottotipo di `Exp`, perché un'espressione non è uno statement e viceversa. Nei prossimi laboratori verranno introdotti nelle interfacce metodi per implementare la visita di un AST.

Alcune classi astratte permettono di raccogliere a fattore comune codice riutilizzabile:
- `UnaryOp`: codice comune agli operatori unari;
- `BinaryOp`: codice comune agli operatori binari;
- `SimpleLiteral<T>`: codice comune alle foglie che corrispondono a literal di tipo semplice;
- `AbstractAssignStmt`: codice comune agli statement di dichiarazione e assegnazione di una variabile.

Per le sequenze di elementi sintattici (per esempio `StmtSeq`), sarebbe possibile implementare
nodi con un numero variabile di figli, ma per semplicità si è preferito usare nodi con numero costante di figli, nel seguente modo:

- un nodo di tipo `SingleStmt` corrisponde a una sequenza con un unico statement; ha un unico figlio di tipo `Stmt`.
- un nodo di tipo `MoreStmt` corrisponde a una sequenza con più di uno statement; ha due figli, il primo di tipo `Stmt`, il secondo di tipo `StmtSeq`.

Entrambe le classi riusano il codice delle classi generiche astratte `Single<T>` e `More<FT,RT>`.


#### Importante
Per facilitare il testing, tutte le classi che implementano i nodi dell'AST ridefiniscono il metodo `String toString()` ereditato da `Object` per meglio visualizzare un AST. Vengono usati i metodi predefiniti `getClass()`
e `getSimpleName()` per accedere al nome della classe di un oggetto.
Per esempio, la stampa dell'AST generato dal parser a partire dal programma contenuto nel file ` tests/success/prog01.txt` produce il termine
```java
SimpleProg(MoreStmt(PrintStmt(Add(Sign(IntLiteral(40)),Mul(IntLiteral(5),IntLiteral(3)))),SingleStmt(PrintStmt(Sign(Mul(Add(IntLiteral(40),IntLiteral(5)),IntLiteral(3)))))))
```

## Classi da completare

### Package `lab_09_04_22.parser`
L'unica classe da completare è `BufferedParser`, in particolare i metodi

- `parseStmtSeq()`
- `parsePrintStmt()`
- `parseVarStmt()`
- `parseAssignStmt()`
- `parseIfStmt()`
- `parseBlock()`
- `parseAnd()`
- `parseEq()`
- `parseAdd()`
- `parseMul()`
- `parseNum()`
- `parseBoolean()`
- `parseVarIdent()`
- `parseMinus()`
- `parseFst()`
- `parseSnd()`
- `parseNot()`
- `parseRoundPar()`

### Package `lab_09_04_22.parser.ast`
Completare le classi

- `AssignStmt`
- `VarStmt`
- `IfStmt`
- `Add`
- `Fst`


## Tests
Potete utilizzare i test nei seguenti folder
- `tests/success`: programmi corretti sintatticamente
- `tests/failure`: programmi con errori di sintassi

