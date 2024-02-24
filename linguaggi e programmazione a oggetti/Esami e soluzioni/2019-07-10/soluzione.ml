
let rec gen_cat f = function
    [] -> ""
  | h::t -> f h ^ gen_cat f t;;

gen_cat (fun s -> s^"__") ["one";"two";"three"];;

let acc_gen_cat f = 
  let rec aux acc = function
      [] -> acc 
    | h::t -> aux (acc^f h) t 
  in aux "";;

acc_gen_cat (fun s -> s^"__") ["one";"two";"three"]=gen_cat (fun s -> s^"__") ["one";"two";"three"];;

let fold_gen_cat f = List.fold_left (fun a e -> a^f e) "";;

fold_gen_cat (fun s -> s^"__") ["one";"two";"three"]=gen_cat (fun s -> s^"__") ["one";"two";"three"];;
