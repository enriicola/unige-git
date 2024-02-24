let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;
let reverse l = it_list (function a -> function x -> x::a) [] l;;

let rec add_after_if p e = function
    x::l -> let nl = add_after_if p e l in if p x then x::e::nl else x::nl |
    _ -> [];;

let rec tail_add_after_if p e l = let rec aux a p e = function x::l -> aux (if p x then (e::x::a) else (x::a)) p e l | _ -> a in reverse (aux [] p e l);;   

let it_add_after_if p e l = reverse (it_list (function a -> function x -> if p x then e::x::a else x::a) [] l);;




