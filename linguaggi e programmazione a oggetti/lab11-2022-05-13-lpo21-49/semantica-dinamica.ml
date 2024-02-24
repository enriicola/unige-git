(* dynamic semantics of the language *)

type variable = SimpleVariable of string;;

(* AST of expressions *)
type exp = Add of exp * exp | Mul of exp * exp | And of exp * exp | Eq of exp * exp | PairLit of exp * exp | Fst of exp | Snd of exp | Sign of exp | Not of exp | IntLiteral of int | BoolLiteral of bool | Var of variable;;

(* AST of statements and sequence of statements, mutually recursive *)
type
  stmt = AssignStmt of variable * exp | VarStmt of variable * exp | PrintStmt of exp | IfStmt of exp * block * block 
and
  block = NoBlock | Block of stmt_seq
and
  stmt_seq = SingleStmt of stmt | MoreStmt of stmt * stmt_seq;;

(* AST of programs *)
type prog = SimpleProg of stmt_seq;;

(* values *)

(* examples
    PairLit(IntLiteral 2,BoolLiteral false) is  (2,false)
    PairLit(IntLiteral 2,PairLit(IntLiteral 3,BoolLiteral true)) is (2,(3,true)) 
*)

type value = IntValue of int | BoolValue of bool | PairValue of value*value;;

(* dynamic environments *)

type scope = (variable * value) list;;
type dynamic_env = scope list;;

exception UndeclaredVariable of variable;;

exception AlreadyDeclaredVariable of variable;;

let empty_scope:scope = [];; 

let starting_env:dynamic_env = [empty_scope];; (* just the empty top-level scope *)

let enter_scope : dynamic_env -> dynamic_env = fun env -> empty_scope::env;; (* enters a new nested scope *)

let exit_scope : dynamic_env -> dynamic_env = function (* removes the innermost scope, only needed for the dynamic semantics *)
    _::env -> env
  | [] -> failwith "assertion error";; (* should never happen *)

(* variable lookup *)

(* resolve uses List.mem_assoc 
   examples:
   List.mem_assoc (SimpleVariable "x") [(SimpleVariable "x",IntValue 3);(SimpleVariable "y",BoolValue false)]=true;;
   List.mem_assoc (SimpleVariable "y") [(SimpleVariable "x",IntValue 3);(SimpleVariable "y",BoolValue false)]=true;;
   List.mem_assoc (SimpleVariable "z") [(SimpleVariable "x",IntValue 3);(SimpleVariable "y",BoolValue false)]=false;;
*)

(* resolve : variable -> dynamic_env -> scope *)

let rec resolve : variable -> dynamic_env -> scope = fun var -> function
    scope::(env:dynamic_env) -> if(List.mem_assoc var scope) then scope else resolve var env
  | [] -> raise (UndeclaredVariable var);;

(* lookup uses List.assoc 
   examples:
   List.assoc (SimpleVariable "x") [(SimpleVariable "x",IntValue 3);(SimpleVariable "y",BoolValue false)]=IntValue 3;;
   List.assoc (SimpleVariable "y") [(SimpleVariable "x",IntValue 3);(SimpleVariable "y",BoolValue false)]=BoolValue false;;
   List.assoc (SimpleVariable "z") [(SimpleVariable "x",IntValue 3);(SimpleVariable "y",BoolValue false)];; raises exception Not_found
*)

let lookup : variable -> dynamic_env -> value = fun variable env -> List.assoc variable (resolve variable env);;

(* variable declaration *)

(* example: dec x value env1 = env2 means that 'env2' is the new environment after declaring variable 'x' initialized with value 'value' in the environment 'env1' *)  
(* dec uses List.mem_assoc, see the examples above *)

let dec : variable -> value -> dynamic_env -> dynamic_env = fun var value -> function
    scope::env -> if(List.mem_assoc var scope) then raise (AlreadyDeclaredVariable var) else ((var,value)::scope)::env
  | [] -> failwith "assertion error";; (* should never happen *)

(* variable update, only needed for the dynamic semantics *)
(* update uses List.mem_assoc, see the examples above *) 

