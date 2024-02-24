let rec flat_map f = function [] -> [] | h::t -> f h@flat_map f t;;

let acc_flat_map f = let rec aux acc = function [] -> acc | h::t -> aux (acc@f h) t in aux [];; 

let rec it_list f a = function [] -> a | x::l -> it_list f (f a x) l;;

let it_flat_map f = it_list (fun a e -> a@f e) [];;  

flat_map (fun x -> [x;x]) ['a';'b';'c'];;

flat_map (fun x -> [x-1;x;x+1]) [1;2;3];;

flat_map (fun x -> [x;x]) ['a';'b';'c']=acc_flat_map (fun x -> [x;x]) ['a';'b';'c'];;

flat_map (fun x -> [x-1;x;x+1]) [1;2;3]=acc_flat_map (fun x -> [x-1;x;x+1]) [1;2;3];;

it_flat_map (fun x -> [x;x]) ['a';'b';'c']=acc_flat_map (fun x -> [x;x]) ['a';'b';'c'];;

it_flat_map (fun x -> [x-1;x;x+1]) [1;2;3]=acc_flat_map (fun x -> [x-1;x;x+1]) [1;2;3];;



