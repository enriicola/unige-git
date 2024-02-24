package CrivelloMilo;
import java.util.*;

public class Main {
	public static void main(String[] args){
		Scanner input = new Scanner(System.in);
		System.out.print("\nCalcola i numeri primi fino a : ");
		int N = input.nextInt();

		Crivello crivello = new Crivello(3);
		crivello.start();

		System.out.println("\n");

		for(int i = 3; i <= N; i++)
			if( i%2 != 0)
				crivello.push(i);

		crivello.push(-1);
		crivello.interrupt();
		input.close();
	}
}