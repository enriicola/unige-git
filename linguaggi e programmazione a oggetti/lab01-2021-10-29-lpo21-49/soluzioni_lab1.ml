(* definitions of the required functions *)

let rec prod = function
    hd::tl -> hd * prod tl 
  | _ -> 1;; (* [] is the remaing case *)

let rec member el = function
    hd::tl -> el=hd || member el tl
  | _ -> false;; (* [] is the remaing case *)

let rec insert el = function
    hd::tl-> hd::if el=hd then tl else insert el tl
  | _ -> [el];; (* [] is the remaing case *)

let rec odd = function 
    hd::_::tl -> hd::odd tl
  | l -> l;; (* shorter than [hd] -> [hd] | [] -> [] *)

let rec ord_insert el = function
    hd::tl as l -> if el < hd then el::l (* l abbreviates hd::tl *)
                   else if el=hd then l 
                   else hd::ord_insert el tl
  | _ -> [el];; (* [] is the remaing case *)

let rec merge = function
    hd1::tl1 as l1,(hd2::tl2 as l2) -> if hd1<hd2 then hd1::merge (tl1,l2) (* l1 abbreviates hd1::tl1, l2 abbreviates hd2::tl2 *)
                                       else if hd1=hd2 then hd1::merge (tl1,tl2) 
                                       else hd2::merge (l1,tl2)
  | [],l -> l 
  | l,_ -> l;; (* l,[] is the remaining case *)

let rec curried_merge l1 l2 = match l1,l2 with
    hd1::tl1 as l1,(hd2::tl2 as l2) -> if hd1<hd2 then hd1::curried_merge tl1 l2 (* l1 abbreviates hd1::tl1, l2 abbreviates hd2::tl2 *)
                                       else if hd1=hd2 then hd1::curried_merge tl1 tl2 
                                       else hd2::curried_merge l1 tl2
  | [],l -> l 
  | l,_ -> l;; (* l,[] is the remaining case *)


(* tests *)

prod [] = 1;;
prod [1;2;3;4] = 24;;

member 4 [1;2;3;4];;
not (member 4 [1;2;3]);;

insert 2 [0;1] = [0;1;2];;
insert 2 [0;2;1] = [0;2;1];;

odd [1] = [1];;
odd [1;2;3;4;5] = [1;3;5];;

ord_insert 1 [] = [1];;
ord_insert 1 [-2;0;4]=[-2;0;1;4];;
ord_insert (-5) [-2;0;4]=[-5;-2;0;4];;
ord_insert 10 [-2;0;4]=[-2;0;4;10];;
ord_insert 1 [-2;0;1;4] = [-2;0;1;4];;

merge ([4;5;6],[1;2;3]) = [1;2;3;4;5;6];;
merge ([1;3;5],[2;4;6]) = [1;2;3;4;5;6];;
merge ([1;2;3],[1;2;3]) = [1;2;3];;
curried_merge [4;5;6] [1;2;3] = [1;2;3;4;5;6];;
curried_merge [1;3;5] [2;4;6] = [1;2;3;4;5;6];;
curried_merge [1;2;3] [1;2;3] = [1;2;3];;

