(* correzione esercizi per casa e non (OCaml) *)
(* esercizi abbastanza gettonati anche per l'esame*)

(* esercizi su funzioni higher-order: +vedi il testo degli esercizi su aulaweb
    gen_apply (fun x->x+1) 0 3=3
    gen_apply (fun x->x+1) 1 3=4
    gen_apply (fun x->x+1) 2 3=5 *)

1)  let gen_apply f = 
        let rec aux n x = 
            if n <= 0 then x else f(aux (n-1) x) (* f(f(x)))) etc... *)
    (* altra soluzione: *)
    let rec aux n x = if n <= 0 then x else (aux (n-1) (f x))
        in aux;;

2) definire come specializzazione della funzione generica gen_apply la funzione pow:int-> int -> int tale che pow b n=b^n

    let pow b n = gen_apply (fun x->x*b) n-1

(* esercizi funzioni con funzioni su liste *)

(* 1) funzione swap-all: 'a list -> 'a list che cambia gli elementi di indice pari con quelli di indice dispari
+ vedi esempi...swap_all [1;2;2]=[2;13;];; *)

    let rec swap_all = function (*pattern matching*)
        a::b::t -> b::a::swap_all t
        | l -> l;; (* lsita vuota o lista con almeno più di due elementi *)

2) funzione zip: 'a -> list 'b list -> ('a * 'b) list che fonde assieme due liste della stessa lunghezza, restituendo una corrispondente lista di copie.
   esempoi: ... ... zip [] []=[];;

    let rec zip l1 l2 = match l1,l2 with
        hd1::tl1,hd2::tl2 -> (hd1,hd2)::zip tl1 tl2
        | ...........................................................................................................................

3) funzione alt: 'a list -> 'a list -> 'a list che fonde assieme due liste, possibilmente di lunghezza diversa, alternando i loro elementi
   esempi: 
   alt ["a";"c"] ["b";"d"]=["a";"b";"c";"d"];;
   ... ... ... ... ...

   let rec alt l1 l2 = match l1 with 
       hd::tl -> hd::alt l2 l1
       | _ -> l2;;
