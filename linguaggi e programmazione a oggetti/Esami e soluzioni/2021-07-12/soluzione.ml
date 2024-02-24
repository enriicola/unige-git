let rec swap = function
   (x,y)::tl -> (y,x)::swap tl
|  _ -> [];;

swap [(1,"one");(2,"two");(3,"three")] = [("one", 1); ("two", 2); ("three", 3)];;
swap [] = [];;

let map_swap l = List.map (fun(x,y)->y,x) l;;

map_swap [(1,"one");(2,"two");(3,"three")] = [("one", 1); ("two", 2); ("three", 3)];;
map_swap [] = [];;


