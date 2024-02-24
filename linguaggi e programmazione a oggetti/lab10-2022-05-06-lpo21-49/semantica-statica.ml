(* static semantics of the language *)

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

(* static types *)

(* examples
    PairType(IntType,BoolType) is  IntType * BoolType
    PairType(IntType,PairType(IntType,BoolType)) is IntType * (IntType * BoolType)
*)

type static_type = IntType | BoolType | PairType of static_type * static_type;;

(* static environments *)

type scope = (variable * static_type) list;;
type static_env = scope list;;

exception UndeclaredVariable of variable;;

exception AlreadyDeclaredVariable of variable;;

let empty_scope:scope = [];; 

let initial_env:static_env = [empty_scope];; (* the empty top-level scope *)

let enter_scope : static_env -> static_env = fun env -> empty_scope::env;; (* enters a new nested scope *)

(* variable lookup *)

(* resolve uses List.mem_assoc 
   examples:
   List.mem_assoc (SimpleVariable "x") [(SimpleVariable "x",IntType);(SimpleVariable "y",BoolType)]=true;;
   List.mem_assoc (SimpleVariable "y") [(SimpleVariable "x",IntType);(SimpleVariable "y",BoolType)]=true;;
   List.mem_assoc (SimpleVariable "z") [(SimpleVariable "x",IntType);(SimpleVariable "y",BoolType)]=false;;
*)

let rec resolve : variable -> static_env -> scope = fun var -> function (* retrieve the correct scope level for 'var', if any *)
    scope::(env:static_env) -> if(List.mem_assoc var scope) then scope else resolve var env
  | [] -> raise (UndeclaredVariable var);;

(* lookup uses List.assoc 
   examples:
   List.assoc (SimpleVariable "x") [(SimpleVariable "x",IntType);(SimpleVariable "y",BoolType)]=IntType;;
   List.assoc (SimpleVariable "y") [(SimpleVariable "x",IntType);(SimpleVariable "y",BoolType)]=BoolType;;
   List.assoc (SimpleVariable "z") [(SimpleVariable "x",IntType);(SimpleVariable "y",BoolType)];; raises exception Not_found
*)

let lookup : variable -> static_env -> static_type = fun variable env -> List.assoc variable (resolve variable env);;

(* variable declaration *)

(* example: dec x ty env1 = env2 means that 'env2' is the new environment after declaring variable 'x' of type 'ty' in the environment 'env1' *)  
(* dec uses List.mem_assoc, see the examples above *)

let dec : variable -> static_type -> static_env -> static_env = fun var ty -> function
    scope::env -> if(List.mem_assoc var scope) then raise (AlreadyDeclaredVariable var) else ((var,ty)::scope)::env
  | [] -> failwith "assertion error";; (* should never happen *)

(* static semantics *)

(* static errors *)

exception ExpectingTypeError of static_type;;

exception ExpectingPairError of unit;;  

(* typecheckExp : static_env -> exp -> static_type *)
(* typecheckExp env exp = ty means that expressions 'exp' is type correct in the environment 'env' and has static type 'ty' *)
   
let rec typecheckExp env=function 
    Add(exp1,exp2) | Mul(exp1,exp2) -> if typecheckExp env exp1=IntType && typecheckExp env exp2=IntType then IntType else raise (ExpectingTypeError IntType)
  | And(exp1,exp2) -> if typecheckExp env exp1=BoolType && typecheckExp env exp2=BoolType then BoolType else raise (ExpectingTypeError BoolType)
  | Eq(exp1,exp2) -> let type1=typecheckExp env exp1 in if typecheckExp env exp2=type1 then BoolType else raise (ExpectingTypeError type1)
  | PairLit(exp1,exp2) -> let type1=typecheckExp env exp1 and type2=typecheckExp env exp2 in PairType(type1,type2)
  | Fst exp -> (match typecheckExp env exp with PairType(type1,_) -> type1 | _ -> raise (ExpectingPairError ()))
  | Snd exp -> (match typecheckExp env exp with PairType(_,type2) -> type2 | _ -> raise (ExpectingPairError()))
  | Sign exp -> if typecheckExp env exp=IntType then IntType else raise (ExpectingTypeError IntType)
  | Not exp -> if typecheckExp env exp=BoolType then BoolType else raise (ExpectingTypeError BoolType)
  | IntLiteral _ -> IntType
  | BoolLiteral _ -> BoolType
  | Var var -> lookup var env;;

