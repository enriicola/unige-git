(* let rec member el ls = match ls with
   | [] -> false
   | hd::tl -> if el = hd then true
   else member el tl
   ;; *)

(* non scrivere =true o =false *)

let rec member el = function
    hd::tl -> el=hd || member el tl
  | _ -> false (* [] caso base (?) *)
;;
