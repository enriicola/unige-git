let rec cond_map f g p = function
    [] -> []
  | h::t -> (if p h then f h else g h)::cond_map f g p t;; 

cond_map  sqrt (fun x -> 0.) (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0];;

cond_map  sqrt (fun x -> 0.) (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0]=[0.0;3.0;0.0;2.0];;

let acc_cond_map f g p =
  let rec aux acc = function
      [] -> List.rev acc
    | h::t -> aux ((if p h then f h else g h)::acc) t in
    aux [];; 

cond_map sqrt (fun x -> 0.) (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0]=acc_cond_map sqrt (fun x -> 0.) (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0];;

List.map;;

let map_cond_map f g p = List.map (fun e -> if p e then f e else g e);;

cond_map sqrt (fun x -> 0.) (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0]=map_cond_map sqrt (fun x -> 0.) (fun x->x>=0.0) [-1.0;9.0;-4.0;4.0];;

