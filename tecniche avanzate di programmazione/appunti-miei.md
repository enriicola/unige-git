# Appunti vari di TAP su C# :-)

## 1.
se penso che gli insieme che ho definito siano covarianti, dovrei poter fare l'assegnazione...

```c#
    fSet = pSet;
    //...e invece non si può, pensi male! -> no: ISet is countervariant
    pSet = fSet; // ok, va bene

    fSet.IsIn(f);
    fSet.IsIn(p);
    pSet.IsIn(p);
    // pSet.IsIn(f); // no: IsIn in ISet<Pear> cannot manage a generic fruit, only Pears!
```

## 2.
```c#
I1<int, Pear, Fruit /*andrebbe bene anche Pear :) */, Vegetable, bool, Fruit> large = null;
// vedi la dichiarazione dell'interfaccia !!!
```
È buona pratica programmare seguendo sempre le indicazioni intrinseche alla dichiarazione dell'interfaccia.

## 3. chiamate a metodi d'interfaccia e definizione di generici

```c#
interface I1<T1, in TI1, in TI2, out TO1, T2, out TO2>{
    TO1 M1(TI2 x, T2 y); // va bene perchè il tipo di ritorno è out ed ho un out TO1

    T1 M2(TI1 z, T1 w); // stessa logica...
    TO2 M3(); // stessa logica...
}

interface ISet <in T> { // definizione di un generico
    bool IsIn(T elem);
}
```

## 4. UnitTest1
```c#
using SUT; //meglio non metterlo dentro il  namespace
```
Sempre meglio mettere i costrutti "using" fuori dai namespace

## 5. "///"+TAB per scrivere il summary
```c#
///<summary>
/// lo si può usare come documentazione se il nome del metodo di test diventa lunghissimo
///</summary>

// +

var expectedPrice = 194.0; //3% discount as price higher than 100
// BRUTTO ED ECCESSIVAMENTE RIDONDANTE, ALCUNI PERO' PREFERISCONO RISCRIVERSELO

// varie pratiche di ""good code""
var expectedPrice = 42.2079s; //0.5% discount as customer has done more 10 orders
var expectedPrice = 197; //3.5% discount as customer has done more 10 orders and items cost more than 200
```

## 6. "prop" e return tramite snippet
```c#
public DateTime SignUpTime{ get; } //prop+TAB+TAB // qui il set non serve, wishful thinking :)
public int OrderNumber{ get; set; } // property //set non dovrebbe esistere, dovrebbe ...

/// <returns></returns> // vedi il suo snippet :)
```

## 7. decimali in c# + if else tramite punteggiatura
```c#
//return (OrderNumber >= 10) ? itemCost.* 97 * .995 : itemCost * .97;
//return itemCost/* *.97 */;
```

## 8. un paio di link utili...
https://stackoverflow.com/questions/23811413/is-there-a-shortcut-in-visualstudio-to-create-a-method

https://learn.microsoft.com/vi-vn/visualstudio/sharepoint/how-to-add-a-parameter-to-a-method?view=vs-2019


## 9. snippet per il MAIN + appunti vari
```c#
public static int Main(string[] args) // code snippet "sim"

interface I1 //possiamo mettervi solo metodi (e quindi anche properties)
{

class MySecondClass : MyFirstClassTotallyUseless,I2, I1 //figlia:mamma, non posso estendere a più di una classe
{
```
- vedi i concetti di gerarchie, ereditarietà, eccetera

```c#
public MyClass(object myProperty, bool b, int x, bool b) 
// generato con "CMD" + "."
```
- usando la combinazione dei tasti CMD e "." si apre un piccolo menù tipo quello delle source actions in java con vs code 

```c#
get { return b; } set { b = !value; }
get => b; // non c'entra NIENTE con le lambda
```
- attento a non confondere le lambda con altri costrutti/operatori

```c#
M(b, x); // visualstudio se ne accorge e propone di aggiungere un argomento al metodo M
```

# 10. bang e override degli operatori in vs
```c#
return null!; // il punto esclamativo sta per "bang"
              // così toglie la notifica di warning :)
```
```c#
public override ... 
```
Aspetto un attimo intellisense e dovrebbe spuntare un elenco di tutte le cose su cui posso fare override :)
Per esempio tutti gli operatori (non solo i 4 classici) o il ToString(), che mi servivano per il primo lab...