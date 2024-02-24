# Laboratorio di LPO, 26 novembre 2021: programmazione in Java, classi e oggetti

## Come compilare ed eseguire codice Java
Un programma Java è costituito da uno o più file sorgenti riconoscibili dall'estensione `.java`; per poter eseguire il programma, i file sorgente devono essere prima compilati in file binari, riconoscibili dall'estensione `.class`,
    che contengono codice intermedio chiamato bytecode. Per semplicità, al momento considereremo programmi dove tutti i file sorgenti sono contenuti nella stessa cartella.

### Esempio
Provare a definire nel file `HelloWorld.java` la seguente classe pubblica con il metodo `main`:

```java
public class HelloWorld {
    public static void main(String[] args) {
        assert "Hello world".length() == 11;
    }
}
```
Ogni classe pubblica dev'essere contenuta in un file con lo stesso nome (nell'esempio sopra il file deve chiamarsi `HelloWorld.java`). Se il programma è composto da più classi pubbliche, sarà necessariamente costituito da più file sorgenti.

### Compilazione
Per compilare un file sorgente è possibile lanciare da shell il comando `javac`, passando come argomento il nome del file. Per semplicità è consigliabile lanciare il comando dalla stessa cartella del file da compilare:

```bash
$ javac HelloWorld.java
```

Se la compilazione avrà successo, allora per ogni file sorgente verrà generato nella stessa cartella un corrispondente file `.class`, contenente il programma in bytecode.

