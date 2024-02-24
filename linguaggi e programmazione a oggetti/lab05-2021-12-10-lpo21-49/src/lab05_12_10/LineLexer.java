package lab05_12_10;

import java.util.NoSuchElementException;
import java.util.regex.*;

public class LineLexer implements Lexer {
	private final Matcher matcher;
	private MatchResult result; // risultato dell'ultimo match che ha avuto successo; definito solo se il metodo 'reset()' non è stato chiamato

	private MatchResult getResult() {
		if (this.result == null)
			throw new IllegalStateException();
		return this.result;
	}

	// crea un matcher con il pattern ottenuto compilando 'regEx' e la sequenza di input uguale a 'line'
	private LineLexer(String line, String regEx) {
		Pattern p = Pattern.compile(regEx);
		this.matcher = p.matcher(line);
	}

	// crea un matcher con il pattern ottenuto compilando 'regEx' e la sequenza di input uguale alla stringa vuota
	private LineLexer(String regEx) {
		// Pattern p = Pattern.compile(regEx); 
		// this.matcher = p.matcher("");
		// soluzione prof: 
		this("", regEx);
	}

	// factory method che usa il costruttore LineLexer(String line, String regEx) 
	public static LineLexer withLineRegex(String line, String regEx) {
		return new LineLexer(line,regEx);
	}

	// factory method che usa il costruttore LineLexer(String regEx)
	public static LineLexer withRegex(String regEx) {
		return new LineLexer(regEx);
	}

	public void next() {
		this.result = null; // il risultato precedente non mi interessa più

		if(!this.hasNext()) // soluzione del prof, noi non l'avevamo messo :C
			throw new NoSuchElementException();

		if(this.matcher.lookingAt()){ // remark: occhio alla differenza tra end() e regionEnd()
			this.result = this.matcher.toMatchResult(); // The toMatchResult() method of Matcher Class is used to get the current result state of this Matcher // soluzione del prof, noi non l'avevamo messo :C
			this.matcher.region(this.matcher.end(),this.matcher.regionEnd()); // posso chiamare end() sse prima ho chiamato lookingAt()
		}
		else
			throw new RuntimeException();
	}

	public String lexemeString() {
		// group può essere chiamato sse è stata chiamata prima lookingat o find o matches (altrimenti eccezione)
		if(this.result == null)
			throw new IllegalStateException();
		else
			return this.result.group();
		// soluzione del prof: 
		// return this.getResult().group();
	}

	public int lexemeGroup() {
		int groups = this.result.groupCount();
		for(int i=1; i<=groups; i++)
			if(this.result.group(i) != null)
				return i;

		throw new IllegalStateException();
	}

	public boolean hasNext() {
		return (this.matcher.regionStart() < this.matcher.regionEnd());
	}

	public void reset(String line) {
		// this.matcher.region(0,line.length()-1); // sbagliato, non è la reset senza parametri
		// soluzioni del prof: (devo fare la reset in funzione della stringa parametro)
		this.result = null;
		this.matcher.reset(line);
	}
}