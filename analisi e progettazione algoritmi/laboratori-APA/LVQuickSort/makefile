all:
	g++ LVQuickSort.cpp -o startLVQS

	@echo "Avvio il programma, la sequenza verrà ordinata..."

	./startLVQS

	@echo "Creo gli istogrammi..."

	python3 make_ist.py

	@echo "Programma terminato."

clean:
	rm -f Istogramma.png comparison.dat espettazione.dat startLVQS
