let rec map_pairs f = function 
	  [] ->  []
	| (a, b)::tl -> f(a, b)::(map_pairs f tl);;

map_pairs (function x, y -> x+y) [];;
map_pairs (function x, y -> x+y) [0, 1];;
map_pairs (function x, y -> x+y) [1, 2; 3, 4; 5, 6];;

let rec map_pairs_accum f lp = 
	let rec aux accum = function
		  [] -> accum
		| (x, y)::tl -> aux (f(x, y)::accum) tl
	in
	    List.rev(aux [] lp);;

map_pairs_accum (function x, y -> x+y) [];;
map_pairs_accum (function x, y -> x+y) [0, 1];;
map_pairs_accum (function x, y -> x+y) [1, 2; 3, 4; 5, 6];;

let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;

let rec map_pairs_itlist f = it_list (function accum -> function (x, y) -> accum @ [f(x, y)]) [];;

map_pairs_itlist (function x, y -> x+y) [];;
map_pairs_itlist (function x, y -> x+y) [0, 1];;
map_pairs_itlist (function x, y -> x+y) [1, 2; 3, 4; 5, 6];;

