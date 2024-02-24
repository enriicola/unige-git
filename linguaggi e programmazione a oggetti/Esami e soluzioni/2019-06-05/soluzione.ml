
let rec gen_sum f = function
    [] -> 0
  | h::t -> f h + gen_sum f t;;

gen_sum (fun x->x*x) [];;
gen_sum (fun x->x*x) [1];;
gen_sum (fun x->x*x) [1;2];;
gen_sum (fun x->x*x) [1;2;3];;


let acc_gen_sum f = 
  let rec aux acc = function
      [] -> acc 
    | h::t -> aux (acc+f h) t 
  in aux 0;;

acc_gen_sum (fun x->x*x) [1;2;3] = gen_sum (fun x->x*x) [1;2;3];;

let fold_gen_sum f = List.fold_left (fun a e -> a+f e) 0;;

fold_gen_sum (fun x->x*x) [1;2;3] = gen_sum (fun x->x*x) [1;2;3];;

