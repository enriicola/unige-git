let rec zip l1 l2 = match l1,l2 with
    h1::t1,h2::t2 -> (h1,h2)::zip t1 t2
  | _ -> [];;

zip [1;2;3] ["one";"two";"three"]=[(1, "one"); (2, "two"); (3, "three")];;

zip [1;2] ["one";"two";"three"]=[(1, "one"); (2, "two")];;

zip [1;2;3] ["one";"two"]=[(1, "one"); (2, "two")];;

let acc_zip l = 
  let rec aux acc l1 l2 = match l1,l2 with
      h1::t1,h2::t2 -> aux ((h1,h2)::acc) t1 t2
    | _ -> List.rev acc
  in aux [] l;;

acc_zip [1;2;3] ["one";"two";"three"]=zip [1;2;3] ["one";"two";"three"];;

acc_zip [1;2] ["one";"two";"three"]=zip [1;2] ["one";"two";"three"];;

acc_zip [1;2;3] ["one";"two"]=zip [1;2;3] ["one";"two"];;