(* mutually recursive
   typecheckStmt : static_env -> stmt -> static_env
   typecheckBlock : static_env -> block -> unit
   typecheckStmtSeq : static_env -> stmt_seq -> static_env
*)

(* typecheckStmt env1 st = env2 means that statement 'st' is type correct in the environment 'env1' and defines the new environment 'env2' *)
(* typecheckBlock env block = () means that the block 'block' is type correct in the environment 'env' *)
(* typecheckStmtSeq env1 stSeq = env2 means that statement sequence 'stSeq' is type correct in the environment 'env1' and defines the new environment 'env2' *)

let rec typecheckStmt env=function
    AssignStmt(variable,exp) -> 
      let type1=lookup variable env in 
        if typecheckExp env exp=type1 then env else raise (ExpectingTypeError type1)
  | VarStmt(var,exp) -> dec var (typecheckExp env exp) env
  | PrintStmt exp -> let _=typecheckExp env exp in env
  | IfStmt(exp,block1,block2) -> 
      if typecheckExp env exp=BoolType then 
        let _=typecheckBlock env block1 and _=typecheckBlock env block2 in env 
      else raise (ExpectingTypeError BoolType)
and 
 typecheckBlock env =function
    NoBlock -> ()
  | Block stmt_seq -> let _=typecheckStmtSeq (enter_scope env) stmt_seq in ()
and                        
  typecheckStmtSeq env=function 
    SingleStmt stmt -> typecheckStmt env stmt
  | MoreStmt(stmt,stmt_seq) -> typecheckStmtSeq (typecheckStmt env stmt) stmt_seq;;

(* typecheckProg : prog -> unit *)
(* typecheckProg p = () means that program 'p' is well defined with respect to the static semantics *)

let typecheckProg = function SimpleProg stmt_seq -> let _=typecheckStmtSeq initial_env stmt_seq in ();;

(* some simple tests with the static semantics *)

let stmt1=VarStmt(SimpleVariable "x",IntLiteral 0);;

let stmt2=AssignStmt(SimpleVariable "x",Add(Var(SimpleVariable "x"),IntLiteral 1));;

let stmt3=PrintStmt(Var(SimpleVariable "x"));;

let prog1=SimpleProg(MoreStmt(stmt1,(MoreStmt(stmt2,SingleStmt stmt3))));;

typecheckProg prog1;; (* 'var x=0; x=x+1; print x' is type correct *)

let stmt1=VarStmt(SimpleVariable "x",PairLit(IntLiteral 0,BoolLiteral false));;

let stmt2=PrintStmt(Add(Fst(Var(SimpleVariable "x")),IntLiteral 1));;

let stmt3=PrintStmt(And(Snd(Var(SimpleVariable "x")),BoolLiteral true));;

let stmt4 = AssignStmt(SimpleVariable "x",PairLit(IntLiteral 1,BoolLiteral true));;

let prog2=SimpleProg(MoreStmt(stmt1,(MoreStmt(stmt2,MoreStmt(stmt3,SingleStmt stmt4)))));;

typecheckProg prog2;; (* 'var x=0,false; print fst x+1; print snd x && true; x=1,true' is type correct *)

let stmt1=VarStmt(SimpleVariable "x",IntLiteral 0);;

let stmt2=IfStmt(Eq(Var(SimpleVariable "x"),IntLiteral 0),Block(MoreStmt(VarStmt(SimpleVariable "x",BoolLiteral false),SingleStmt(PrintStmt(And(Var(SimpleVariable "x"),BoolLiteral true))))),NoBlock);;

let stmt3=AssignStmt(SimpleVariable "x",IntLiteral 2);;

let prog3=SimpleProg(MoreStmt(stmt1,(MoreStmt(stmt2,SingleStmt stmt3))));; 

typecheckProg prog3;; (* 'var x=0; if(x==0){var x=false; print x && true}; x=2' is type correct *)
