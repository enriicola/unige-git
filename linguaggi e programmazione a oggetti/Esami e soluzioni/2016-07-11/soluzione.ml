let rec remove p = function
    [] -> [] |
    h::t -> let t2 = remove p t in if p h then t2 else h::t2;;

remove (fun x -> x < 0) [-1;-2;1;2;-3];;

let remove_acc p l = 
  let rec aux acc = function
      [] -> acc |
      h::t -> aux (if p h then acc else h::acc) t
  in  List.rev (aux [] l);;

remove (fun x -> x < 0) [-1;-2;1;2;-3] = remove_acc (fun x -> x < 0) [-1;-2;1;2;-3];;

let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;

let remove_it_list p l = List.rev (it_list (fun a x -> if p x then a else x::a) [] l);;

remove (fun x -> x < 0) [-1;-2;1;2;-3] = remove_it_list (fun x -> x < 0) [-1;-2;1;2;-3];;
