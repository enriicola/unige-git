let rec values p = function
    [] -> [] |
    (k,v)::tl -> let l=values p tl in if p k then v::l else l;;

values (fun k -> k>0) [(1,"one");(0,"zero");(2,"two")] = ["one";"two"];;

values (fun k -> k>0) [(1,"b");(2,"b");(0,"a")] = ["b";"b"];;

let values_acc p l = let rec aux acc = function
    [] -> acc |
    (k,v)::tl -> aux (if p k then v::acc else acc) tl
  in List.rev (aux [] l);;

values_acc (fun k -> k>0) [(1,"one");(0,"zero");(2,"two")] = ["one";"two"];;

values_acc (fun k -> k>0) [(1,"b");(2,"b");(0,"a")] = ["b";"b"];;

let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;

let values_it_list p l = List.rev (it_list (fun a (k,v) -> if p k then v::a else a) [] l);;

values_it_list (fun k -> k>0) [(1,"one");(0,"zero");(2,"two")] = ["one";"two"];;

values_it_list (fun k -> k>0) [(1,"b");(2,"b");(0,"a")] = ["b";"b"];;

