let rec range a b = if b < a then [] else a::range (a+1) b;;

range 1 0 = [];;

range 0 0 = [0];;

range 1 5 = [1;2;3;4;5];;

let acc_range = 
  let rec aux acc a b = if b < a then acc else aux (b::acc) a (b-1)
  in  aux [];;

acc_range 0 1 = range 0 1;;

acc_range 0 0 = range 0 0;;

acc_range 1 5 = range 1 5;;

let rec step_range a b c = if b < a then [] else a::step_range (a+c) b c;;

step_range 1 0 1 = range 1 0;;

step_range 0 0 1 = range 0 0;;

step_range 1 5 1 = range 1 5;;

