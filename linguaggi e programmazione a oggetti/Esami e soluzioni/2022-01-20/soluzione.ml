let rec sum_wise l1 l2 = 
  match l1,l2 with
    hd1::tl1,hd2::tl2 -> hd1+hd2::sum_wise tl1 tl2
  | [],[] -> []
  | _ -> raise (Invalid_argument "sum_wise");;

let acc_sum_wise l =
  let rec aux acc l1 l2 =
    match l1,l2 with
      hd1::tl1,hd2::tl2 -> aux (hd1+hd2::acc) tl1 tl2
    | [],[] -> List.rev acc
    | _ -> raise (Invalid_argument "sum_wise")
  in aux [] l;;


sum_wise [0;2;4] [1;3;5]=[1;5;9];;
sum_wise [] []=[];;
try sum_wise [0] [1;3;5]=[] with _ -> true;;
try sum_wise [0;2;4] [1]=[] with _ -> true;;

acc_sum_wise [0;2;4] [1;3;5]=[1;5;9];;
acc_sum_wise [] []=[];;
try acc_sum_wise [0] [1;3;5]=[] with _ -> true;;
try acc_sum_wise [0;2;4] [1]=[] with _ -> true;;
