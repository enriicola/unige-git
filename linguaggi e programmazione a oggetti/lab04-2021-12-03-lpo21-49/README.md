# Laboratorio di LPO, 3 dicembre 2021: programmazione in Java, interfacce

Il codice di partenza per questo laboratorio è disponibile nel folder `src/lab04_12_02`; le specifiche dei metodi di `Circle`, `Rectangle` e `AreaComparator` si trovano nelle interfacce `Shape` e `ShapeComparator`; per semplicità gli invarianti di classe non impongono limiti superiori alle dimensioni delle figure, che quindi potrebbero anche essere `+Infinity`. 

1. Completare le classi `Circle` e `Rectangle` che implementano l'interfaccia `Shape`.

1. Completare la classe `AreaComparator` che implementa l'interfaccia `ShapeComparator`.

1. Completare la classe `Shapes` che contiene vari metodi di classe (o statici) che implementano operazioni su array di figure.

1. Utilizzare la classe `ShapeTest` per verificare il corretto funzionamento del codice.

## Compilazione ed esecuzione di classi contenute in package
Le classi e interfacce di questo laboratorio sono contenute nel package `lab04_12_02`; per questo motivo i file sorgenti `.java` si trovano nel folder `lab04_12_02`. Per compilare ed eseguire la classe `ShapeTest` si possono lanciare i comandi `javac ShapeTest.java` e `java -ea lab04_12_03.ShapeTest` a partire dal folder che contiene `lab04_12_03`, ossia `src` nell'esempio. Per compilare ed eseguire la classe dal folder `lab04_12_03` bisogna usare l'opzione `-cp` (classpath): `javac -cp .. ShapeTest.java` e `java -cp .. -ea lab04_12_03.ShapeTest` 

 
	
