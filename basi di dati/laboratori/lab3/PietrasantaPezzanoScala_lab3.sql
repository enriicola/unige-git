--Abbiamo lavorato insieme su tutto il codice

set search_path to unicorsi;
set datestyle to "MDY";

--OUTER JOIN
--1:
select Corsi.id, Corsi.Denominazione, Cognome, Nome
from Professori 
FULL OUTER JOIN Corsi ON Professori.id=Corsi.Professore
order by Denominazione;

--2:
select Professori.id, Professori.Cognome, Studenti.Matricola, Studenti.Cognome, Studenti.Nome
from Professori
FULL OUTER JOIN Studenti ON Professori.id=Studenti.Relatore
where Professori.id IS NOT NULL
order by Professori.id;

---- GG: perché Professori.id IS NOT NULL? così non togliete quelli che avete aggiunto con l'outer join

--3:
select Studenti.Cognome, Studenti.Nome, Professori.Cognome AS Relatore
from Studenti
FULL OUTER JOIN Professori ON Studenti.Relatore=Professori.id
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
where Studenti.Cognome IS NOT NULL and Denominazione='Matematica'
order by Studenti.Cognome;


--FUNZIONI DI GRUPPO
--1:
select MAX(Stipendio), MIN(Stipendio), AVG(Stipendio)
from Professori;

--2:
select MIN(Voto), AVG(Voto), MAX(Voto)
from Esami
INNER JOIN Corsi ON Corsi.id=Esami.Corso
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Corsi.CorsoDiLaurea
where CorsiDiLaurea.Denominazione='Informatica';

--3:
select Facolta, CorsiDiLaurea.Denominazione, MAX(Voto)
from Esami
INNER JOIN Corsi ON Corsi.id=Esami.Corso
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Corsi.CorsoDiLaurea
group by CorsiDiLaurea.Facolta, CorsiDiLaurea.Denominazione;

--4:
select Cognome, Nome, COUNT(*)
from Professori
INNER JOIN Corsi ON Corsi.Professore=Professori.id
where Corsi.Attivato=true
group by Cognome, Nome HAVING COUNT(*)>2
order by Cognome;

--5:
select Corsi.Denominazione
from Corsi
INNER JOIN CorsiDiLaurea ON Corsi.CorsoDiLaurea=CorsiDiLaurea.id
where CorsiDiLaurea.Denominazione='Informatica'
EXCEPT
select Corsi.Denominazione
from Corsi
INNER JOIN CorsiDiLaurea ON Corsi.CorsoDiLaurea=CorsiDiLaurea.id
INNER JOIN Esami ON Esami.Corso=Corsi.id
where CorsiDiLaurea.Denominazione='Informatica' and Data>'04/01/2012'
group by Corsi.Denominazione HAVING COUNT(*)>=5;

--6:
select Professori.Cognome, Professori.Nome, COUNT(*)
from Professori
INNER JOIN Studenti ON Studenti.Relatore=Professori.id
group by Professori.Cognome, Professori.Nome
order by Professori.Cognome;

--7:
select Professori.Cognome, Professori.Nome, COUNT(*)
from Professori
INNER JOIN Studenti ON Studenti.Relatore=Professori.id
group by Professori.Cognome, Professori.Nome
UNION
select Professori.Cognome, Professori.Nome, 0 as Count
from Professori
LEFT JOIN Studenti ON Studenti.Relatore=Professori.id
where Studenti.Relatore IS NULL
group by Professori.Cognome, Professori.Nome
order by Cognome;
--- GG: ok, ma bastava anche più sempicemente select Professori.Cognome, Professori.Nome, 0 as Count 
--- from Professori
--- where id NOT IN (SELECT Studenti.Relatore FROM Studenti)

--8:
select Studente as Matricola, EXTRACT(MONTH FROM Data) as Mese, EXTRACT(YEAR FROM Data) as Anno, AVG(Esami.Voto) as Media
from Esami
group by Matricola, Mese, Anno HAVING COUNT(*)>=2
order by Matricola;

--SOTTOINTERROGAZIONI SEMPLICI
--1:
select Denominazione
from CorsiDiLaurea
INNER JOIN Studenti ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
where Iscrizione=2010 
group by Denominazione HAVING COUNT(Matricola)<(select COUNT (Matricola)
										    	from Studenti
										   		INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
										   		where Iscrizione=2010 and Denominazione='Informatica'
										   	   );
											   
