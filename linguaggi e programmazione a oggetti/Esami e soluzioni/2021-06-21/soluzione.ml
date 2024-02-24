let rec cat = function
   (s1,s2)::tl -> (s1^s2)::cat tl
   | _ -> [];;

cat [("hello"," world");("ciao ","mondo")]=["hello world"; "ciao mondo"];;
cat []=[];;

let map_cat = List.map (fun (s1,s2) -> s1^s2);; 

map_cat [("hello"," world");("ciao ","mondo")]=["hello world"; "ciao mondo"];;
map_cat []=[];;
