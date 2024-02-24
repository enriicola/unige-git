PLAY = malloc_play
TEST = test_vector
SOURCES = Makefile COPYING README vector.c vector.h test_vector.c $(PLAY).c
TARF = starWarsReAlloc.tgz

all: vector.o $(TEST) $(PLAY)

$(PLAY) : $(PLAY).c
	gcc -o $(PLAY) $(PLAY).c

vector.o: vector.c vector.h
	gcc -c vector.c

$(TEST): test_vector.o vector.o
	gcc -o $(TEST) test_vector.o vector.o

test_vector.o: test_vector.c vector.h
	gcc -c test_vector.c

clean:
	/bin/rm -f a.out *.o $(TEST) $(PLAY)

tgz: clean $(SOURCES)
	cd .. ; tar cvzf $(TARF) src

