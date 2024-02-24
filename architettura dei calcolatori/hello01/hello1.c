#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void my_printf(char*p){
	char s[strlen(p)+1], *q=s;
        strcpy(s,p);

/*** TO BE DONE START ***/                                                   /*** TO BE DONE END ***/

}

int main(){
	my_printf("hello world!");
	my_printf("How are you?");
	my_printf("i\'m OK, and you?");
	my_printf("1, 2, 3, testing ...");
	my_printf("\t  looks OK :-)");
	my_printf("   bye bye!");
	exit(0);
}