--1bis:
--includendo anche quelli che non hanno avuto iscritti...
select Denominazione
from CorsiDiLaurea
EXCEPT
select Denominazione
from CorsiDiLaurea
INNER JOIN Studenti ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
where Iscrizione=2010 
group by Denominazione HAVING COUNT(Matricola)>=(select COUNT (Matricola)
										    	from Studenti
										   		INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
										   		where Iscrizione=2010 and Denominazione='Informatica'
										   	   )
;

--2:
select Matricola
from CorsiDiLaurea
INNER JOIN Studenti ON CorsiDiLaurea.id=Studenti.CorsoDiLaurea
INNER JOIN Esami ON Studenti.Matricola=Esami.Studente
where CorsiDiLaurea.Denominazione='Informatica' and Voto=(select MAX(Voto)
														  from CorsiDiLaurea
														  INNER JOIN Corsi ON CorsiDiLaurea.id=Corsi.CorsoDiLaurea
														  INNER JOIN Esami ON Corsi.id=Esami.Corso
														  where CorsiDiLaurea.Denominazione='Informatica'
														 )
;

--3:
select Cognome, Nome
from Professori
INNER JOIN Corsi ON Professori.id=Corsi.Professore
INNER JOIN Esami ON Esami.Corso=Corsi.id
where Voto=(select MAX(Voto)
			from Corsi  
			INNER JOIN Esami ON Corsi.id=Esami.Corso
		   )
;

--- GG: esami non serve nella sottoquery


--4:
select Matricola
from Studenti
where Laurea<'11/01/2009' and CorsoDiLaurea=(select CorsiDiLaurea.id
											 from CorsiDiLaurea
											 where Denominazione='Informatica'
											)
;

--5:
select Matricola
from Studenti S
INNER JOIN CorsiDiLaurea ON S.CorsoDiLaurea=CorsiDiLaurea.id
INNER JOIN Esami ON Esami.Studente=S.Matricola
INNER JOIN Corsi ON Corsi.id=Esami.Corso
where CorsiDiLaurea.Denominazione='Informatica' and Esami.Data BETWEEN '06/01/2010' and '06/30/2010'
	  and Corsi.Denominazione='Basi Di Dati 1' and NOT EXISTS(select Matricola
															  from Studenti
													  		  INNER JOIN CorsiDiLaurea ON Studenti.CorsoDiLaurea=CorsiDiLaurea.id
															  INNER JOIN Esami ON Esami.Studente=Studenti.Matricola
															  INNER JOIN Corsi ON Corsi.id=Esami.Corso
															  where CorsiDiLaurea.Denominazione='Informatica' and Esami.Data BETWEEN '06/01/2010' and '06/30/2010'
															  and Corsi.Denominazione='Interfacce Grafiche' and Studenti.Matricola=S.Matricola
															 )
;

--6:
select Matricola
from Studenti S
INNER JOIN CorsiDiLaurea ON S.CorsoDiLaurea=CorsiDiLaurea.id
INNER JOIN Esami ON Esami.Studente=S.Matricola
INNER JOIN Corsi ON Corsi.id=Esami.Corso
where CorsiDiLaurea.Denominazione='Informatica' and Esami.Data BETWEEN '06/01/2010' and '06/30/2010'
	  and Corsi.Denominazione='Basi Di Dati 1' and EXISTS(select Matricola
															  from Studenti
													  		  INNER JOIN CorsiDiLaurea ON Studenti.CorsoDiLaurea=CorsiDiLaurea.id
															  INNER JOIN Esami ON Esami.Studente=Studenti.Matricola
															  INNER JOIN Corsi ON Corsi.id=Esami.Corso
															  where CorsiDiLaurea.Denominazione='Informatica' and Esami.Data BETWEEN '06/01/2010' and '06/30/2010'
															  and Corsi.Denominazione='Interfacce Grafiche' and Studenti.Matricola=S.Matricola
															 )
;


---GG: qui era intesa con IN e NOT IN, visto che avete usato qui EXISTS/NOT EXISTS usate nella quarta IN e NOT IN
