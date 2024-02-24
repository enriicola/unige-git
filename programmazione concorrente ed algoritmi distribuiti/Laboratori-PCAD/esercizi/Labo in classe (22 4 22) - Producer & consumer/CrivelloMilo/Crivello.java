package CrivelloMilo;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;

public class Crivello extends Thread {
   private Integer myPrimeNumber;
   public BlockingQueue<Integer> queue;

   public Crivello(int mynumber){
		this.myPrimeNumber = mynumber;
		this.queue = new LinkedBlockingDeque<>();
   }

   public void push(Integer number){
		queue.add(number);
   }

   public void run() {
		try{
			Integer mynumber = queue.take();
			while(mynumber % myPrimeNumber == 0)
				mynumber = queue.take();

			Crivello crivello = new Crivello(mynumber);
			crivello.start();

			while(mynumber != -1){
				if(mynumber % myPrimeNumber != 0)
					crivello.push(mynumber);
				mynumber = queue.take();
			}

			crivello.push(mynumber);
			crivello.interrupt();

			System.out.print(myPrimeNumber);
			System.out.print(" - ");
		}
		catch(InterruptedException e){
			System.out.println("\n\n");
			return;
		}
	}
}