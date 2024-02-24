--------------------------------------------progetto OCA Parte 2 ---------------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------- CREAZIONE SCHEMA E TABELLE -------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- creazione dello schema logico della base di dati in accordo allo schema
--relazionale ottenuto alla fine della fase di progettazione logica

--il conteggio delle tuple è stato effettuato in seguito all'inserimento totale, quindi
--dopo l'aggiunta manuale ed automatica (datanamic);

--l'inserimento massivo con datanamic è stato effettuato solo sulle tuple set_icone, Gioco, sfida e dado, in
--quanto presenti nelle interrogazione del carico di lavoro(tranne set_icone, ma ne abbiamo inserito
--diverse per rendere più flessibili i giochi);

--su alcune tuple avevamo inizialmente effettuato un piccolo inserimento di test con datanamic che
--si è rivelato essere utile ad abbiamo deciso di mantenerlo

create schema "OCA";
set search_path to "OCA";
set datestyle to "MDY";

--20 tuple (solo inserimento manuale)
create table utente(
  email varchar(50) primary key,
  nickname varchar(20) not null,
  nome varchar(20),
  cognome varchar(30),
  dataN date
);

--1309 tuple (sia inserimento manuale che automatico)
create table set_icone(
  nome varchar(30) primary key
);

--29 tuple (sia inserimento manuale che automatico)
create table icona(
  idIcona integer primary key,
  set_icone varchar(30) references set_icone(nome) not null,
  immagine varchar(30) not null,
  unique(set_icone, immagine)
);

--10022 tuple (sia inserimento manuale che automatico)
create table gioco(
  IdG integer Primary key,
  Max_n_Squadre integer not null check(Max_N_Squadre>1),
  n_Caselle integer not NULL,
  set_icone varchar(30) NOT NULL REFERENCES set_icone (nome),
  dummy_gioco text
);

--10020 tuple (sia inserimento manuale che automatico)
create table sfida(
  idS integer primary key,
  gioco integer references gioco(idg) not null,
  data_ora timestamp not null,
  durata_max TIME not null,
  moderata boolean not null,
  durata TIME check (durata<= durata_max),
  conclusa boolean not null,
  dummy_sfida text,
  unique(data_ora, gioco)
);

--12 tuple (solo inserimento manuale)
--N.B. abbiamo inserito l'id, che si presenta nel formato "101,102,103, 201,202,203,...":
--con questo formato indichiamo un eventuale id del gioco attraverso la cifra delle centinaia(1,2,...),
--mentre con la cifra delle unità inidichiamo la posizione all'interno del gioco (1,2,3, 1,2,3,...)
create table casella_podio(
  idPod integer primary key,
  posizione integer,
  x decimal(4,0) not null,
  y decimal(4,0) not null,
  gioco integer references gioco(idG),
  unique(posizione, gioco),
  unique(x, y, gioco)
);

--25 tuple (sia inserimento manuale che automatico)
--nell'inserimento randomico il punteggio_tot viene inserito, ma "nella realtà" l'inserimento
--richiede che quell'attributo mantenga il suo valore di default fino all'arrivo dei turni che
--coinvolgono la squadra ed incrementano il punteggio tramite il trigger apposito;
create table squadra(
  idSq integer primary key,
  nome varchar(30) not null,
  sfida integer references sfida(idS) not null,
  icona integer references icona(idIcona) not null,
  punteggio_tot integer not null default 0,
  podio integer references casella_podio(idPod) default null,
  tempo_usato time not null,
  unique(nome, sfida),
  unique(icona, sfida)
);

--2991 tuple (sia inserimento manuale che automatico)
create table dado(
  id integer primary key,
  valore_max integer not null check(valore_max<=6),
  valore_min integer not null check(valore_min<valore_max),
  gioco integer not null references gioco(idG),
  dummy_dado text
);

--21 tuple (sia inserimento manuale che automatico)
create table appartiene(
  utente varchar(50) references utente(email),
  squadra integer references squadra(idSq),
  caposquadra boolean,
  coach boolean,
  primary key(utente,squadra)
);

--22 tuple (sia inserimento manuale che automatico)
create table casella_percorso(
  idCas integer primary key,
  numero integer NOT NULL,
  gioco integer  references gioco(idG) not null,
  x decimal(4,0) not null,
  y decimal(4,0) not null,
  speciale boolean not null,
  video varchar(40),
  casella_arrivo integer references casella_percorso(idCas)
  deferrable initially deferred,
  unique(numero, gioco),
  unique(x, y, gioco)
);

--18 tuple (solo inserimento manuale)
--oltre ad alcuni inserimenti di testing, abbiamo inserito alcuni turni appositi
--per una simulazione di sfida tra due squadre, in grado di mostrare bene l'efficacia
--del trigger implementato, infatti nel file consegnato apposito per gli inserimenti viene evidenziata
--la porzione dedicata al testing di quest'ultimo (sebbene funzioni con qualsiasi inserimento);
create table turno(
  numero integer,
  squadra integer references squadra(idSq),
  valore_dado integer not null default 0,
  casellaPart integer references casella_percorso(idCas) not null,
  punteggio_preso integer,
  primary key(numero, squadra)
);

