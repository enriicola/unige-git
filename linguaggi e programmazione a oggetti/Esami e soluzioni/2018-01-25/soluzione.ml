(* punto (a) *)

let rec list_gen f i n = 
  if(n<=0) 
  then []
  else  i::list_gen f (f i) (n-1);;

list_gen (fun x->x+1) 0 3=[0;1;2];;

list_gen (fun x->x+1) 1 4=[1;2;3;4];;

list_gen (fun x->"a"^x) "" 5=["";"a";"aa";"aaa";"aaaa"];;


(* punto (b) *)

let acc_list_gen f v len = let rec
  aux acc i n = 
                             if(n<=0)
                             then acc
                             else aux (i::acc) (f i) (n-1) 
  in  List.rev (aux [] v len);;


list_gen (fun x->x+1) 0 3=acc_list_gen (fun x->x+1) 0 3;;

list_gen (fun x->x+1) 1 4=acc_list_gen (fun x->x+1) 1 4;;

list_gen (fun x->"a"^x) "" 5=acc_list_gen (fun x->"a"^x) "" 5;;
