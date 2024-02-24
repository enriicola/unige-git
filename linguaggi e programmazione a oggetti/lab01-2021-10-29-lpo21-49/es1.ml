let rec prod = function
    hd::tl -> hd*prod tl
  |_->1 (* ci va 1 e non zero, altrimenti azzera tutto il calcolo... *)
;;

(* prod [2;3;4] *)
