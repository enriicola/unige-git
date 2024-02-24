let rec fuse f l1 l2 = match l1,l2 with
   hd1::tl1,hd2::tl2 -> f hd1 hd2::fuse f tl1 tl2
|  _ -> [];;

fuse max [1;2;3] [3;1;4] = [3;2;4];;

fuse max [1;2;3] [3] = [3];;

fuse max [4] [3;5;7] = [4];;

fuse (+) [1;2;3] [3;1;4] = [4;3;7];;

fuse (+) [1;2;3] [3] = [4];;

fuse (+) [4] [3;5;7] = [7];;

let acc_fuse f = 
   let rec aux acc l1 l2 =
      match l1,l2 with
         hd1::tl1,hd2::tl2 -> aux (f hd1 hd2::acc) tl1 tl2
      |  _ -> List.rev acc
   in aux [];;   

acc_fuse max [1;2;3] [3;1;4] = [3;2;4];;

acc_fuse max [1;2;3] [3] = [3];;

acc_fuse max [4] [3;5;7] = [4];;

acc_fuse (+) [1;2;3] [3;1;4] = [4;3;7];;

acc_fuse (+) [1;2;3] [3] = [4];;

acc_fuse (+) [4] [3;5;7] = [7];;
