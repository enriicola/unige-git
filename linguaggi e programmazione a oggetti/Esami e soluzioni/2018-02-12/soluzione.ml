let rec insert_after p e = function
    [] -> []
  | h::t -> let nt = insert_after p e t in 
        if p h then h::e::nt else h::nt;;

insert_after (fun x->x>3) 0 []=[];;

insert_after (fun x->x>3) 0 [1;4;2;5]=[1;4;0;2;5;0];;


let acc_insert_after p e l =
  let rec aux a = function
      [] -> a
    | h::t -> aux (if p h then e::h::a else h::a) t
  in List.rev(aux [] l);;

acc_insert_after (fun x->x>3) 0 [] = insert_after (fun x->x>3) 0 [];;

acc_insert_after (fun x->x>3) 0 [1;4;2;5] = insert_after(fun x->x>3) 0 [1;4;2;5];;

(* slightly more efficient version *)

let acc_insert_after2 p e l = 
  let rec aux a = function
      [] -> a
    | h::t -> aux (if p h then h::e::a else h::a) t
  in aux [] (List.rev l);;

acc_insert_after2 (fun x->x>3) 0 [] = insert_after (fun x->x>3) 0 [];;

acc_insert_after2 (fun x->x>3) 0 [1;4;2;5] = insert_after(fun x->x>3) 0 [1;4;2;5];;

let it_insert_after p e l = List.rev (List.fold_left (fun a h -> if p h then e::h::a else h::a) [] l);;

it_insert_after (fun x->x>3) 0 [] = insert_after (fun x->x>3) 0 [];;

it_insert_after (fun x->x>3) 0 [1;4;2;5] = insert_after (fun x->x>3) 0 [1;4;2;5];;

(* slightly more efficient version *)

let it_insert_after2 p e l = List.fold_left (fun a h -> if p h then h::e::a else h::a) [] (List.rev l);;

it_insert_after2 (fun x->x>3) 0 [] = insert_after (fun x->x>3) 0 [];;

it_insert_after2 (fun x->x>3) 0 [1;4;2;5] = insert_after (fun x->x>3) 0 [1;4;2;5];;
