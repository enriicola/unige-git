let rec curried_merge l1 l2 = match l1,l2 with
    hd1::tl1 as l1,(hd2::tl2 as l2) -> if hd1<hd2 then hd1::curried_merge tl1 l2
      else if hd1=hd2 then hd1::curried_merge tl1 tl2
      else hd2::curried_merge l1 tl2
  | [],l -> l
  | l,_ -> l
;;

(* tests
   curried_merge [4;5;6] [1;2;3] = [1;2;3;4;5;6];;
   curried_merge [1;3;5] [2;4;6] = [1;2;3;4;5;6];;
   curried_merge [1;2;3] [1;2;3] = [1;2;3];;
*)
