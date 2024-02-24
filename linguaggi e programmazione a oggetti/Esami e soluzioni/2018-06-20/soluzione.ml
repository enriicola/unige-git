let rec swap = function
    [] -> []
  | (h1,h2)::t -> (h2,h1)::swap t;;

swap [(1,"one");(2,"two");(3,"three")]=[("one",1);("two",2);("three",3)];;

let acc_swap l =
  let rec aux acc = function
      [] -> acc
    | (h1,h2)::t -> aux ((h2,h1)::acc) t
  in List.rev (aux [] l);;

swap [(1,"one");(2,"two");(3,"three")]=acc_swap [(1,"one");(2,"two");(3,"three")];;

let map_swap l = List.map (fun (h1,h2) -> h2,h1) l;;

swap [(1,"one");(2,"two");(3,"three")]=map_swap [(1,"one");(2,"two");(3,"three")];;
