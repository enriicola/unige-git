package lab05_12_10;

import java.util.Scanner;
import static java.lang.System.*;

public class Main {

	public static void main(String[] args) {
		Scanner scanner = new Scanner(in);
		Lexer lexer = LineLexer.withRegex("([a-zA-Z]+)|(\\d+)|(\\s+)");
		while (scanner.hasNextLine()) {
			lexer.reset(scanner.nextLine());
			while (lexer.hasNext()) {
				lexer.next();
				out.println("lexeme: '" + lexer.lexemeString() + "'" + " group: " + lexer.lexemeGroup());
			}
		}
		scanner.close();
	}
}