
let rec count_zeros f = function
    [] -> 0
  | h::t -> (if f h==0 then 1 else 0) + count_zeros f t;;

count_zeros (fun x->(x-1)*(x-2)*(x+3)) [-3;1;2;0;4];;

count_zeros (fun x->(x-1)*(x-2)*(x+3)) [-1;0;4];;

let acc_count_zeros f = 
  let rec aux acc = function
      [] -> acc
    | h::t -> aux ((if f h==0 then 1 else 0)+acc) t
  in aux 0;;

count_zeros (fun x->(x-1)*(x-2)*(x+3)) [-3;1;2;0;4] = acc_count_zeros (fun x->(x-1)*(x-2)*(x+3)) [-3;1;2;0;4];;

count_zeros (fun x->(x-1)*(x-2)*(x+3)) [-1;0;4] = acc_count_zeros (fun x->(x-1)*(x-2)*(x+3)) [-1;0;4];;

let fold_count_zeros f = List.fold_left (fun acc el -> (if f el==0 then 1 else 0)+acc) 0;;

count_zeros (fun x->(x-1)*(x-2)*(x+3)) [-3;1;2;0;4] = fold_count_zeros (fun x->(x-1)*(x-2)*(x+3)) [-3;1;2;0;4];;

count_zeros (fun x->(x-1)*(x-2)*(x+3)) [-1;0;4] = fold_count_zeros (fun x->(x-1)*(x-2)*(x+3)) [-1;0;4];;
