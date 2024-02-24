let rec select p l1 l2 = 
  match l1,l2 with
    hd1::tl1,hd2::tl2 -> (if p hd1 hd2 then hd1 else hd2)::select p tl1 tl2
  | [],[] -> []
  | _ -> raise (Invalid_argument "select");;

let acc_select p =
  let rec aux acc l1 l2 =
    match l1,l2 with
      hd1::tl1,hd2::tl2 -> aux ((if p hd1 hd2 then hd1 else hd2)::acc) tl1 tl2
    | [],[] -> List.rev acc
    | _ -> raise (Invalid_argument "select")
  in aux [];;


select ( < ) [0;2;5] [1;3;4]=[0;2;4];;
select ( < ) [] []=[];;
try select ( < ) [0] [1;3;5]=[] with _ -> true;;
try select ( < ) [0;2;4] [1]=[] with _ -> true;;

acc_select ( < ) [0;2;5] [1;3;4]=[0;2;4];;
acc_select ( < ) [] []=[];;
try acc_select ( < ) [0] [1;3;5]=[] with _ -> true;;
try acc_select ( < ) [0;2;4] [1]=[] with _ -> true;;
