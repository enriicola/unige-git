let rec count p = function x::l -> let c = count p l in if p x then c + 1 else c | _ -> 0;;

let acc_count p = let rec aux a = function x::l -> aux (if p x then a+1 else a) l | _ -> a in aux 0;; 

let rec list_it f a = function [] -> a | x::t -> list_it f (f a x) t;;

let it_count p = list_it (fun a x -> if p x then a+1 else a) 0;; 

count (fun x -> x > 0) [-1; 2; 0; 3; -1];;

count (fun x -> x > 0) [-1; -2; 0; -3; -1];;

count (fun x -> x > 0) [1; 2; 3; 4; 5];;

count (fun x -> x > 0) [-1; 2; 0; 3; -1] == acc_count (fun x -> x > 0) [-1; 2; 0; 3; -1];;

count (fun x -> x > 0) [-1; -2; 0; -3; -1] == acc_count (fun x -> x > 0) [-1; -2; 0; -3; -1];;

count (fun x -> x > 0) [1; 2; 3; 4; 5] == acc_count (fun x -> x > 0) [1; 2; 3; 4; 5];;

count (fun x -> x > 0) [-1; 2; 0; 3; -1] == it_count (fun x -> x > 0) [-1; 2; 0; 3; -1];;

count (fun x -> x > 0) [-1; -2; 0; -3; -1] == it_count (fun x -> x > 0) [-1; -2; 0; -3; -1];;

count (fun x -> x > 0) [1; 2; 3; 4; 5] == it_count (fun x -> x > 0) [1; 2; 3; 4; 5];;

