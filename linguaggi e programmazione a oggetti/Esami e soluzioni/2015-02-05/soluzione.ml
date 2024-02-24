let rec count p = function x::l -> count p l + if p x then 1 else 0 | _ -> 0;;

let acc_count p = let rec aux a = function x::l -> aux (a+if p x then 1 else 0) l | _ -> a in aux 0;;  
let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;
let it_count p = it_list (fun a x -> a + if p x then 1 else 0) 0;; 
count (fun x -> x > 0) [-1;2;3;-4;1];;
acc_count (fun x -> x > 0) [-1;2;3;-4;1];;
it_count (fun x -> x > 0) [-1;2;3;-4;1];;
count (fun x -> x="red") ["black";"white";"red";"green";"red"];;  
acc_count (fun x -> x="red") ["black";"white";"red";"green";"red"];;  
it_count (fun x -> x="red") ["black";"white";"red";"green";"red"];;  
