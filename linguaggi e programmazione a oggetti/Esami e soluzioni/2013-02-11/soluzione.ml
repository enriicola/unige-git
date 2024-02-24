let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;
let reverse l = it_list (function a -> function x -> x::a) [] l;;

let rec apply_all x = function f::l -> f x::apply_all x l |  _ -> [];;

let apply_all_acc x l = let rec aux a = function f::t -> aux (f x::a) t |  _ -> a in reverse (aux [] l);;

let comp_all x = it_list (fun a f -> f a) x;; 


