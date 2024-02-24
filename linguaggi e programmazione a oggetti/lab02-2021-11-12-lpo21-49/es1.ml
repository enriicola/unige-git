(* prova a chiedere aiuto a pietro barbieri per ocaml...(s4120139@studenti.unige.it) *)
(*
studia ocaml dagli esami vecchi...
*)

(* i *)
let cat =
  let rec aux acc = function
      hd::tl -> aux(acc^hd) tl
    | [] -> acc in aux""
;;
cat ["pippo";"pane"]

let fold_cat = List.fold_left (fun acc e -> acc^e)"";;
fold_cat ["pippo";"pane"]



(* ii *)
let filter p =
  let rec aux acc  = function
    | hd::tl -> if p hd then aux (hd::acc) tl else aux acc tl
    | _ -> List.rev acc
  in aux [] 
;;
filter ((< ) 0) [-1;1;2;-2] = [1;2] (* (<) 0 equivale a fun x -> 0<x *)
(*
let rec filter p = function
  | [] -> []
  | hd::tl -> if p hd then hd:: filter p tl else filter p tl
  ;;
*)

let fold_filter p l =
  List.rev (List.fold_left (fun acc hd -> if p hd then hd::acc else acc) [] l) (* con "l []" non funziona, da errore di tipo int *)
;;
fold_filter ((< ) 0) [-1;1;2;-2];;