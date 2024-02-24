(* caso 1: el più piccolo di tutti
   caso 2: el uguale alla testa (nessun cambiamento)
   caso 3: rimane che el è per forza più grande della hd (attuale), quindi richiamo la funzione sull'elemento successivo (cooda)*)
let rec ord_insert el = function (* ls = match ls with *)
    hd::tl as ls -> if el<hd then el::ls (* alias *)
      else if el=hd then ls
      else hd::ord_insert el tl
  | _ -> [el] (* se arrivo in fondo alla lista, devo inserire l'elem. in fondo (è il più grande) *)
;;

(* tests
   ord_insert 0 [1;2;4;5] = [0;1;2;4;5]
   ord_insert 3 [1;2;4;5] = [1;2;3;4;5]
   ord_insert 7 [1;2;4;5] = [1;2;4;5;7]
   ord_insert 2 [1;2;4;5] = [1;2;4;5]
*)
