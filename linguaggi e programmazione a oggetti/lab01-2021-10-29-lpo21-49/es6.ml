let rec merge = function (* +vedi esempio esecuzione a matita :) *)
    hd1::tl1 as l1, (hd2::tl2 as l2) -> if hd1<hd2 then hd1::merge(tl1,l2)
      else if hd1=hd2 then hd1::merge(tl1,tl2)
      else hd2::merge(l1,tl2)
  | [],l -> l (* merge di lista vuota con lista... *)
  | l,_ -> l (* uso la wildcard per la lista vuota, tanto è per forza l'ultimo caso rimanente *)
;;

(* tests
   merge ([1;3;5],[2;4;6]) = [1;2;3;4;5;6]
   merge ([1;2;3],[4;5]) = [1;2;3;4;5]
   merge ([3],[1;2;4;5]) = [1;2;3;4;5]
*)
