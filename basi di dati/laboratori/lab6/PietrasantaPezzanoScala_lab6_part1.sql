--Abbiamo lavorato insieme su tutto il codice
set search_path to unicorsi;
set datestyle to "MDY";

--VISTE
--1:
create view StudentiNonInTesi as 
select Matricola, Cognome, Nome, Residenza, DataNascita, LuogoNascita, CorsoDiLaurea, Iscrizione
from Studenti
where Relatore IS NULL;

--2:
select *
from StudentiNonInTesi
where LuogoNascita='Genova' and Residenza='Genova'

--3:
DROP VIEW StudentiMate;
create view StudentiMate as 
select Matricola, Cognome, Nome, COUNT(Voto) as NEsami, AVG(Voto) as Media
from Studenti
INNER JOIN CorsiDiLaurea ON Studenti.CorsoDiLaurea=CorsiDiLaurea.id
LEFT OUTER JOIN Esami ON Esami.Studente=Studenti.Matricola
where Laurea IS NULL and CorsiDiLaurea.Denominazione='Matematica'
group by Matricola, Cognome, Nome;

--4:
select SUM(NEsami)
from StudentiMate;

--5:
--Abbiamo lavorato fino a qui nelle ore di laboratorio
create view Passati as
select Matricola, Nome, Cognome, MIN(Data) as Primo, MAX(Data) as Ultimo, COUNT(Voto) as NEsami, AVG(Voto) as Media
from Esami
INNER JOIN Studenti ON Studenti.Matricola=Esami.Studente
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
where Voto>=18 and CorsiDiLaurea.Denominazione='Informatica'
group by Matricola, Nome, Cognome;

create view NonPassati as
select Matricola, count(*) as NonPassati
from Esami
INNER JOIN Studenti ON Studenti.Matricola=Esami.Studente
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
where Voto<18 and CorsiDiLaurea.Denominazione='Informatica'
group by Matricola, Nome, Cognome;

create view StudentiInfo as
select Studenti.Matricola, Studenti.Nome, Studenti.Cognome, Primo, Ultimo,
        coalesce(Media,0) as Media, coalesce(NEsami,0) as NEsami, coalesce(NonPassati,0) as NonPassati
from Studenti
FULL OUTER JOIN Passati ON Studenti.Matricola=Passati.Matricola
FULL OUTER JOIN NonPassati on Studenti.Matricola=NonPassati.Matricola
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
WHERE CorsiDiLaurea.Denominazione='Informatica' and (NonPassati IS NOT NULL or Passati IS NOT NULL)
group by Studenti.Matricola, Studenti.Nome, Studenti.Cognome, Primo, Ultimo, NEsami, Media, NonPassati;

select * from StudentiInfo;


--6:
select pippo.Matricola, pippo.NEsami, pippo.Media
from StudentiInfo as pippo
where pippo.NonPassati<=0
group by pippo.Matricola, pippo.NEsami, pippo.Media
HAVING pippo.Media>=(select MAX(Media)
					 from StudentiInfo
					 where NEsami=pippo.NEsami
					);

--7:
---select Matricola as Studente1, Matricola as Studente2, Primo as primo1, Ultimo as ultimo1, Primo as primo2, Ultimo as ultimo2
--from StudentiInfo
--where NEsami>=2 and (primo1,ultimo1) OVERLAPS (primo2,ultimo2)
--order by primo1, primo2;

--8:
create table CorsiSenzaProf as
select *
from Corsi
where Professore is null;
--select * from CorsiSenzaProf;


--MODIFICHE
--1:
insert into StudentiNonInTesi VALUES ('hg768d', 'Pezzano', 'erio', 'Genova', '12/12/1989', 'Genova', 9, '2009');
--l'inserimento va a buon fine perchè quella view si riferisce ad un'unica relazione.
--Gli attributi mancanti vengono impostati come 'null' nella tabella Studenti.
--(Abbiamo lavorato fino a qui nelle ore di laboratorio)

--2.a:
INSERT INTO CorsiSenzaProf VALUES ('tpln1', 5, 'Topolino 1', 15, TRUE);
--select * from Corsi;
--L'inserimento va a buon fine, ma non viene inserito il corso nuovo nella tabella Corsi

--2.b: :/
create view CorsiSenzaProf2 as
select *
from Corsi
where Professore is null;
INSERT INTO CorsiSenzaProf2 VALUES ('tpln1', 5, 'Topolino 1', 15, TRUE);
select * from Corsi;
--L'inserimento va a buon fine in CorsiSenzaProf2, ma non compare nella vista, nonostante compaia nella tabella Corsi.

--2.c:
create view CorsiSenzaProf3 as
select *
from Corsi
where Professore is null
WITH CHECK OPTION;

INSERT INTO CorsiSenzaProf3 VALUES ('tpln1', 5, 'Topolino 1', 15, TRUE);
--L'inserimento non va a buon fine a causa della violazione del CHECK OPTION.

--3:
insert into StudentiMate VALUES ('fg472x', 'Duck', 'Duffy', 44, 19);
--L'inserimento non va a buon fine perchè non è possibile inserire nella vista "studentimate"; 
--le viste contenenti GROUP BY non sono aggiornabili automaticamente.
