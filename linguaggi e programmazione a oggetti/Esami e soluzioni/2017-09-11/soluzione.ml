(* punto (a) *)

let rec odd = function 
    [] -> [] |
    [x] -> [x] |
    x::y::l -> x::odd l;;

odd [] = [];;

odd [1] = [1];;

odd [1;2] = [1];;

odd [1;2;3;4;5] = [1;3;5];;

(* soluzione alternativa piu` compatta che sfrutta l'ordine dei casi *)

let rec odd2 = function 
    x::y::l -> x::odd l |
    l -> l;;

odd2 [] = [];;

odd2 [1] = [1];;

odd2 [1;2] = [1];;

odd2 [1;2;3;4;5] = [1;3;5];;

(* punto (b) *)

let acc_odd l = let rec
  aux acc = function
                    [] ->  acc |
                    [x] -> x::acc |
                    x::y::l -> aux (x::acc) l
  in  List.rev (aux [] l);;

acc_odd [] = [];;

acc_odd [1] = [1];;

acc_odd [1;2] = [1];;

acc_odd [1;2;3;4;5] = [1;3;5];;

