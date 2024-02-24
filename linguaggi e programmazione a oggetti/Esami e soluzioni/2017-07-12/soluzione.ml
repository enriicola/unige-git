let rec update p f = function 
    [] -> []
  | (k,v)::t -> (k,if p k then f v else v)::update p f t;;

update (fun k -> k>9) String.uppercase [(8,"eight");(10,"ten");(4,"four");(11,"eleven")];;

update (fun k -> k>9) String.uppercase [(8,"eight");(10,"ten");(4,"four");(11,"eleven")]=update (fun k -> k>9) (String.uppercase) [(8,"eight");(10,"ten");(4,"four");(11,"eleven")];;

let acc_update p f l = 
  let rec aux a = function
      [] -> a
    | (k,v)::t -> aux ((k,if p k then f v else v)::a) t
  in  
    aux [] (List.rev l);;

acc_update (fun k -> k>9) String.uppercase [(8,"eight");(10,"ten");(4,"four");(11,"eleven")]=update (fun k -> k>9) (String.uppercase) [(8,"eight");(10,"ten");(4,"four");(11,"eleven")];;

let rec it_list f a = function x::l -> it_list f (f a x) l | _ -> a;;

let it_update p f l = it_list (fun a (k,v) -> (k,if p k then f v else v)::a) [] (List.rev l);;

it_update (fun k -> k>9) String.uppercase [(8,"eight");(10,"ten");(4,"four");(11,"eleven")]=update (fun k -> k>9) (String.uppercase) [(8,"eight");(10,"ten");(4,"four");(11,"eleven")];;
