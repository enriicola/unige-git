let rec odd l = match l with
    [] -> []
  | h::[] -> [h]@[]
  |hd::_::tl -> hd::odd tl 
;;

odd [1;2;3;4;5]

(* tests
   odd [1;2;3;4;5] = [1;3;5]
   odd ["a";"b";"a";"b";"a"] = ["a";"a";"a"]
*)

(* soluzione prof
   let rec odd = function 
   hd::_::tl -> hd::odd tl 
   | l -> l (* più corta di [hd] -> [hd] | [] -> [] *)
   ;;
*)
