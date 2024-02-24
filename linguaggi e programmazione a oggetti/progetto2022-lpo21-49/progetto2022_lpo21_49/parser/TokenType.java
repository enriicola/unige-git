package progetto2022_lpo21_49.parser;


public enum TokenType { 
	// symbols
	ASSIGN, MINUS, PLUS, TIMES, NOT, AND, EQ, STMT_SEP, PAIR_OP, OPEN_PAR, CLOSE_PAR, OPEN_BLOCK, CLOSE_BLOCK, OPEN_ARR, CLOSE_ARR,
	// keywords
	PRINT, VAR, BOOL, IF, ELSE, FST, SND, LENGTH, WHILE,
	// non singleton categories
	SKIP, IDENT, NUM,   
	// end-of-file
	EOF, 	
}