### Esecuzione
Il bytecode Java non è direttamente eseguibile, ma deve essere interpretato mediante il comando `java` che si aspetta come argomento il nome della classe (quindi, senza l'estensione `.class`!) da cui si vuole iniziare l'esecuzione del
programma tramite la chiamata del suo metodo `main`:

```bash
$ java HelloWorld
```
Il comando `java` fallisce se non viene lanciato dalla stessa cartella in cui si trova il file `.class` della classe; per le prime esperienze di laboatorio è consigliabile lanciare `java` dalla stessa cartella. È comunque possibile specificare un *classpath* con l'opzione `-cp`, ovvero, una lista di cartelle in cui l'interprete cercare i file `.class` da caricare:
    
```bash
$ java -cp cartella/ HelloWorld
```

Dato che il metodo `main` della classe `HelloWorld` contiene un'asserzione, per essere eseguita deve essere
abilitata con l'opzione `-ea` (abbreviazione di "enable assertions"):

```bash
$ java -ea HelloWorld
```

Modificare l'asserzione nel `main` in modo che fallisca, ricompilare la classe e provare a rieseguire il programma.

### Programmi composti da più file
Se il programma è composto da più file sorgenti nella stessa cartella, conviene compilarli tutti insieme:

```bash
$ javac *.java
```

<!-- Per eseguire il programma, lanciare il comando `java` passando come argomento il nome delle classi da cui si vuole che inizi l'esecuzione (la classe deve necessariamente definire il metodo `main`).-->

### Esercizi proposti

1.   Definire la classe `Person` rispettando i seguenti requisiti:
      *  ogni oggetto di `Person` è dotato dei seguenti campi:
         *  nome (`name`) di tipo `String`, valore obbligatorio e non modificabile;
         *  cognome (`surname`) di tipo `String`, valore obbligatorio e non modificabile;
         *  codice fiscale (`socialSN`), di tipo `long`, valore obbligatorio e non modificabile, non può essere negativo e
        deve identificare ogni oggetto della classe: due oggetti di `Person` hanno lo stesso codice fiscale se e solo se sono lo stesso oggetto.
         *  coniuge (`spouse`) di tipo `Person`, valore opzionale e modificabile. 
      *  nome e cognome devono essere stringhe valide rispetto all'espressione regolare `[A-Z][a-z]+( [A-Z][a-z]+)*`; usare il metodo di istanza
      [`matches`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/String.html\#matches(java.lang.String)) della classe predefinita `String`;
      *  i seguenti dati devono essere accessibili in sola lettura dall'esterno della classe: nome, cognome, codice fiscale e coniuge (`null`, in caso quest'ultimo
      non sia definito);
      *  deve essere definito il metodo di query `isSingle()`, che restituisce `true` se e solo se la persona non ha coniuge;
      *  deve essere definito il metodo `void join(Person p1, Person p2)` che permette di sposare due persone `p1` e `p2`,
      con la pre-condizione che non siano la stessa persona e siano entrambe senza coniuge; 
      *  deve essere definito il metodo `void divorce(Person p1, Person p2)` che permette di far divorziare due persone
      `p1` e `p2`, con la pre-condizione che siano coniugi l'uno dell'altro;
      *  decidere sull'opportunità che `join` e `divorce` siano metodi di oggetto o di classe.

     Definire gli invarianti della classe e il costruttore più opportuno che ne garantisca la validità.

     Definire metodi di classe `private` ausiliari per validare le pre-condizioni dei metodi pubblici e assicurare che gli invarianti vengano rispettati.

     Scrivere una semplice classe `Test` per verificare la classe `Person` con il costrutto `assert`.

1.   Definire la classe `CreditAccount` (conto corrente) secondo i seguenti requisiti:
      * ogni oggetto di `CreditAccount` è dotato dei seguenti campi:
        * limite minimo di giacenza del conto (`limit`) di tipo `int`, valore obbligatorio e modificabile, espresso in centesimi, può essere anche negativo;
        * saldo del conto (`balance`) di tipo `int`, valore obbligatorio e modificabile, espresso in centesimi, non può 
        essere mai inferiore al limite minimo di giacenza;
        * intestatario del conto (`owner`), di tipo `Person`, valore obbligatorio e non modificabile;
        * codice del conto (`id`) di tipo `long`, valore obbligatorio e non modificabile, non può essere negativo e
        deve identificare ogni oggetto della classe: due oggetti di `CreditAccount` hanno lo stesso codice se e solo se sono lo stesso oggetto.
      * i seguenti dati devono essere accessibili in sola lettura dall'esterno della classe: limite di giacenza, saldo, intestatario e codice del conto;
      * deve essere definito il metodo `int deposit(int amount)` che permette di depositare sul conto una somma positiva `amount` (espressa in centesimi) e che restituisce il saldo totale dopo il versamento di tale somma;
      * deve essere definito il metodo `int withdraw(int amount)` che permette di prelevare dal conto una somma positiva `amount` (espressa in centesimi)  e che restituisce il saldo totale dopo il prelevamento di tale somma; l'operazione è consentita solo se il saldo non scende al di sotto del limite di giacenza;
      * deve essere definito il metodo `void setLimit(int limit)` che permette di modificare il limite minimo di giacenza del conto;
      l'operazione è consentita solo se il saldo corrente non scende al di sotto del nuovo limite di giacenza;
      * deve essere  definito il dato `default_limit`, non modificabile, ma accessibile all'esterno della classe, che stabilisce che 
      il limite di giacenza predefinito è pari a 0;
      * deve essere definito il metodo factory `CreditAccount newOfLimitBalanceOwner(int limit, int balance, Person owner)` che permette di aprire un conto restituendo un nuovo oggetto di `CreditAccount` con limite di giacenza `limit` (in centesimi), saldo iniziale `balance` (in centesimi) e intestatario `owner`; il conto può essere aperto solo se il saldo iniziale è positivo.
      * deve essere definito il metodo factory `CreditAccount newOfBalanceOwner(int balance, Person owner)`
      che permette di aprire un conto restituendo un nuovo oggetto di tipo `CreditAccount`  con limite di giacenza predefinito, saldo iniziale `balance` (in centesimi) e
      intestatario `owner`; il conto può essere aperto solo se il saldo iniziale è positivo.      
      * decidere sull'opportunità che `deposit`, `withdraw`, `setLimit`, `newOfLimitBalanceOwner`  e  `newOfLimitBalanceOwner`  siano metodi di oggetto o di classe.

      Definire gli invarianti della classe e i costruttori più opportuni che ne garantiscano la validità.

      Definire metodi di classe `private` ausiliari per validare le pre-condizioni dei metodi pubblici e assicurare che gli invarianti vengano rispettati.

      Scrivere una semplice classe `Test` per verificare la classe `CreditAccount` con il costrutto `assert`.
