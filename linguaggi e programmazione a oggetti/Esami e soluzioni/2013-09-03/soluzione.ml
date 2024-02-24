let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;
let reverse l = it_list (function a -> function x -> x::a) [] l;;

let rec delete p = function
    x::l -> let l2 = delete p l in if p x then l2 else x::l2 |
    _ -> [];;

let tail_delete p l = let rec aux acc = function
    x::l -> if p x then aux acc l else aux (x::acc) l |
    _ -> acc in
reverse (aux [] l);;

let it_delete p l = reverse (it_list (fun a x -> if p x then a else x::a) [] l);;

(*
let rec swap_no_dup = function
    x::y::l -> if x>y then y::swap_no_dup (x::l) else if x<y then x::swap_no_dup (y::l) else swap_no_dup (y::l) |
    l -> l;;

let tail_swap l = let rec aux acc = function 
    x::y::tl -> if x>y then aux (y::acc) (x::tl)  else aux (x::acc) (y::tl) |
    x::[] -> x::acc |
    _ -> acc 
in reverse (aux [] l);;


let rec swap2 = function
    x::y::l -> if x>y then match swap2(x::l) with l2,b -> (y::l2),true else (match swap2(y::l) with l2,b -> (x::l2),b) |
    l -> l,false;;

let rec sort l = match swap2 l with (l2,true) -> sort l2 | (l2,false) -> l2;; 
*)




