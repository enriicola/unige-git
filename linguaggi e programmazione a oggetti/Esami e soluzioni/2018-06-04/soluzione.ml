let rec first = function
    [] -> []
  | (h1,h2)::t -> h1::first t;;

first [(1,"one");(2,"two");(3,"three")]=[1;2;3];;

let acc_first l =
  let rec aux acc = function
      [] -> acc
    | (h1,h2)::t -> aux (h1::acc) t
  in List.rev (aux [] l);;

first [(1,"one");(2,"two");(3,"three")]=acc_first [(1,"one");(2,"two");(3,"three")];;

let map_first l = List.map (fun (h1,h2) -> h1) l;;

first [(1,"one");(2,"two");(3,"three")]=map_first [(1,"one");(2,"two");(3,"three")];;
