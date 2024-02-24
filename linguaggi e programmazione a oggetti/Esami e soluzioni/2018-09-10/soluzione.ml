let rec filter_map p f = function
    [] -> []
  | h::t -> let t2=filter_map p f t in if p h then f h::t2 else t2;; 

filter_map (fun x->x>=0.0) sqrt [-1.0;0.0;-4.0;4.0];;

filter_map (fun x->x>=0.0) sqrt [-1.0;0.0;-4.0;4.0]=[0.0;2.0];;

let acc_filter_map p f l =
  let rec aux acc = function
      [] -> acc
    | h::t -> aux (if p h then f h::acc else acc)  t in
  List.rev(aux [] l);; 

filter_map (fun x->x>=0.0) sqrt [-1.0;0.0;-4.0;4.0]=acc_filter_map (fun x->x>=0.0) sqrt [-1.0;0.0;-4.0;4.0];;

let fold_filter_map p f l = List.rev (List.fold_left (fun acc h -> if p h then f h::acc else acc) [] l);;

filter_map (fun x->x>=0.0) sqrt [-1.0;0.0;-4.0;4.0]=fold_filter_map (fun x->x>=0.0) sqrt [-1.0;0.0;-4.0;4.0];;