let rec update : variable -> value -> dynamic_env -> dynamic_env = fun var value -> function
    scope::env -> if(List.mem_assoc var scope) then ((var,value)::scope)::env else scope::update var value env
  | [] -> raise (UndeclaredVariable var);;

(* dynamic errors *)

exception ExpectingTypeError of string;; (* dynamic conversion error *) 

(* auxiliary functions *)

(* dynamic conversion to int type *)
(* toInt : value -> int *)

let toInt = function
    IntValue i -> i |
    _ -> raise (ExpectingTypeError "int")

(* dynamic conversion to bool type *)
(* bool : value -> bool *)

let toBool = function
    BoolValue b -> b |
    _ -> raise (ExpectingTypeError "bool")

(* pair : value -> value * value *)
(* dynamic conversion to product  type *)

let toPair = function
    PairValue (e1,e2) -> e1,e2 |
    _ -> raise (ExpectingTypeError "pair");;

(* implementation of fst and snd operators *)
(* fst : 'a * 'b -> 'a *)

let fst (v1,_) = v1;;

(* snd : 'a * 'b -> 'b *)

let snd (_,v2) = v2;;

(* conversion to string *)

(* to_string : value -> string *)

let rec to_string = function
    IntValue i -> string_of_int(i) 
  | BoolValue b -> string_of_bool(b) 
  | PairValue(v1,v2) -> "(" ^ to_string v1 ^ "," ^ to_string v2 ^ ")";;

(* auxiliary printing function *)

(* println : value -> unit *)

let println value = print_string (to_string value ^ "\n");;

(* main functions *)
(* evalExp : dynamic_env -> exp -> value *)
(* evalExp env exp = val means that expressions 'exp' successfully evaluates to 'val' in the environment 'env' *)

let rec evalExp env=function 
    Add(exp1,exp2) -> IntValue(toInt(evalExp env exp1)+toInt(evalExp env exp2))
  | Mul(exp1,exp2) -> IntValue(toInt(evalExp env exp1)*toInt(evalExp env exp2))
  | And(exp1,exp2) -> BoolValue(toBool(evalExp env exp1)&&toBool(evalExp env exp2))
  | Eq(exp1,exp2) -> BoolValue(evalExp env exp1=evalExp env exp2)
  | PairLit(exp1,exp2) -> PairValue(evalExp env exp1,evalExp env exp2)
  | Fst exp -> fst (toPair(evalExp env exp))
  | Snd exp -> snd (toPair(evalExp env exp))
  | Sign exp -> IntValue(-toInt(evalExp env exp))
  | Not exp -> BoolValue(not (toBool(evalExp env exp)))
  | IntLiteral i -> IntValue i
  | BoolLiteral b -> BoolValue b
  | Var var -> lookup var env;;

(* mutually recursive
   executeStmt : dynamic_env -> stmt -> dynamic_env
   executeBlock : dynamic_env -> block -> dynamic_env
   executeStmtSeq : dynamic_env -> stmt_seq -> dynamic_env
*)

(* executeStmt env1 'stmt' = env2 means that the execution of statement 'stmt' in environment 'env1' successfully returns the new environment 'env2' *)
(* executeBlock env1 block = env2 means that the execution of block 'block' in environment 'env1' successfully returns the new environment 'env2' *)
(* executeStmtSeq env1 stmt_seq = env2 means that the execution of sequence 'stmt_seq' in environment 'env1' successfully returns the new environment 'env2' *)
(* executeStmt, executeBlock and executeStmtSeq write on the standard output if some 'print' statement is executed *)

let rec executeStmt env=function
    AssignStmt(var,exp) -> update var (evalExp env exp) env
  | VarStmt(var,exp) -> dec var (evalExp env exp) env
  | PrintStmt exp -> let _=println (evalExp env exp) in env
  | IfStmt(exp,thenBlock,elseBlock) ->
        if toBool(evalExp env exp) then  
          executeBlock env thenBlock  
        else 
          executeBlock env elseBlock 
            
and
  
  executeBlock env=function (* note the differences with the static semantics *)
    NoBlock -> env
  | Block stmt_seq -> exit_scope (executeStmtSeq (enter_scope env) stmt_seq)

and 

  executeStmtSeq env=function 
    SingleStmt stmt -> executeStmt env stmt
  | MoreStmt(stmt,stmt_seq) -> executeStmtSeq (executeStmt env stmt) stmt_seq;;

(* executeProg : prog -> unit *)
(* executeProg prog = () means that program 'prog' has been executed successfully, by possibly writing on the standard output *)

let executeProg = function SimpleProg stmt_seq -> let _=executeStmtSeq starting_env stmt_seq in ();;

(* some simple tests with the dynamic semantics *)

let stmt1=VarStmt(SimpleVariable "x",IntLiteral 0);;

let stmt2=AssignStmt(SimpleVariable "x",Add(Var(SimpleVariable "x"),IntLiteral 1));;

let stmt3=PrintStmt(Var(SimpleVariable "x"));;

let prog1=SimpleProg(MoreStmt(stmt1,(MoreStmt(stmt2,SingleStmt stmt3))));;

executeProg prog1;; (* 'var x=0; x=x+1; print x' prints '1' *)

let stmt1=VarStmt(SimpleVariable "x",PairLit(IntLiteral 0,BoolLiteral false));;

let stmt2=PrintStmt(Var(SimpleVariable "x"));;

let stmt3=PrintStmt(Add(Fst(Var(SimpleVariable "x")),IntLiteral 1));;

let stmt4=PrintStmt(And(Snd(Var(SimpleVariable "x")),BoolLiteral true));;

let stmt5=AssignStmt(SimpleVariable "x",PairLit(IntLiteral 1,BoolLiteral true));;

let prog2=SimpleProg(MoreStmt(stmt1,(MoreStmt(stmt2,MoreStmt(stmt3,MoreStmt(stmt4,SingleStmt stmt5))))));;

executeProg prog2;; (* 'var x=0,false; print x; print fst x+1; print snd x && true; x=1,true' prints '(0,false) 1 false' *)

let stmt1=VarStmt(SimpleVariable "x",IntLiteral 0);;

let stmt2=IfStmt(Eq(Var(SimpleVariable "x"),IntLiteral 0),Block(MoreStmt(AssignStmt(SimpleVariable "x",IntLiteral 2),MoreStmt(VarStmt(SimpleVariable "x",BoolLiteral false),SingleStmt(PrintStmt(And(Var(SimpleVariable "x"),BoolLiteral true)))))),NoBlock);;

let stmt3=AssignStmt(SimpleVariable "x",Add(Var(SimpleVariable "x"),IntLiteral 1));;

let stmt4=PrintStmt(Var(SimpleVariable "x"));;

let prog3=SimpleProg(MoreStmt(stmt1,(MoreStmt(stmt2,(MoreStmt(stmt3,SingleStmt stmt4))))));;

executeProg prog3;; (* 'var x=0; if(x==0){x=2; var x=false; print x && true}; x=x+1; print x' prints 'false 3' *)

(*  these programs are not type correct, but execute correctly *)

let stmt1=VarStmt(SimpleVariable "x",IntLiteral 0);;

let stmt2=AssignStmt(SimpleVariable "x",Add(IntLiteral 1,Var(SimpleVariable "x")));;

let stmt3=AssignStmt(SimpleVariable "x",Eq(IntLiteral 1,Var(SimpleVariable "x")));;

let stmt4=PrintStmt(Var(SimpleVariable "x"));;

let prog4=SimpleProg(MoreStmt(stmt1,MoreStmt(stmt2,(MoreStmt(stmt3,SingleStmt stmt4)))));;

executeProg prog4;; (* 'var x=0; x=x+1; x=1==x; print x' prints 'true' *)

let stmt1=VarStmt(SimpleVariable "x",PairLit(IntLiteral 0,BoolLiteral false));;

let stmt2=PrintStmt(Eq(Var(SimpleVariable "x"),PairLit(BoolLiteral false,IntLiteral 0)));;

let prog5=SimpleProg(MoreStmt(stmt1,SingleStmt(stmt2)));;

executeProg prog5;; (* 'var x=0,false; print x==(false,0)' prints 'false' *)
