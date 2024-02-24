let rec eval n = function 
    [] -> 0
  | x::t -> x + n * eval n t;;

let acc_eval n l = let rec aux a = function [] -> a | x::t -> aux (a * n + x) t  in aux 0 (List.rev l);;

let rec list_it f a = function [] -> a | x::t -> list_it f (f a x) t;;

let it_eval n l = list_it (fun a x -> a * n + x) 0 (List.rev l);;  

eval 4 [1;0;1];; 

eval 5 [1;-4;4];;

acc_eval 4 [1;0;1];; 

acc_eval 5 [1;-4;4];;

it_eval 4 [1;0;1];; 

it_eval 5 [1;-4;4];;








