let rec max_list n = function x::l -> max x (max_list n l) | _ -> n;;

(* approccio standard con accumulatore *)

let acc_max_list n = let rec aux a = function x::l -> aux (max a x) l | _ -> a in aux n;; 

(* in questo caso specifico il parametro di acc_max_list puo` essere usato direttamente come parametro
   di accumulazione, quindi la funzione puo` essere equivalentemente definita nel seguente modo semplificato *)

let rec acc_max_list a = function x::l -> acc_max_list (max a x) l | _ -> a;;

let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;

let it_max_list n = it_list max n;;

max_list 0 [1;2;3;4;4;3;2;1];;
max_list 10 [1;2;3;4;4;3;2;1];;
acc_max_list 0 [1;2;3;4;4;3;2;1];;
acc_max_list 10 [1;2;3;4;4;3;2;1];;
it_max_list 0 [1;2;3;4;4;3;2;1];;
it_max_list 10 [1;2;3;4;4;3;2;1];;



