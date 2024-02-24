let rec replace p x = function 
    [] -> []
  | h::t -> (if p h then x else h)::replace p x t;;

replace (fun x->x<0) 0 [-1;2;3;-4;-5];;

let tail_replace p x l = 
  let rec aux a = function
      [] -> a
    | h::t -> aux ((if p h then x else h)::a) t
  in  List.rev (aux [] l);;

tail_replace (fun x->x<0) 0 [-1;2;3;-4;-5];;

let rec map f = function [] -> [] | h::t -> f h::map f t;;

let map_replace p x = map (fun h -> if p h then x else h);;

map_replace (fun x->x<0) 0 [-1;2;3;-4;-5];; 




