--Abbiamo lavorato insieme su tutto il codice

set search_path to unicorsi;

--INTERROGAZIONI SU SINGOLA RELAZIONE
--1:
select Matricola from Studenti
where Cognome='Rossi' and Nome='Mario' and Iscrizione=2009;

--2:
select distinct Residenza from Studenti
order by Residenza ASC;

--3:
select Matricola, Cognome, Nome from Studenti
where Iscrizione<2007 and Relatore=NULL;

--4:
select DISTINCT Studente from Esami
where Data>'2/2/2009';

--5:
select Professori.id from Professori
where Nome LIKE '%te%' and Stipendio BETWEEN 12500 and 16000;

--6:
select Denominazione, Facolta from CorsiDiLaurea
where Attivazione<'2007' or Attivazione>'2010'
order by Facolta;

--7:
select Matricola, Cognome, Nome from Studenti
where Residenza IN('Genova', 'La Spezia', 'Savona') or 
Cognome NOT IN('Serra', 'Melogno', 'Giunchi')
order by Matricola DESC;

--INTERROGAZIONI CHE COINVOLGONO PIU' RELAZIONI
--1:
select Matricola from Studenti
INNER JOIN CorsiDiLaurea ON Studenti.CorsoDiLaurea=CorsiDiLaurea.Id 
where Laurea<'11/1/2009' and Facolta='Informatica';

--2:
select Cognome, Nome, Denominazione, Corsi.id from Professori
INNER JOIN Corsi ON Professori.Id=Corsi.Professore
order by Corsi.Id DESC;

--3:
select Denominazione, CorsoDiLaurea, Cognome from Corsi
INNER JOIN Professori ON Professori.Id=Corsi.Professore
where Attivato=true
order by CorsoDiLaurea;

--4:
select Studenti.Cognome, Studenti.Nome, Professori.Cognome as Relatore from Studenti
INNER JOIN Professori ON Studenti.Relatore=Professori.id
order by Studenti.Cognome, Studenti.Nome;

--5:
select * from Corsi
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Corsi.CorsoDiLaurea
where Attivato=true and CorsiDiLaurea.Denominazione='Informatica'
and Corsi.Denominazione LIKE '__s%';

--6:
select Matricola from Studenti
INNER JOIN Esami ON Studenti.Matricola=Esami.Studente
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
INNER JOIN Corsi ON Esami.Corso=Corsi.id
where CorsiDiLaurea.Denominazione='Matematica' and Corsi.Denominazione='Informatica Generale'
and Esami.Voto>=18 and Esami.Data='15/2/2012';

--7:
select DISTINCT Cognome, Nome from Studenti
INNER JOIN PianiDiStudio ON Studenti.Matricola=PianiDiStudio.Studente
where Anno=5 and AnnoAccademico='2011' and Studenti.Relatore IS NOT NULL
order by Cognome DESC;

--OPERAZIONI INSIEMISTICHE

--1:
select Nome,Cognome from Studenti
UNION
select Nome,Cognome from Professori;

--2:
select Nome,Cognome, 'Studente' as Qualifica from Studenti
UNION
select Nome,Cognome, 'Professore' as Qualifica from Professori;

--3:
select Nome, Cognome from professori
intersect
select Nome, Cognome from studenti;

--4:
select Cognome, Nome from Studenti
EXCEPT 
select Cognome, Nome from Professori;

--5:
select Matricola from Studenti
INNER JOIN Esami ON Studenti.Matricola=Esami.Studente
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
INNER JOIN Corsi ON Esami.Corso=Corsi.id
where CorsiDiLaurea.Denominazione='Informatica' and Corsi.Denominazione='Basi Di Dati 1' 
and Esami.Voto>=18 and esami.data between '01/06/2010' and '30/06/2010'
except
select Matricola from Studenti
INNER JOIN Esami ON Studenti.Matricola=Esami.Studente
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
INNER JOIN Corsi ON Esami.Corso=Corsi.id
where CorsiDiLaurea.Denominazione='Informatica' and Corsi.Denominazione='Interfacce Grafiche'
and Esami.Voto>=18 and esami.data between '01/06/2010' and '30/06/2010';

--6:
select Matricola from Studenti
INNER JOIN Esami ON Studenti.Matricola=Esami.Studente
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
INNER JOIN Corsi ON Esami.Corso=Corsi.id
where CorsiDiLaurea.Denominazione='Informatica' and Corsi.Denominazione='Basi Di Dati 1' 
and Esami.Voto>=18 and esami.data between '01/06/2010' and '30/06/2010'
intersect
select Matricola from Studenti
INNER JOIN Esami ON Studenti.Matricola=Esami.Studente
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
INNER JOIN Corsi ON Esami.Corso=Corsi.id
where CorsiDiLaurea.Denominazione='Informatica' and Corsi.Denominazione='Interfacce Grafiche'
and Esami.Voto>=18 and esami.data between '01/06/2010' and '30/06/2010';