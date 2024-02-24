let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;

let rec compose x = function f::l -> f (compose x l) |  _ -> x;;

let compose_acc x l = 
  let rec aux a = 
    function f::t -> aux (f a) t 
      |  _ -> a 
  in (aux x (List.rev l));;

let compose_it x l = it_list (fun a f -> f a) x (List.rev l);; 


