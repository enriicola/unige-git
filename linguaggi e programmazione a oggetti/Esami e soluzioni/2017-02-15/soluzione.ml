let rec replace x y = function
    [] -> [] |
    h::t -> (if h=x then y else h)::replace x y t;;

let tail_replace x y l = let rec aux a = function
    [] -> a |
    h::t -> aux ((if h=x then y else h)::a) t
  in List.rev (aux [] l);;

let fold_replace x y l = List.rev (List.fold_left (fun a h -> (if h=x then y else h)::a) [] l);;

replace 'L' 'l' ['H';'e';'L';'L';'o'] = ['H'; 'e'; 'l'; 'l'; 'o'];;

tail_replace 'L' 'l' ['H';'e';'L';'L';'o'] = ['H'; 'e'; 'l'; 'l'; 'o'];;

fold_replace 'L' 'l' ['H';'e';'L';'L';'o'] = ['H'; 'e'; 'l'; 'l'; 'o'];;
