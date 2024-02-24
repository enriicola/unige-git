(* let rec insert el ls = match ls with
   	_ -> if member el ls then ls
   	else ls@[el]
   ;;


   let rec insert el ls = match ls with
   	_ -> if 


   let rec insert el ls = match ls with
   [] -> ls@[el]
   	| hd::tl -> if el = hd then ls
   	else [hd]@[insert el tl]
   ;;
*)

(* testa + insert della coda
   // testa "costruttore" qualcosa
   // testa if...
*)
let insert el = function
    hd::tl -> hd::if el=hd then tl (* se c'è già, in testa, restituisce (->) la hd concatenata alla tl *)
              else insert el tl (* scorre tutta la lista *)
  | _ -> [el] (* caso rimanente, dopo aver controllato tutta la listaß *)
;; (* equivale a "hd::hd::hd::hd::[el]" *)

(* più simile alla nostra versione *)
let insert el l = 
   if member el l then l
   else l @[el]
;;
