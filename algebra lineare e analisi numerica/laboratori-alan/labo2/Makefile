CC = g++ -std=c++11
CFLAGS = -g -fsanitize=address

output:
	$(CC) $(CFLAGS) sistemi_lineari1.cpp -o sistemi_lineari1
	./sistemi_lineari1
	$(CC) $(CFLAGS) sistemi_lineari2.cpp -o sistemi_lineari2
	./sistemi_lineari2
	$(CC) $(CFLAGS) sistemi_lineari3.cpp -o sistemi_lineari3
	./sistemi_lineari3
	make clean

clean:
		rm -f *.o
		rm -f *.out
		rm -f core
		rm -rf *.dSYM