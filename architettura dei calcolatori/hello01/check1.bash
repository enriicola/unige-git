#!/bin/bash
C=hello0
E=hello1
if (( $# > 0 )) ; then E=$1 ; fi
if (( $# > 1 )) ; then C=$2 ; fi
/bin/rm -f $E
make $E
./$E > $E.out
make $C
./$C > $E.cmp
diff $E.out $E.cmp > $E.diff
A=$(stat --format="%s" $E.diff)
/bin/rm -f $E.out $E.cmp $E.diff
if [[ $A != 0 ]] ; then printf "Spiacente, %s.c non e\` corretto: riprova!\n" $E ;
	 exit 1 ; else printf "OK, %s.c e\` corretto\n" $E ; fi
grep "/*** TO BE DONE START ***" < $E.c | grep "/*** TO BE DONE END ***" > $E.line
A=$(stat --format="%s" $E.line)
/bin/rm -f $E.line
if (( $A < 80 )) ; then exit 0; fi
if (( $A > 100 )) ; then exit 0; fi
printf "\nOttimo!!! +1 di valutazione all'esame :-)\n\n"

