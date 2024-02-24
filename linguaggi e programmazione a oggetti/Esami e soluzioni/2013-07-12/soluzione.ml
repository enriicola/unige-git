let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;
let reverse l = it_list (function a -> function x -> x::a) [] l;;

let rec swap = function
    x::y::l -> if x>y then y::swap (x::l)  else x::swap (y::l) |
    l -> l;;

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





