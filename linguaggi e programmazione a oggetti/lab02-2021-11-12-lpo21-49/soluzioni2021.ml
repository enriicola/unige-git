(* definitions of the required functions *)

let cat = 
  let rec aux acc = function 
      hd::tl -> aux (acc ^ hd) tl
    | _ -> acc (* [] is the remaing case *)
  in aux "";;

let fold_cat=List.fold_left (^) "";;

let filter p =
  let rec aux acc = function
    | hd::tl -> aux (if p hd then hd::acc else acc) tl
    | _ -> List.rev acc
  in aux [];; (* [] is the remaing case *)

let fold_filter p l= List.rev (List.fold_left (fun acc hd -> if p hd then hd::acc else acc) [] l);;

let init n f = 
  let rec aux acc i = 
    if i > 0 then let j=i-1 in aux (f j::acc) j
    else if i=0 then acc
    else raise (Invalid_argument "init")
  in  aux [] n;;

let combine l =
  let rec aux acc l1 l2 = 
    match l1,l2 with
        hd1::tl1,hd2::tl2 -> aux ((hd1,hd2)::acc) tl1 tl2
      | [],[] -> List.rev acc
      | _ -> raise (Invalid_argument "combine") (* hd1::tl1,[] and [],hd2::tk2 are the remaining cases *)
  in aux [] l;;

let min_el =  (*  min_el : 'a list -> 'a option *)
    let rec aux acc = function 
    	hd::tl -> aux (min hd acc) tl
	| _ -> acc (* [] is the remaing case *)
    in function
       hd::tl -> Some (aux hd tl) (* if the list contains at least one element hd, then acc is initialized with hd *)
       | _ -> None;; (* [] is the remaing case, None is returned *)

type direction =  North | East | South | West;;

let versor = function
    North -> (0,1)
  | East -> (1,0)
  | South -> (0,-1)
  | West -> (-1,0);;

type action = Turn of direction | Step of int;;

let move (dir,pos) = 
  let scalar i (x,y) = (i*x,i*y) and
  add (x1,y1) (x2,y2) = (x1+x2,y1+y2) in
    function
        Turn new_dir -> (new_dir,pos)
      | Step i -> (dir,add pos (scalar i (versor dir)));;

let rec do_all (dir,pos) = function
    hd::tl -> do_all (move (dir,pos) hd) tl 
  | _ -> (dir,pos);; (* [] is the remaing case *)

(* meglio *)

let fold_do_all = List.fold_left move;;

type 'a list_exp_ast = Empty | Single of 'a | Concat of 'a list_exp_ast * 'a list_exp_ast;;

let rec eval = function
    Empty -> []
  | Single e -> [e]
  | Concat (l1,l2) -> eval l1 @ eval l2;;

(* tests *)

cat ["This";" is ";"awesome!"] = "This is awesome!";;

fold_cat ["This";" is ";"awesome!"] = cat ["This";" is ";"awesome!"];;

filter ((< ) 0) [-1;1;2;-2] = [1;2];;

fold_filter ((< ) 0) [-1;1;2;-2] = [1;2];;

init 0 (fun x->x) = [];;

init 5 (fun x->x) = [0; 1; 2; 3; 4];;

init 5 ((+) 1) = [1; 2; 3; 4; 5];; (* (+) 1 equivale a fun x -> 1+x *)

init 10 (fun x->x*x) = [0; 1; 4; 9; 16; 25; 36; 49; 64; 81];;

(try init (-1) (fun x->x) with Invalid_argument _ -> [])=[];; (* the exception is caught and [] is returned *)

combine [1;2;3] ["a";"b";"c"]=[(1, "a"); (2, "b"); (3, "c")];;

(try combine [1;2] ["a";"b";"c"] with Invalid_argument _ -> [])=[];; (* the exception is caught and [] is returned *)

min_el [] = None;;

min_el [3;4;6;-1] = Some (-1);;

min_el ["orange";"apple";"banana"] = Some "apple";;

move (North,(0,0)) (Turn South)=(South,(0,0));;

move (North,(0,0)) (Step 2)=(North,(0,2));;

move (North,(0,0)) (Step (-1))=(North,(0,-1));; 

move (North,(0,0)) (Step 0)=(North,(0,0));;

do_all (North,(0,0)) [Step 2;Turn East; Step 2; Step (-1);Turn South; Step 3; Step 0]=(South, (1, -1));;

fold_do_all (North,(0,0)) [Step 2;Turn East; Step 2; Step (-1);Turn South; Step 3; Step 0]=(South, (1, -1));;

eval (Concat (Single 1,Concat(Empty,Single 2)))=[1; 2];;