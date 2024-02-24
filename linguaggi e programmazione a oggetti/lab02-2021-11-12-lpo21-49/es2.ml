(* prova a chiedere aiuto a pietro barbieri per ocaml...(s4120139@studenti.unige.it) *)
(* i. //presa dalle soluzioni...*)
exception Invalid_argument;;
let init n f = (* f sta per function (?) *)
  let rec aux acc i =
    
    if i>0 then let j=i-1 in aux (f j::acc) j (* da chiedere a barbieri... *)
    else
        if i=0 then acc
        else 
          raise Invalid_argument 
  in aux [] n
;;
init 0 (fun x->x) (*= [] *)
init 5 (fun x->x) (*= [0; 1; 2; 3; 4] *)
init 5 ((+) 1) (*= [1; 2; 3; 4; 5] (* (+) 1 equivale a fun x -> 1+x *) *)
init 10 (fun x->x*x) (*= [0; 1; 4; 9; 16; 25; 36; 49; 64; 81] *)

(* ii. //perchè mi da errore di sintassi sull' if?!?!?!?!?!?!??!!??!?!?!?
*)
(* let combine l =
  let rec aux acc l1 l2 = match l1,l2 with
    hd1::tl1, hd2::tl2 -> aux((hd1,hd2)::acc) tl1 tl2
    let cmp = List.compare_lengths_with (l1) l2
    if cmp!=0 then raise (Invalid_argument "combine")
    | _ -> List.rev acc
  in aux [] l
;; *)

let combine l =
  let rec aux acc l1 l2 = match l1,l2 with
    hd1::tl1, hd2::tl2 -> aux((hd1,hd2)::acc) tl1 tl2
    | [],[] -> List.rev acc
    | _ -> raise (Invalid_argument)
  in aux [] l
;;
combine [] []=[]
combine [1;2;3] ["a";"b";"c"]=[(1, "a"); (2, "b"); (3, "c")]
combine [1;2] ["a";"b";"c"] Exception: Invalid_argument "combine"