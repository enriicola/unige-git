(* prova a chiedere aiuto a pietro barbieri per ocaml...(s4120139@studenti.unige.it) *)
(* Svolgere i seguenti esercizi su tipi varianti. *)
(* soluzioni :( *)
(* i. *)
let min_el = 
  let rec aux acc = function
    hd::tl -> aux (min hd acc) tl
    | _ -> acc (* caso rimanente *)
  in function
    hd::tl -> Some (aux hd tl) (* se la lista contiene almeno un elemento hd, allora acc è inizializzato con hd *)
    | _ -> None (* caso rimanente *)
;;
min_el [] = None
min_el [3;4;6;-1] = Some (-1)
min_el ["orange";"apple";"banana"] = Some "apple"

(* ii. *)
type direction = North | East | South | West;;

(* iii. *)
let verson = function
  North -> (0,1)
  | East -> (1,0)
  | South -> (0,-1)
  | West -> (-1,0)
;;
versor North=(0,1)
versor East=(1,0)
versor South=(0,-1)
versor West=(-1,0)

(* iv. *)
type action = Turn of direction | Step of int;;
Turn North
Turn West
Step 2
Step 0
Step (-1)

(* v. *)
let move = 
  let scalar i (x,y) = (i*x,i*y) and add (x1,y1) (x2,y2) = (x1+x2,y1+y2) in 
  function
    Turn new_dir -> (new_dir,pos)
    | Step i -> (dir,add pos (scalar i (versor dir)))
;;
move (North,(0,0)) (Turn South)=(South,(0,0))
move (North,(0,0)) (Step 2)=(North,(0,2))
move (North,(0,0)) (Step (-1))=(North,(0,-1))
move (North,(0,0)) (Step 0)=(North,(0,0))

(* vi. *)
let rec do_all (dir,pos) = function
  hd::tl -> do_all (move (dir,pos) hd) tl
  | _ -> (dir,pos)
;;
do_all (North,(0,0)) [Step 2;Turn East; Step 2; Step (-1);Turn South; Step 3; Step 0]=(South, (1, -1))

(* oppure *) let fold_do_all = List.fold_left move;;

(* vii. *)
type 'a list_exp_ast = Empty | Single of 'a | Concat of 'a list_exp_ast * 'a list_exp_ast;;

(* viii. *)
let eval = function
  Empty -> []
  | Single e -> [e]
  | Concat (l1,l2) -> eval l1@eval l2
;;
eval (Concat (Single 1,Concat(Empty,Single 2)))=[1;2]