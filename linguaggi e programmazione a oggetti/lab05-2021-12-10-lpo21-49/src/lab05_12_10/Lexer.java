package lab05_12_10;

public interface Lexer {

	/*
	 * cerca di riconoscere il prossimo lessema a partire dalla posizione corrente nella linea; 
	 * in caso positivo, avanza nella lettura della linea
	 * solleva java.lang.RuntimeException se nessun lessema viene riconosciuto  
	 * solleva java.lang.NoSuchElementException se la linea e` finita
	 * 
	 */
	void next();

	/*
	 * restituisce il lessema appena riconosciuto
	 * solleva java.lang.IllegalStateException se prima 
	 * - next() non e` stato chiamato
	 * - oppure next() e` stato chiamato, ma ha sollevato un'eccezione
	 * - oppure reset(String line) e` stato chiamato
	 */
	String lexemeString();

	/*
	 * restituisce il gruppo del lessema appena riconosciuto
	 * solleva java.lang.IllegalStateException se prima 
	 * - next() non e` stato chiamato
	 * - oppure next() e` stato chiamato, ma ha sollevato un'eccezione
	 * - oppure reset(String line) e` stato chiamato
	 */	
	int lexemeGroup();

	/*
	 * restituisce true se e solo se la linea non e` stata ancora letta tutta
	 */
	boolean hasNext();

	/*
	 * reimposta il lexer e la linea da leggere,
	 * la lettura continua dal primo carattere della linea
	 */
	void reset(String line);
}