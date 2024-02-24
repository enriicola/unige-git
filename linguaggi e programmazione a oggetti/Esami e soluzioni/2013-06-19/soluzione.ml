let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;
let reverse l = it_list (function a -> function x -> x::a) [] l;;

let rec no_seq_dup = function
    x::(y::l as tl) -> if x=y then no_seq_dup tl  else x::no_seq_dup tl |
    l -> l;;

let tail_no_seq_dup l = let rec aux acc = function 
    x::(y::tl as l) -> if x=y then aux acc l  else aux (x::acc) l |
    x::[] -> x::acc |
    _ -> acc 
in reverse (aux [] l);;

let it_no_seq_dup l = reverse (it_list (function x::tl as l -> (function y -> if x=y then l else y::l) | _ -> function y -> [y]) [] l);;



