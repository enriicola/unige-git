let rec merge f = function
    [] -> []
  | (h1,h2)::t -> f(h1,h2)::merge f t;;

merge (fun (x,y) -> x+y) [(1,2);(3,4);(5,6)]=[3;7;11];;

merge (fun (x,y) -> x+String.length y)  [(1,"one");(2,"two");(3,"three")]=[4;5;8];;


let acc_merge f l =
  let rec aux acc = function
      [] -> acc
    | (h1,h2)::t -> aux (f(h1,h2)::acc) t
  in List.rev (aux [] l);;

merge (fun (x,y) -> x+y) [(1,2);(3,4);(5,6)]=acc_merge (fun (x,y) -> x+y) [(1,2);(3,4);(5,6)];;

merge (fun (x,y) -> x+String.length y)  [(1,"one");(2,"two");(3,"three")]=acc_merge (fun (x,y) -> x+String.length y)  [(1,"one");(2,"two");(3,"three")];;


let map_merge f l = List.map f l;;

merge (fun (x,y) -> x+y) [(1,2);(3,4);(5,6)]=map_merge (fun (x,y) -> x+y) [(1,2);(3,4);(5,6)];;

merge (fun (x,y) -> x+String.length y)  [(1,"one");(2,"two");(3,"three")]=map_merge (fun (x,y) -> x+String.length y)  [(1,"one");(2,"two");(3,"three")];;
