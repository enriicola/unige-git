# Laboratorio di LPO, 12 novembre 2021: programmazione in OCaml

1.  Definire in OCaml le seguenti funzioni implementando per ognuna due versioni: una con ricorsione di coda e parametro di accumulazione,
l'altra con `List.fold_left`.
    1.  `cat : string list -> string`
	
        `cat l` restituisce la stringa ottenuta concatenando tutte le stringhe di `l` secondo l'ordine determinato dalla lista.
	
        Esempio:
        ```ocaml
        cat ["This";" is ";"awesome!"] = "This is awesome!"
        ```
    1. `filter : ('a -> bool) -> 'a list -> 'a list` 

        `filter p l` restituisce la lista ottenuta eliminando da `l` gli elementi che non soddisfano il predicato `p`.
	 
        Esempio:
        ```ocaml
        filter ((< ) 0) [-1;1;2;-2] = [1;2] (* (<) 0 equivale a fun x -> 0<x *)
        ```
1.  Definire in OCaml le seguenti funzioni usando ricorsione di coda e parametro di accumulazione (**esercizi più difficili**).
    1.  `init : int -> (int -> 'a) -> 'a list` 

        la specifica di `init` è la stessa di [`List.init`](https://ocaml.org/api/List.html); viene sollevata l'eccezione `Invalid_argument` se l'argomento è negativo.

        Esempi: 
        ```ocaml
        init 0 (fun x->x) = []
        init 5 (fun x->x) = [0; 1; 2; 3; 4]
        init 5 ((+) 1) = [1; 2; 3; 4; 5] (* (+) 1 equivale a fun x -> 1+x *)
        init 10 (fun x->x*x) = [0; 1; 4; 9; 16; 25; 36; 49; 64; 81]
        ```
    1.  `combine : 'a list -> 'b list -> ('a * 'b) list`

        la specifica è la stessa di [`List.combine`](https://ocaml.org/api/List.html); viene sollevata l'eccezione `Invalid_argument` se le due liste hanno lunghezza diversa.

        Esempi: 
        ```ocaml
        combine [] []=[]
        combine [1;2;3] ["a";"b";"c"]=[(1, "a"); (2, "b"); (3, "c")]
        combine [1;2] ["a";"b";"c"] Exception: Invalid_argument "combine"
        ```	
1.  Svolgere i seguenti esercizi su tipi varianti.
    1. `min_el : 'a list -> 'a option` 

        `min_el` restituisce `None` se la lista è vuota, altrimenti `Some m`, con `m` il minimo della lista; usare la funzione predefinita `min : 'a -> 'a -> 'a` per semplificare il codice.

        Esempi: 
        ```ocaml
        min_el [] = None
        min_el [3;4;6;-1] = Some (-1)
        min_el ["orange";"apple";"banana"] = Some "apple"
        ```

    1. Definire il tipo `direction` costituito dai quattro punti cardinali `North`, `East`, `South` e `West`.
    1. Definire la funzione `versor : direction -> int * int` che preso un punto cardinale restituisce il corrispondente versore (vettore unitario)
   sul piano cartesiano:
        ```ocaml
        versor North=(0,1)
        versor East=(1,0)
        versor South=(0,-1)
        versor West=(-1,0)
        ```
    1. Definire il tipo `action` costituito dalle seguenti due azioni:
        *  gira verso un punto cardinale.

            Esempi:
            ```ocaml
            Turn North
            Turn West
            ```
        *  fai `n` passi, con `n` numero intero (se `n` è negativo, i passi vanno fatti indietro, se è 0 nessuna azione viene compiuta).

            Esempi:

            ```ocaml
            Step 2
            Step 0
            Step (-1)
            ```
    1.  Definire la funzione `move : direction * (int * int) -> action -> direction * (int * int)` che, presa una coppia, che definisce la direzione e le coordinate cartesiane iniziali, e presa un'azione, restituisce la coppia costituita dalla direzione e coordinate cartesiane finali ottenute compiendo l'azione. </br>

        Esempi:
        ```ocaml    
        move (North,(0,0)) (Turn South)=(South,(0,0))
        move (North,(0,0)) (Step 2)=(North,(0,2))
        move (North,(0,0)) (Step (-1))=(North,(0,-1))
        move (North,(0,0)) (Step 0)=(North,(0,0))
        ```	
        *Suggerimento*: per semplificare il codice usare `versor : direction -> int * int` e definire le funzioni ausiliarie `scalar : int -> int * int -> int * int` e `add : int * int -> int * int -> int * int` che calcolano il prodotto scalare e l'addizione di vettori di numeri interi.
    1.  Definire la funzione `do_all : direction * (int * int) -> action list -> direction * (int * int)` che, presa una coppia, che definisce la direzione e le coordinate cartesiane iniziali, e presa una lista di azioni, restituisce la coppia costituita dalla direzione e coordinate cartesiane finali ottenute compiendo tutte le azioni della lista nell'ordine.

        Esempio:
        ```ocaml
        do_all (North,(0,0)) [Step 2;Turn East; Step 2; Step (-1);Turn South; Step 3; Step 0]=(South, (1, -1))
        ```
        *Suggerimento*: usare la funzione `move : direction * (int * int) -> action -> direction * (int * int)` del punto precedente.
    1.  Definire il tipo variante polimorfo `'a list_exp_ast` degli alberi della sintassi astratta di espressioni su liste di elementi di tipo `'a` che usano il costruttore di lista vuota e di lista con un singolo elemento e l'operatore binario di concatenazione.

        Esempio:
        ```ocaml
        Concat (Single 1,Concat(Empty,Single 2))
        ```
        è l'albero della sintassi astratta che corrisponde alla seguente sintassi concreta in OCaml:
        ```ocaml
        [1]@([]@[2])
        ```
    1.  Definire la funzione `eval : 'a list_exp_ast -> 'a list` che valuta un albero della sintassi di tipo `'a list_exp_ast` restituendo la lista corrispondente.

        Esempio:
        ```ocaml
        eval (Concat (Single 1,Concat(Empty,Single 2)))=[1; 2]
        ```
