# Laboratorio di LPO, 29 ottobre 2021: programmazione in OCaml

Definire in OCaml le seguenti funzioni, **senza** parametri di accumulazione o funzioni di libreria:

1.  `prod : int list -> int` 
    
    `prod ls` restituisce il prodotto di tutti i numeri interi contenuti nella lista `ls`. 
    
    Esempio:
    ```ocaml
    prod [2;3;4]=24
    ```
1. `member : 'a -> 'a list -> bool` 
    
    `member el ls` restituisce `true` se e solo se `el` è un elemento della lista `ls`. 
    
    Esempio:
    ```ocaml
    member 3 [2;3;4]=true
    member 5 [2;3;4]=false
    ```
1.  `insert : 'a -> 'a list -> 'a list`
 
    `insert el ls` restituisce la lista ottenuta aggiungendo `el` in fondo alla lista `ls` se `el` non appartiene già a `ls`;
  restituisce `ls` altrimenti.

    Esempio:
    ```ocaml
    insert 0 [2;3;4]=[2;3;4;0]
    insert 3 [2;3;4]=[2;3;4]
    ```
1.  `odd : 'a list -> 'a list` 
    
    `odd ls` restituisce la lista ottenuta da `ls` tenendo solo gli elementi di indice dispari, dove il primo elemento ha indice 1.</br>
    
    Esempio:
    ```ocaml
    odd [1;2;3;4;5] = [1;3;5]
    odd ["a";"b";"a";"b";"a"] = ["a";"a";"a"]
    ```
1.  `ord_insert : 'a -> 'a list -> 'a list` 

    `ord_insert el ls` restituisce la lista ordinata in modo crescente e senza ripetizioni ottenuta aggiungendo `el` a `ls`,
assumendo che `ls` sia ordinata in modo crescente e senza ripetizioni.

    Esempio:
    ```ocaml
    ord_insert 0 [1;2;4;5] = [0;1;2;4;5]
    ord_insert 3 [1;2;4;5] = [1;2;3;4;5]
    ord_insert 7 [1;2;4;5] = [1;2;4;5;7]
    ord_insert 2 [1;2;4;5] = [1;2;4;5]
    ```
1.  `merge : 'a list * 'a list -> 'a list` 
    
    `merge (ls1,ls2)` restituisce la lista ordinata in modo crescente e senza ripetizioni
ottenuta fondendo assieme le liste ordinate in modo crescente e senza ripetizioni `ls1` e `ls2`. </br>
    
    Esempio:
    ```ocaml
    merge ([1;3;5],[2;4;6]) = [1;2;3;4;5;6]
    merge ([1;2;3],[4;5]) = [1;2;3;4;5]
    merge ([3],[1;2;4;5]) = [1;2;3;4;5]
    ```
1.  `curried_merge : 'a list -> 'a list -> 'a list` </br>
    
    `curried_merge` è  la versione curried di `merge`; definire la funzione senza
  usare `merge`.
    
    Esempio:
    ```ocaml
    curried_merge [1;3;5] [2;4;6] = [1;2;3;4;5;6]
    curried_merge [1;2;3] [4;5] = [1;2;3;4;5]
    curried_merge [3] [1;2;4;5] = [1;2;3;4;5]
    ```