--4 tuple (inserimento automatico)
--inizialmente erano solamente un test, ma pur esserendo molto poche si sono rivelate efficaci
--per la verifica delle interrogazioni che coinvolgevano la tabella, ed anzi essendo solamente 4
--si possono intuitivamente verificare i diversi collegamenti riportati nelle query.
create table task(
  testo varchar(240) not null primary key,
  tempoMax time not null,
  punteggioMax integer not null,
  casella integer references casella_percorso(idCas) not null unique
);

--0 tuple
create table consegna_task(
  task varchar(240) references TASK(testo) ,
  utente varchar(50) references UTENTE(email),
  squadra integer references squadra(idSq),
  tempoRisposta time,
  file varchar(50) not null,
  validazione boolean not null,
  punteggio_preso integer,
  consegna_squadra boolean,
  primary key(task, utente, squadra)
);

--0 tuple
create table quiz(
  testo varchar(120) primary key,
  tempoMax time not null,
  casella integer references CASELLA_PERCORSO(idCas) not null unique
);

--0 tuple
create table risposta_possibile(
  opzione char,
  quiz varchar(120) references QUIZ(testo),
  punteggioR integer not null,
  immagine varchar(30),
  testo varchar(40),
  primary key(opzione, quiz)
);

--0 tuple
create table risposta_quiz_utente(
  utente varchar(50) references UTENTE(email),
  opzione char not null,
  quiz varchar(120) not null,
  squadra integer references squadra(idSq) not null,
  tempoRisposta time,
  punteggio_preso decimal(4,0),
  scelta boolean,
  primary key(utente, opzione, quiz, squadra),
  foreign key(opzione, quiz) references RISPOSTA_POSSIBILE(opzione, quiz)
);

--6 tuple (solo inserimento manuale)
create table dadi_usati(
  turno integer not null,
  squadra integer not null,
  dado integer references dado(id),
  primary key(turno, squadra, dado),
  foreign key(turno, squadra) references turno(numero, squadra)
);


--altri tre vincoli esprimibili con check
alter table sfida
add check ((durata is null and conclusa = false)
		   or (durata is not null and conclusa = true));

alter table casella_percorso
add check ((casella_arrivo is null and speciale = false)
		   or (casella_arrivo is not null and speciale = true));

alter table risposta_possibile
add check ((testo is not null) or (immagine is not null));

--per il conteggio dei blocchi abbiamo sfruttato le informazioni del database con
--l'interrogazione circa il numero di pagine occupato dagli elementi dello schema OCA;
/*
SELECT oid
FROM pg_namespace
WHERE nspname = 'OCA';  --16997

SELECT relname, relpages
FROM pg_class
WHERE relnamespace = 16997;
*/






----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------- INSERIMENTO DI TEST CON DATANAMIC ---------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

--La seguente porzione di codice è un primo inserimento effettuato per testing, generato con datanamic
set search_path to "OCA";
set datestyle to "MDY";

INSERT INTO "OCA"."set_icone" ("nome") VALUES ('ac2K0jD2TYZrvm5MmWVX');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('uvWK2ts5UTpOjcyeHf');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('xjCBBfzs');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('Oy8XNGmotllkGqxyx8');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('ejlMexfZbLOMhO1F0scRqnLsVDCo');



INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan") VALUES ('FransStockton@freeweb.es','rqkXhg7zel6rOM4Ex6Pk','dILNXIsnXLXzMd','1DM1QstobluOfy2LE','09/26/2015');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan") VALUES ('R.Gonzalez4@weboffice.es','bekY','aVIsNIeg','r','09/30/2007');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan") VALUES ('PetraDaniel4@yahoo.de','fL1tfRY36u56o0g4aWa','Nl7NIQBJ','Jo3CSk2RP25','10/16/2008');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan") VALUES ('Oliver.Jenssen@excite.net','W6WvSopOw6wkoGwe7vBi','gK',NULL,NULL);
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan") VALUES ('Y.Johnson@live.cc','D0YK','btkExSur0Np','43OqYyOKvvTU678V43DUZOVI','06/27/2007');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan") VALUES ('Jackvan Doorn4@telefonica.co.uk','2GLTVSdPT','etUGL',NULL,'03/21/2005');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan") VALUES ('Y.Comeau@mail.net','c0T1jYJatkw','3QBm','wWgwnQqN1U4HCigSx86SaoUJcp','09/07/2018');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan") VALUES ('GMatthew5@aol.nl','5KatROL70xf1GO1q8','kzS5KM3rTdmzwe7m','H1pDl7MYpfZLn8UksL7vMerk','07/31/2000');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan") VALUES ('Hank.Long@live.us','w4WSI6w72wbhymM4H','Utinz5Lg5SoISBJlOGs','CFwjQzTGU4YlBPukx0L','10/24/2009');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan") VALUES ('Fred.Huston5@web.cc','axLptHnXM77RzE','O2QObvfUN','L','11/25/2000');



