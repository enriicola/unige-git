let rec cond_map f p = function
    [] -> []
  | h::t -> (if p h then f h else h)::cond_map f p t;; 

cond_map  sqrt (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0];;

cond_map  sqrt (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0]=[-1.0;3.0;-4.0;2.0];;

let acc_cond_map f p =
  let rec aux acc = function
      [] -> List.rev acc
    | h::t -> aux ((if p h then f h else h)::acc) t in
    aux [];; 

cond_map sqrt (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0]=acc_cond_map sqrt (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0];;

let fold_cond_map f p l = List.fold_left (fun acc h -> (if p h then f h else h)::acc) [] (List.rev l);;

cond_map sqrt (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0]=fold_cond_map sqrt (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0];;

