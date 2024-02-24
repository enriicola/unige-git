let rec decode = function 
    [] -> 0
  | x::t -> x + 2 * decode t;;

let acc_decode l = let rec aux a = function [] -> a | x::t -> aux (a * 2 + x) t  in aux 0 (List.rev l);;

let rec list_it f a = function [] -> a | x::t -> list_it f (f a x) t;;

let it_decode l = list_it (fun a x -> a * 2 + x) 0 (List.rev l);;  

decode [0;0;0];;
decode [0;0;0;1];;
decode [1;1;1;1];;
acc_decode [0;0;0];;
acc_decode [0;0;0;1];;
acc_decode [1;1;1;1];;
it_decode [0;0;0];;
it_decode [0;0;0;1];;
it_decode [1;1;1;1];;





