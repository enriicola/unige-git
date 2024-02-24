/*
 * malloc_play.c: bizzarro programma per studiare il comportamento delle system call
 *                malloc(), realloc() e free().
 *
 * versione 1.4 del 31/03/2017
 *
 * Programma sviluppato a supporto del laboratorio di
 * Sistemi di Elaborazione dell'Informazione del corso di laurea
 * in Informatica classe L-31 presso l'Universita` degli Studi di
 * Genova, anno accademico 2016/2017.
 *
 * Copyright (C) 2013-2017 by Giovanni Chiola <chiolag@acm.org>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 */

#include<stdlib.h>
#include<stdio.h>

/*** Just playing with the malloc(), realloc(), free()
 *** system calls in order to guess how memory management
 *** is implemented on this machine. If you get SEGMENTATION
 *** FAULT while addressing unallocated heap memory, just run
 *** the program with different "min" and/or "max" values,
 *** explicitly given on the command line through argv[] ***/
int main(int argc, char**argv){
    unsigned char *p, *q, *oldp;
    int sz=1, min=-8, max=60;

    if ( argc > 1 )
        sscanf(argv[1],"%d",&sz);
    if ( sz <= 0 )
        sz = 1;
    else if ( sz > 300 )
        sz = 300;
    if ( argc > 2 )
        sscanf(argv[2],"%d",&min);
    if ( min > -1 )
        min = -1;
    else if ( min < -50 )
        min = -50;
    if ( argc > 3 )
        sscanf(argv[3],"%d",&max);
    if ( max < sz )
        max = sz;
    else if ( max > (sz+100) )
        max = sz+100;
    printf("... allocating %d unsigned chars, min=%d, max=%d\n\n",sz,min,max);
    p = (unsigned char*)malloc(sz);
    if ( p == NULL ) {
        printf("could not allocate p\n");
        exit(0);
      }
    printf("*p=%hhu\n",*p);
    { int i;
      for ( i = -1 ; i >= min ; i-- )
        printf("p[%d]=%hhu\n",i,p[i]);
      for ( i = 1 ; i <= max ; i++ )
        printf("p[%d]=%hhu\n",i,p[i]);
    }
    printf("\n... allocating %d more unsigned chars to a different pointer\n\n",sz);
    q = (unsigned char*)malloc(sz);
    if ( q == NULL ) {
        printf("could not allocate q\n");
        exit(0);
      }
    { int i;
      for ( i = -1 ; i >= min ; i-- )
        printf("q[%d]=%hhu\n",i,q[i]);
      for ( i = 0 ; i <= max ; i++ )
        printf("q[%d]=%hhu\n",i,q[i]);
    }
    { int i;
      for ( i = -1 ; i >= min ; i-- )
        printf("p[%d]=%hhu\n",i,p[i]);
      for ( i = 0 ; i <= max ; i++ )
        printf("p[%d]=%hhu\n",i,p[i]);
    }
    sz += 10;
    printf("\n... reallocating %d unsigned chars\n\n",sz);
    oldp = p;
    p = (unsigned char*)realloc((void*)p,sz);
    { int i;
      for ( i = -1 ; i >= min ; i-- )
        printf("p[%d]=%hhu\n",i,p[i]);
      for ( i = 0 ; i <= max ; i++ )
        printf("p[%d]=%hhu\n",i,p[i]);
      for ( i = -1 ; i >= min ; i-- )
        printf("oldp[%d]=%hhu\n",i,oldp[i]);
      for ( i = 0 ; i <= max ; i++ )
        printf("oldp[%d]=%hhu\n",i,oldp[i]);
    }
    sz += 15;
    printf("\n... reallocating %d unsigned chars\n\n",sz);
    p = (unsigned char*)realloc((void*)p,sz);
    { int i;
      for ( i = -1 ; i >= min ; i-- )
        printf("p[%d]=%hhu\n",i,p[i]);
      for ( i = 0 ; i <= max ; i++ )
        printf("p[%d]=%hhu\n",i,p[i]);
      for ( i = -1 ; i >= min ; i-- )
        printf("oldp[%d]=%hhu\n",i,oldp[i]);
      for ( i = 0 ; i <= max ; i++ )
        printf("oldp[%d]=%hhu\n",i,oldp[i]);
    }
    sz -= 25;
    printf("\n... reallocating %d unsigned chars\n\n",sz);
    p = (unsigned char*)realloc((void*)p,sz);
    { int i;
      for ( i = -1 ; i >= min ; i-- )
        printf("p[%d]=%hhu\n",i,p[i]);
      for ( i = 0 ; i <= max ; i++ )
        printf("p[%d]=%hhu\n",i,p[i]);
      for ( i = -1 ; i >= min ; i-- )
        printf("oldp[%d]=%hhu\n",i,oldp[i]);
      for ( i = 0 ; i <= max ; i++ )
        printf("oldp[%d]=%hhu\n",i,oldp[i]);
    }
    printf("\n... freeing p\n\n",sz);
    free((void*)p);
    { int i;
      for ( i = 0 ; i >= min ; i-- )
        printf("p[%d]=%hhu\n",i,p[i]);
    }
    printf("\n... freeing q\n\n",sz);
    free((void*)q);
    { int i;
      for ( i = 0 ; i >= min ; i-- )
        printf("q[%d]=%hhu\n",i,q[i]);
      for ( i = -1 ; i >= min ; i-- )
        printf("oldp[%d]=%hhu\n",i,oldp[i]);
      for ( i = 0 ; i <= max ; i++ )
        printf("oldp[%d]=%hhu\n",i,oldp[i]);
    }
    printf("\n... freeing oldp\n\n",sz);
    free((void*)oldp);
    { int i;
      for ( i = -1 ; i >= min ; i-- )
        printf("oldp[%d]=%hhu\n",i,oldp[i]);
      for ( i = 0 ; i <= max ; i++ )
        printf("oldp[%d]=%hhu\n",i,oldp[i]);
    }
    exit(0);
}