INSERT INTO "OCA"."gioco" ("idg","max_n_squadre","n_caselle","set_icone") VALUES (1,3689,853086,'ac2K0jD2TYZrvm5MmWVX');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre","n_caselle","set_icone") VALUES (2,864240,681478,'xjCBBfzs');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre","n_caselle","set_icone") VALUES (3,191927,727764,'xjCBBfzs');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre","n_caselle","set_icone") VALUES (4,403913,357620,'ac2K0jD2TYZrvm5MmWVX');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre","n_caselle","set_icone") VALUES (5,458212,775119,'ac2K0jD2TYZrvm5MmWVX');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre","n_caselle","set_icone") VALUES (6,234458,701047,'xjCBBfzs');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre","n_caselle","set_icone") VALUES (7,419461,168825,'Oy8XNGmotllkGqxyx8');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre","n_caselle","set_icone") VALUES (8,452845,979839,'Oy8XNGmotllkGqxyx8');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre","n_caselle","set_icone") VALUES (9,676632,657448,'ac2K0jD2TYZrvm5MmWVX');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre","n_caselle","set_icone") VALUES (10,907201,443820,'uvWK2ts5UTpOjcyeHf');



INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (1,'xjCBBfzs','ED3tzvaeEiAATo0nN');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (2,'xjCBBfzs','bvqlADKFi');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (3,'xjCBBfzs','D8iY2VuftmOi33UauoVL7hxAJvgc');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (4,'xjCBBfzs','C0WC2Tbn');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (5,'xjCBBfzs','xhpNjxKDaZDcdWzE5P1j5');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (6,'ac2K0jD2TYZrvm5MmWVX','5ZzzxdS5ugHrwvAS');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (7,'ac2K0jD2TYZrvm5MmWVX','vNVNLzxjItImMxIyNRCbTtgmFop');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (8,'ac2K0jD2TYZrvm5MmWVX','nlAaji8pkoRKa5ZWiLAT01EstFHfle');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (9,'ac2K0jD2TYZrvm5MmWVX','65sL');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (10,'ejlMexfZbLOMhO1F0scRqnLsVDCo','WmonEow8g');



INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (1,10,'04/09/2003 00:13:00','06:41:00',False,NULL,False);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (2,10,'09/19/2001 01:23:00','10:13:00',False,NULL,False);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (3,2,'03/27/2013 06:44:00','08:40:00',False,'01:11:00',True);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (4,2,'03/02/2001 06:02:00','04:47:00',True,'00:20:00',True);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (5,2,'03/08/2017 02:49:00','10:37:00',False,'05:46:00',True);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (6,7,'05/08/2018 02:41:00','07:01:00',True,'06:30:00',true);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (7,7,'04/30/2021 05:55:00','02:25:00',False,'01:39:00',True);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (8,6,'10/23/2009 03:20:00','03:13:00',True,'01:36:00',True);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (9,6,'01/28/2016 05:16:00','05:06:00',True,'4:31:00',true);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (10,1,'11/18/2016 03:54:00','09:46:00',False,'02:03:00',True);



INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (1,'Xk3aSbD',5,10,871888,'03:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (2,'6Esf5Rk1y0rSpf3',3,10,680829,'10:31:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (3,'qu7tmTh5u',8,5,702633,'04:33:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (4,'bZUaPABria8qpiPti',10,1,952841,'02:01:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (5,'zGTnOJHOmin8sjzCTYzzVjRYTk',6,9,526634,'06:47:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (6,'dz0QdNFieCuS',6,10,280028,'04:05:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (7,'ZzKn6o6iAcdSML7p3kB88lzF',2,4,741678,'07:00:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (8,'dWBqwbmuEgO',7,10,373014,'00:01:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (9,'sDom8vKbrEJ1ScYK2C',3,6,299706,'07:01:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (10,'2TzIrIAbFmvWRuHZbQuQ8QlhAx',10,6,15805,'01:20:00');


INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('PetraDaniel4@yahoo.de',8,False,NULL);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('Oliver.Jenssen@excite.net',5,True,NULL);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('Y.Johnson@live.cc',1,True,NULL);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('PetraDaniel4@yahoo.de',9,False,NULL);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('R.Gonzalez4@weboffice.es',4,True,False);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('Y.Johnson@live.cc',9,False,True);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('R.Gonzalez4@weboffice.es',2,True,NULL);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('Jackvan Doorn4@telefonica.co.uk',9,True,False);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('Y.Comeau@mail.net',4,False,False);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('Y.Comeau@mail.net',8,False,True);

INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (1,48787,10,719,1,False,'UGVx30Q',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (2,345821,3,761,8454,True,'sYgNrIwoFgPjDfw',1);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (3,380402,3,496,4197,False,'qn4vdEYxlqrTjvHltHlPB7',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (4,715820,5,1370,2,True,'FC2ndFFuMUPekinBSe0HNh0B',3);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (5,801403,10,1973,203,False,'mw6yEIpoWyBh1kNQ1ZOSIKYmHvVu',NULL);


INSERT INTO "OCA"."task" ("testo","tempomax","punteggiomax","casella") VALUES ('ftFPzvwc5nuHCjCpHoz0Ug2QIgST7Bkcdkre3NmlnOhwRGuyFsD3yr407MmSz8pMGPy7uql5yqR5B1aeF4lDnREcKeboJyrgHaxkJ0KawK5q5KQzRv2F6Az4jkcoK0qGcnVNkiVGZaDfxxebwDxI4zElJGeysvLEXGNvabNLkUTeKfZ6i46Nlbq6IBt5g8Ise','04:14:00',239249,2);
INSERT INTO "OCA"."task" ("testo","tempomax","punteggiomax","casella") VALUES ('1eHHrtbPpB3HrfxqzLA67oDTYQoUiAFs1xsl46pRYi6EztODCTt0ibMfng7eAI5nBG4s6i18EjOMeKszjV6E4ms4qIvLVODt2rbLAX5ts7Z3rgtnVWL','10:29:00',27604,5);
INSERT INTO "OCA"."task" ("testo","tempomax","punteggiomax","casella") VALUES ('6FpvbSWlu34vcOQfTuCmxcfvKycjGcZTIoAHUYQhWWYha3EXLrW','00:55:00',168620,1);
INSERT INTO "OCA"."task" ("testo","tempomax","punteggiomax","casella") VALUES ('Di1rvKLPDwwMnrIBcTO8ma4zD1HjkyKE','01:55:00',387364,3);







----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------- INSERIMENTO A MANO -------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

--è necessario effettuare questi inserimenti manuali dopo l'inserimento di testing con datanamic, in quanto
--sono presenti alcuni riferimenti ad elementi registrati in precedenza;

--prestare attenzione all'inserimento dei turni e della tabella "appartiene", con tuple di esempi per la verifica
--di violazione dei trigger;

--Abbiamo cambiato il datestyle, in quanto inserendo a mano abbiamo utilizzato un formato giorno/mese/anno;
set datestyle to "DMY";

--set set icone
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('leoni');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('auto');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('gatti');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('cani');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('rettili');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('cartoni');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('draghi');
INSERT INTO "OCA"."set_icone" ("nome") VALUES ('ninja');

--giochi
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (100, 5, 47, 'ac2K0jD2TYZrvm5MmWVX');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (101, 6, 50, 'cartoni');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (102, 7, 45, 'cani');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (103, 3, 35, 'Oy8XNGmotllkGqxyx8');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (104, 9, 33, 'ninja');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (105, 5, 20, 'ac2K0jD2TYZrvm5MmWVX');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (106, 2, 30, 'uvWK2ts5UTpOjcyeHf');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (107, 3, 18, 'xjCBBfzs');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (108, 2, 16, 'leoni');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (109, 4, 15, 'leoni');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (110, 6, 20, 'ninja');
INSERT INTO "OCA"."gioco" ("idg","max_n_squadre", "n_caselle", "set_icone")
  VALUES (111, 10, 52, 'gatti');

--icone
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (20,'gatti','gatto_nero');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (21,'gatti','purr');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (22,'cani','doggo');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (23,'ninja','leonardo');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (24,'ninja','raffaello');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (25,'ninja','michelangelo');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (26,'ninja','donatello');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (27,'auto','ferrari');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (28,'auto','nissan');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (29,'auto','lotus');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (30,'rettili','lizard');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (31,'leoni','alex');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (32,'rettili','crocodile');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (33,'gatti','miao');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (34,'cani','pastore');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (35,'gatti','gattone');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (36,'gatti','micione');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (37,'gatti','certosino');
INSERT INTO "OCA"."icona" ("idicona","set_icone","immagine") VALUES (38,'gatti','maine coon');

--sfide
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (20, 105, '10/01/2021 04:45:00', '06:40:00', false, '01:45:00', true);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (21, 105, '09/01/2021 03:20:00', '06:40:00', true, '04:25:00', true);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (22, 106, '18/03/2021 19:45:00', '06:40:00', true, '05:40:00', true);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (23, 111, '22/07/2021 11:45:00', '03:10:00', false, NULL, false);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (24, 111, '09/01/2021 09:45:00', '02:40:00', true,'01:00:00', true);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (25, 102, '20/07/2021 07:45:00', '06:30:00', false, NULL, false);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (26, 100, '22/01/2021 10:45:00', '00:30:00', false, '00:25:00', true);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (27, 100, '11/03/2021 18:45:00', '00:30:00', true, '00:20:00', true);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (28, 106, '09/03/2021 09:45:00', '06:40:00', false, '05:20:00', true);
INSERT INTO "OCA"."sfida" ("ids","gioco","data_ora","durata_max","moderata","durata","conclusa") VALUES (29, 106, '09/03/2021 08:45:00', '01:40:00', false, '00:45:00', true);

--squadre
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (11,'beach-please',25,20,0,'02:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (12,'infallibili',26,25,0,'01:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (13,'Celestini',27,28,0,'01:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (14,'Holly e Query',28,6,0,'03:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (15,'UniGe',22,37,0,'03:02:00'); --occhio
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (16,'UniBo',20,10,0,'04:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (17,'UniFe',23,32,0,'04:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (18,'UniPd',29,21,0,'01:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (19,'UniMi',25,34,0,'01:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (20,'A.C.ciuga',28,21,0,'02:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (21,'Rossi',21,38,0,'01:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (22,'MegaMen',22,24,0,'00:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (23,'BD Crashers',28,37,0,'00:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (24,'Chicago Bulls',23,34,0,'05:02:00');
INSERT INTO "OCA"."squadra" ("idsq","nome","sfida","icona","punteggio_tot","tempo_usato") VALUES (25,'Pro Secco',24,22,0,'02:02:00');

--podio
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (101,1,10,20,100);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (102,2,11,21,100);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (103,3,12,22,100);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (201,1,20,42,106);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (202,2,21,43,106);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (203,3,22,44,106);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (301,1,10,10,111);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (302,2,11,11,111);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (303,3,12,12,111);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (401,1,8,20,102);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (402,2,9,21,102);
INSERT INTO "OCA"."casella_podio" ("idpod","posizione","x","y","gioco") VALUES (403,3,10,22,102);

--percorso
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (17,8,10,76,80,false,'GREG543F',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (18,9,10,27,90,False,'UGVxFBV',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (20,11,10,90,110,False,'UGVx30Q',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (21,12,10,7,102,false,'UGVC30Q',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (23,14,10,80,140,False,'DFVx30Q',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (24,15,10,120,155,false,'CVBxBGQ',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (10,1,10,70,123,true,'UGVx30Q',17);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (11,2,10,72,20,true,'UGVx34Q',18);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (12,3,10,72,35,False,'UGVx36Q',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (13,4,10,72,46,False,'UASx30Q',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (14,5,10,723,50,true,'UGVx30Q',10);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (15,6,10,60,60,true,'AFDB30Q',24);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (16,7,10,56,70,False,'U3GREWGQ',NULL);
INSERT INTO "OCA"."casella_percorso" ("idcas","numero","gioco","x","y","speciale","video","casella_arrivo") VALUES (22,13,10,79,130,true,'UGV120Q',22);

--dado
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (1, 6, 1, 4);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (2, 6, 2, 4);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (3, 4, 0, 4);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (4, 6, 2, 4);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (5, 5, 1, 4);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (6, 6, 1, 2);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (7, 4, 0, 2);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (8, 4, 2, 111);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (9, 6, 1, 108);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (10, 2, 1, 100);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (11, 6, 2, 100);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (12, 6, 1, 111);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (13, 4, 1, 100);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (14, 6, 0, 103);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (15, 6, 1, 105);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (16, 5, 0, 108);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (17, 6, 1, 111);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (18, 6, 0, 100);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (19, 5, 1, 102);
INSERT INTO "OCA"."dado" ("id","valore_max","valore_min","gioco") VALUES (20, 4, 1, 101);

--utenti
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan")
  VALUES ('bomber@hotmail.it','bomber','daniele','scala','06/11/2000');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan")
  VALUES ('bomberone@hotmail.it','bomberone',NULL,NULL,'06/10/2002');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan")
  VALUES ('bomberissimo@hotmail.it','bomberissimo','mirko','lelli','22/3/2000');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan")
  VALUES ('grande@hotmail.it','grande','jacopo','soli','06/11/2003');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan")
  VALUES ('mejor@hotmail.it','mejor','enrico','pezzano','01/01/1998');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan")
  VALUES ('fuego@hotmail.it','fuego','daniele','ortaggi','02/10/1922');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan")
  VALUES ('modello@hotmail.it','modello',NULL,NULL,'20/11/2000');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan")
  VALUES ('cap@hotmail.it','cap',NULL,NULL,'06/04/2000');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan")
  VALUES ('boss@hotmail.it','boss','gabriele','spini','05/06/2010');
INSERT INTO "OCA"."utente" ("email","nickname","nome","cognome","datan")
  VALUES ('fico@hotmail.it','fico',NULL,NULL,'22/02/2000');

--appartiene (l'ultima tupla (commentata) è un esempio che permette di verificare il trigger in caso di violazione)
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('mejor@hotmail.it',16,true,False);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('mejor@hotmail.it',17,False,False);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('mejor@hotmail.it',18,False,true);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('fuego@hotmail.it',16,true,False);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('fuego@hotmail.it',17,False,true);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('bomber@hotmail.it',16,true,False);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('bomberissimo@hotmail.it',16,False,true);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('bomberissimo@hotmail.it',15,False,true);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('grande@hotmail.it',12,true,False);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('modello@hotmail.it',14,False,False);
INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('fico@hotmail.it',14,False,true);
/*INSERT INTO "OCA"."appartiene" ("utente","squadra","caposquadra","coach") VALUES ('mejor@hotmail.it',19,False,False); */

--inserimento principale di turno: possibilità di verificare il trigger inserendo nell'ordine proposto (verosimile ad una partita reale)
--mantengo la presenza della query che, dopo ogni inserimento, permette di verificare che la sfida proceda come dovrebbe.
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (1,24,23,40);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (1,17,23,30);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (2,24,23,40);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (2,17,24,80);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (3,24,22,30);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (3,17,20,5);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (4,24,24,40);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (4,17,24,100);
/*select * from squadra join sfida on squadra.sfida= sfida.ids
where ids =  23;*/

--altri turni per ulteriori verifiche di aggiornamento
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (1,18,10,20);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (2,18,14,28);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (3,18,16,40);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (1,12,10,80);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (2,12,17,4);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (3,12,20,0);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (1,16,10,20);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (2,16,17,10);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (3,16,22,8);
INSERT INTO "OCA"."turno" ("numero","squadra","casellapart","punteggio_preso") VALUES (4,16,24,40);

--dadi usati
INSERT INTO "OCA"."dadi_usati" ("turno", "squadra", "dado") VALUES (1,24,8);
INSERT INTO "OCA"."dadi_usati" ("turno", "squadra", "dado") VALUES (1,17,11);
INSERT INTO "OCA"."dadi_usati" ("turno", "squadra", "dado") VALUES (2,16,19);
INSERT INTO "OCA"."dadi_usati" ("turno", "squadra", "dado") VALUES (2,12,8);
INSERT INTO "OCA"."dadi_usati" ("turno", "squadra", "dado") VALUES (3,24,11);
INSERT INTO "OCA"."dadi_usati" ("turno", "squadra", "dado") VALUES (3,16,9);




----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------- INSERIMENTO DATANAMIC -------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------




/*
si invita ad eseguire lo script circa l'inserimento massivo effettuato con datanamic che
si trova nella medesima cartella di questo file;
per questioni di spazio e rallentamento generale, abbiamo preferito lasciarlo nel file apposito;
*/








----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------- CARICO DI LAVORO, VISTA, QUERY E SCHEMA FISICO -------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

--di seguito abbiamo inserito le query del carico di lavoro, la vista richiesta e le altre interrogazioni meno frequenti; inoltre abbiamo direttamente effettuato
--abbiamo direttamente effettuato l'implementazione dello schema fisico con aggiunta di indici e viste materializzate ove necessario
--(l'eventuale scelta degli indici è descritta nei commenti che seguono l'interrogazione a cui si riferiscono)

----------------------------------------------------------------------------------------------------------------------------------------

--La definizione di una vista che fornisca alcune informazioni riassuntive per ogni gioco: il numero di sfide rela-
--tive a quel gioco disputate, la durata media di tali sfide, il numero di squadre e di giocatori partecipanti a tali sfide, i punteggi
--minimo, medio e massimo ottenuti dalle squadre partecipanti a tali sfide;
create view info_gioco as
select *
from (select  tab1.gioco, count(idSq) as n_squadre, avg(punteggio_tot) as media, max(punteggio_tot) as punt_max, min(punteggio_tot) as punt_min, n_utenti
  		from sfida
  		inner join squadra on squadra.sfida=sfida.idS
  		inner join (select gioco, count(utente) as n_utenti
      				    from sfida inner join squadra on squadra.sfida=sfida.idS
      				  	inner join appartiene on appartiene.squadra=squadra.idSq
           				where conclusa
          				group by gioco) as tab1 on tab1.gioco=sfida.gioco
  		where conclusa
  		group by tab1.gioco, n_utenti) as tab2
natural inner join (select gioco, count(idS) as n_sfide, avg(durata) as durata_media
                   	from sfida
                   	where conclusa
                    group by gioco) as tab3;

--la vista filtra diversi elementi dello schema, infatti restituisce solamente i giochi per i quali le
--informazioni richieste sono reperibili e disponibili, in quanto la quasi totalità delle tuple di gioco e sfida
--(inserite automaticamente) hanno pochissime informazioni ed elementi collegati.




-------------------------------------interrogazioni meno frequenti---------------------------------------------------------

--a) Determinare i giochi che contengono caselle a cui sono associati task;
select distinct gioco
from casella_percorso
right join task on task.casella = casella_percorso.idCas;
--indici possibili:
	--create index I_casella on task(casella);  [non è molto efficace]

--creazione di una vista materializzata per l'agevolazione della ricerca, in quanto
--presente la clausola distinct ed un join;
CREATE MATERIALIZED VIEW caselle_con_task AS
select distinct gioco
from casella_percorso
right join task on task.casella = casella_percorso.idCas;

select * from caselle_con_task;


--b) Determinare i giochi che non contengono caselle a cui sono associati task;
select idg from gioco
except
select distinct gioco
from casella_percorso
right join task on task.casella = casella_percorso.idCas;
--l'indice possibile è il medesimo dell'interrogazione precedente, ma nuovamente dimostra poca efficacia;
--Abbiamo però la possibilità di utilizzare la vista caselle_con_task creata.

select idG from gioco
except
select gioco from caselle_con_task;



--c) Determinare le sfide che hanno durata superiore alla
--durata media delle sfide relative allo stesso gioco.
select ids
from sfida s
where s.durata > (select avg(sfida.durata)
                  from sfida
                  where s.gioco=sfida.gioco
                  group by sfida.gioco);

--possibili indici:
	--create index I_durata on sfida(durata); [poco efficace]
	create index I_sfida_g on sfida (gioco); --in grado di agevolare la subquery



------------------------------------------CARICO DI LAVORO---------------------------------------------------------

--Q1: Determinare l’identificatore dei giochi che coinvolgono al più
--    quattro squadre e richiedono l’uso di due dadi.
select dado.gioco
from gioco
join dado on dado.gioco= gioco.idg
where Max_n_Squadre<=4
group by dado.gioco having count(dado.gioco) >= 2;
--indici possibili:
	create index I_n_squadre on gioco(Max_n_Squadre);
	--create unique index I_gioco on gioco(idG);
	--create index I_dado_gioco on dado(gioco);
--tutti e tre gli indici si sono rivelati poco efficaci per il piano fisico, però
--l'unico considerabile è I_n_squadre, che diminuisce leggermente il tempo di esecuzione in quanto
--permette lo scan dell'attributo presente nella clausola where



--Q2:	Determinare l’identificatore delle sfide relative a un gioco A di vostra scelta
--    (specificare direttamente l’identificatore nella richiesta) che, in alternativa:
--    hanno avuto luogo a gennaio 2021 e durata massima superiore a 2 ore, oppure
--    hanno avuto luogo a marzo 2021 e durata massima pari a 30 minuti.
SELECT idS
from sfida
where sfida.gioco = 111
and (((EXTRACT(MONTH FROM data_ora) = 01) and (EXTRACT(YEAR FROM data_ora) = 2021) and durata_max > '02:00:00')
	 or ((EXTRACT(MONTH FROM data_ora) = 03) and (EXTRACT(YEAR FROM data_ora) = 2021) and durata_max = '00:30:00'));
--inidici possibili:
	--indice I_sfida_g creato precedentemente [create index I_sfida_g on sfida (gioco)];
	--create index I_data_g on sfida(data_ora);
--quest'ultimo risulta poco utile, in quanto già presente il vincolo "sfida_data_ora_gioco_key" su tabella sfida che
--comporta un omoninmo indice in grado di scorrere data_ora al meglio.


--Q3:
--Determinare le sfide, di durata massima superiore a 2 ore, dei giochi che
--richiedono almeno due dadi (Restituire sia l’identificatore della sfida sia l’identificatore del gioco).
select idS, dado.gioco
from sfida
join gioco on sfida.gioco = gioco.idG
join dado on gioco.idG = dado.gioco
where durata_max > '02:00:00'
group by idS, dado.gioco
having count(dado.gioco) >= 2;
--inidici possibili:
	--create index I_durata_sfida on sfida (durata_max);
	--create index I_gioco_s on sfida (gioco);
	--create index I_dado_gioco on dado(gioco);

--gli indici si rivelano poco utili (sia clusterizzati che non clusterizzati) e pertanto
--abbiamo ritenuto necessario creare una vista materializzata anche in questo caso;
CREATE MATERIALIZED VIEW sfide_2h_2dadi AS
select idS, dado.gioco
from sfida
join gioco on sfida.gioco = gioco.idG
join dado on gioco.idG = dado.gioco
where durata_max > '02:00:00'
group by idS, dado.gioco
having count(dado.gioco) >= 2;

select * from sfide_2h_2dadi;







----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------- FUNZIONI -------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------


set search_path to "OCA";

--a)Funzione che realizza l’interrogazione 2c in maniera parametrica
--  rispettoall’ID del gioco (cioè determina le sfide che hanno
--  durata superiore alla durata medie delle sfide
--  di un dato gioco, prendendo come parametro l’ID del gioco);
CREATE or replace FUNCTION durata_maggiore_sfide_A (IN gioco_A integer)
returns table (Sfida_mag integer, gioco integer, Suadurata time) AS
$$
declare
  UnGioco integer;
BEGIN
  UnGioco:= (SELECT IdG FROM Gioco WHERE IdG = gioco_A);
  IF UnGioco is null
  then RAISE EXCEPTION 'il gioco con codice % non esiste', gioco_A;
  END IF;

  return query  select ids, sfida.gioco, sfida.durata
                from sfida
                where sfida.gioco= UnGioco
				        group by ids
                having sfida.durata > (select avg(sfida.durata)
                                    	from sfida
                                    	where sfida.gioco=UnGioco);
  If not found
  then RAISE EXCEPTION 'non sono mai state giocate sfide del gioco %', UnGioco;
  END IF;

  return;
END;
$$
LANGUAGE plpgsql;

--esempio di verifica della funzione:
--select * from durata_maggiore_sfide_A(106);


--b)Funzione di scelta dell’icona da parte di una squadra in una sfida:
--  possono essere scelte solo le icone corrispondenti al gioco
--  cui si riferisce la sfida che non siano già state scelte da altre squadre.
create or replace FUNCTION SceltaIcona(IN squadra_A integer, IN icona_A integer)
returns void as
$$
DECLARE
  Lasquadra integer;
  Laicona integer;
  Ilgioco integer;
  Ilset varchar(30);
BEGIN
  Lasquadra:= (select idSq from squadra where idSq=squadra_A);
  Laicona := (select idIcona from icona where idIcona=icona_A);
  Ilgioco:= (select gioco from sfida
             join squadra on sfida.idS= squadra.sfida
			 where idSq= Lasquadra);
  Ilset:= (select set_icone from gioco where idG = Ilgioco);

  if Lasquadra is null or Laicona is null
  then raise exception 'attenzione: parametri della funzione errati/inesistenti';
  end if;

  if Laicona not in (select idIcona from icona
                     join set_icone on set_icone.nome=icona.set_icone
                     where set_icone.nome = Ilset)
  then raise exception 'l icona inserita non appartiene al gioco al quale la squadra % sta giocando', Lasquadra;
  end if;

  if Laicona not in (select icona
                     from squadra
                     join sfida sf on squadra.sfida=sf.idS
                     where idSq!=Lasquadra and sf.gioco = Ilgioco)
  then update squadra
       set icona = Laicona where idSq= Lasquadra;
  else raise exception 'esiste già una squadra con la icona selezionata';
  end if;
  return;
END;
$$
language plpgsql;

--esempio di verifica della funzione:
--select * from squadra join sfida on squadra.sfida= sfida.ids where idsq=25;
--select SceltaIcona(25,20);

--interrogando sia prima che dopo la funzione, noteremo il cambio di icona nella squadra scelta.







----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------- TRIGGER -------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

--1) Verifica del vincolo che nessun utente possa partecipare a sfide contemporanee;
CREATE OR REPLACE FUNCTION sfida_unica()
returns trigger AS
$$
BEGIN
  if (select count(*)
      from appartiene
      join squadra on squadra.idSq=appartiene.squadra
      join sfida on squadra.sfida= sfida.idS
      where conclusa = false and appartiene.utente = new.utente) >1
  then RAISE exception 'un utente non può giocare più sfide contemporaneamente!';
	ELSE return new;
	END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER contemporanee
after INSERT OR UPDATE ON appartiene FOR EACH ROW
execute procedure sfida_unica();


--2)Mantenimento del punteggio corrente di ciascuna squadra in ogni sfida e inserimento delle
--  icone opportune nella casella podio.

--N.B. di default, ogni squadra inserita dovrebbe avere il punteggio totale uguale a 0, ed essere poi incrementato
--per l'appunto con l'inserimento dei turni. Nell'inserimento automatico con datanamic le squadre vengono inserite con
--un numero arbitrario, perciò la gestione dei turni la abbiamo resa più chiara con l'inserimento dei turni manuali
create or replace function aggiornamento_punti()
returns trigger AS
$$
DECLARE
  Lasquadra integer;
  Lasfida integer;
  Ilgioco integer;

  squadra1 integer;
  squadra2 integer;
  squadra3 integer;

  pos1 integer;
  pos2 integer;
  pos3 integer;

BEGIN
  lasquadra:= new.squadra;
  lasfida:= (select sfida from squadra
             where idSq=lasquadra);
  ilgioco:= (select gioco from sfida
             where sfida.ids= lasfida);

  update squadra
  set punteggio_tot= punteggio_tot + new.punteggio_preso
  where idSq = Lasquadra;

  update squadra
  set podio = null
  where squadra.sfida= Lasfida;

  squadra1:= (select idsq from squadra
              where sfida= lasfida
              order by punteggio_tot desc
              limit 1);
  squadra2:= (select idsq from squadra
              where sfida= lasfida
              order by punteggio_tot desc
              limit 1 offset 1);
  squadra3:= (select idsq from squadra
              where sfida= lasfida
              order by punteggio_tot desc
              limit 1 offset 2);

  pos1:= (select idpod from casella_podio
          where casella_podio.gioco = ilgioco and posizione = 1);
  pos2:= (select idpod from casella_podio
          where casella_podio.gioco = ilgioco and posizione = 2);
  pos3:= (select idpod from casella_podio
          where casella_podio.gioco = ilgioco and posizione = 3);

  update squadra
  set podio = pos1
  where idsq= squadra1;

  update squadra
  set podio = pos2
  where idsq= squadra2;

  update squadra
  set podio = pos3
  where idsq= squadra3;
  return  new;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER riposizione_per_turno
AFTER INSERT OR UPDATE ON turno FOR EACH ROW
WHEN (pg_trigger_depth() = 0)
EXECUTE PROCEDURE aggiornamento_punti();
