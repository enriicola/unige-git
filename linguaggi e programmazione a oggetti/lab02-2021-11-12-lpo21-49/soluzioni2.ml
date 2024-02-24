let cat = 
  let rec aux acc = function 
      hd::tl -> aux (acc ^ hd) tl
    | _ -> acc
  in aux "";;

cat ["This";" is ";"awesome!"] = "This is awesome!";;

let fold_cat=List.fold_left (^) "";;

fold_cat ["This";" is ";"awesome!"] = cat ["This";" is ";"awesome!"];;

let filter p =
  let rec aux acc = function
    | hd::tl -> aux (if p hd then hd::acc else acc) tl
    | _ -> List.rev acc
  in aux [];;

filter ((< ) 0) [-1;1;2;-2] = [1;2];;

let fold_filter p l= List.rev (List.fold_left (fun acc hd -> if p hd then hd::acc else acc) [] l);;

fold_filter ((< ) 0) [-1;1;2;-2] = [1;2];;

let init n f = 
  let rec aux acc i = 
    if i > 0 then let j=i-1 in aux (f j::acc) j
    else if i=0 then acc
    else raise (Invalid_argument "init")
  in  aux [] n;;

init 0 (fun x->x) = [];;

init 5 (fun x->x) = [0; 1; 2; 3; 4];;

init 10 (fun x->x*x) = [0; 1; 4; 9; 16; 25; 36; 49; 64; 81];;

init 0 (fun x->x) = List.init 0 (fun x->x);;

init 5 (fun x->x) = List.init 5 (fun x->x);;

init 10 (fun x->x*x) = List.init 10 (fun x->x*x);;

try init (-1) (fun x->x) with Invalid_argument _ -> [];;

let combine_no_err l =
  let rec aux acc l1 l2 = 
    match l1,l2 with
        hd1::tl1,hd2::tl2 -> aux ((hd1,hd2)::acc) tl1 tl2
      | _ -> List.rev acc
  in aux [] l;;

combine_no_err [1;2;3] ["a";"b";"c"]=[(1,"a");(2,"b");(3,"c")];;

combine_no_err [1;2] ["a";"b";"c"]=[(1,"a");(2,"b")];;

combine_no_err [1;2;3] ["a";"b"]=[(1,"a");(2,"b")];;

combine_no_err [] ["a";"b";"c"]=[];;

combine_no_err [1;2;3] []=[];;

let combine l =
  let rec aux acc l1 l2 = 
    match l1,l2 with
        hd1::tl1,hd2::tl2 -> aux ((hd1,hd2)::acc) tl1 tl2
      | [],[] -> List.rev acc
      | _ -> raise (Invalid_argument "combine")
  in aux [] l;;

combine [1;2;3] ["a";"b";"c"]=[(1, "a"); (2, "b"); (3, "c")];;

combine [1;2;3] ["a";"b";"c"]=List.combine [1;2;3] ["a";"b";"c"];;

try combine [1;2] ["a";"b";"c"] with Invalid_argument _ -> [];;

try combine [1;2;3] ["a";"b"] with Invalid_argument _ -> [];;

let max_list l =
  let rec aux acc = function
      hd::tl -> aux (max acc (Some hd)) tl
    | _ -> acc
  in aux None l;;

max_list [] = None;;

max_list [3;4;6;-1] = Some 6;;

max_list ["apple";"orange";"banana"] = Some "orange";;

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

move (North,(0,0)) (Turn South)=(South,(0,0));;
move (North,(0,0)) (Step 2)=(North,(0,2));;
move (North,(0,0)) (Step (-1))=(North,(0,-1));; 
move (North,(0,0)) (Step 0)=(North,(0,0));;

let rec go (dir,pos) = function
    hd::tl -> go (move (dir,pos) hd) tl 
  | _ -> (dir,pos);;

go (North,(0,0)) [Step 2;Turn East; Step 2; Step (-1);Turn South; Step 3; Step 0];;


type 'a list_exp_ast = Empty | Single of 'a | Concat of 'a list_exp_ast * 'a list_exp_ast;;

let rec eval = function
    Empty -> []
  | Single e -> [e]
  | Concat (l1,l2) -> (eval l1) @ eval l2;;

eval (Concat (Single 1,Concat(Empty,Single 2)))=[1; 2];;




