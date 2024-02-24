--Abbiamo lavorato insieme su tutto il codice

set search_path to unicorsi;
set datestyle to "MDY";

--1:
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


--2:
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
--2bis:
select DISTINCT E1.Studente
from Esami E1
INNER JOIN Esami E2 ON E1.Studente=E2.Studente
INNER JOIN Studenti ON E2.Studente=Studenti.Matricola
INNER JOIN Corsi C1 ON C1.id=E1.Corso
INNER JOIN Corsi C2 ON C2.id=E2.Corso
INNER JOIN CorsiDiLaurea ON Studenti.CorsoDiLaurea=CorsiDiLaurea.id
where CorsiDiLaurea.Denominazione='Informatica' and E1.Data BETWEEN '06/01/2010' and '06/30/2010'
	and E2.Data BETWEEN '06/01/2010' and '06/30/2010' and C1.Denominazione='Basi Di Dati 1' and C2.Denominazione='Interfacce Grafiche';


--3:
select Matricola
from Studenti S
INNER JOIN CorsiDiLaurea ON S.CorsoDiLaurea=CorsiDiLaurea.id
INNER JOIN Esami ON Esami.Studente=S.Matricola 
where CorsiDiLaurea.Denominazione='Informatica'
group by S.Matricola HAVING AVG(Voto)>=(select MAX(Media)
										from (select AVG(Voto) as Media
											  from Studenti
											  INNER JOIN CorsiDiLaurea ON Studenti.CorsoDiLaurea=CorsiDiLaurea.id
											  INNER JOIN Esami ON Esami.Studente=Studenti.Matricola
											  where CorsiDiLaurea.Denominazione='Informatica'
											  group by Matricola
											 ) as MediaMax
									   )
;

--4:
select DISTINCT Matricola
from Studenti S
INNER JOIN CorsiDiLaurea ON S.CorsoDiLaurea=CorsiDiLaurea.id
INNER JOIN Esami ON Esami.Studente=S.Matricola
INNER JOIN Corsi ON Corsi.id=Esami.Corso
where CorsiDiLaurea.Denominazione='Informatica' and Corsi.Denominazione='Basi Di Dati 1'
and Voto>(select AVG(Voto)
		  from Studenti S									
		  INNER JOIN CorsiDiLaurea ON S.CorsoDiLaurea=CorsiDiLaurea.id
		  INNER JOIN Esami ON Esami.Studente=S.Matricola
		  INNER JOIN Corsi ON Corsi.id=Esami.Corso
		  where CorsiDiLaurea.Denominazione='Informatica' and Corsi.Denominazione='Basi Di Dati 1'
		 )
; --- GG: qui erano tutti i voti di BD1, indipendentemente dal fatto che lo studente fosse o meno di informatica


--5:
select Corsi.Denominazione, MIN(Voto), AVG(Voto), MAX(Voto), COUNT(Esami.*)
from Corsi 
INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Corsi.CorsoDiLaurea
INNER JOIN Esami ON Esami.Corso=Corsi.id
where CorsiDiLaurea.Denominazione='Informatica' and Corsi.Denominazione IN(select Corsi.Denominazione
																		   from Corsi
																		   INNER JOIN CorsiDiLaurea ON CorsiDiLaurea.id=Corsi.CorsoDiLaurea
																		   INNER JOIN Esami ON Esami.Corso=Corsi.id
																		   where CorsiDiLaurea.Denominazione='Informatica' and Esami.Voto>27
																		   group by Corsi.Denominazione HAVING COUNT(Esami.*)>=2
																		  )
group by Corsi.Denominazione;


--6:
select DISTINCT Cognome, Nome, Professori.id
from Professori
INNER JOIN Corsi ON Corsi.Professore=Professori.id
INNER JOIN Esami ON Esami.Corso=Corsi.id
where Esami.Corso IN (select Esami.Corso
					  from Esami
					  INNER JOIN Corsi ON Esami.Corso=Corsi.id
					  group by Esami.Corso HAVING AVG(Voto)>=(select MAX(Media)
															  from (select AVG(Voto) as Media
																    from Esami
																    INNER JOIN Corsi ON Esami.Corso=Corsi.id
																    group by Esami.Corso
																   ) as MediaMax
														     )
					 )
;
---GG: poteva essere molto più compatta es.
-- select cognome, nome, professori.id
-- from professori join corsi on professore=professori.id join esami on corsi.id = esami.corso
-- group by corso, cognome, nome, professori.id
-- having avg(voto) >= all (select avg(voto) 
-- from esami
-- group by corso)
--- a cosa serve esami nell'ultima sottoquery?



--7:
select DISTINCT Corsi.Denominazione, Corsi.CorsoDiLaurea
from Corsi
INNER JOIN Esami ON Esami.Corso=Corsi.id
where Esami.Corso IN (select Corso
 				      from Esami
				  	  where Voto<18
				   	  group by Corso HAVING COUNT(*)>=(select MAX(Conto)
													   from (select COUNT(*) as Conto
															 from Esami
															 where Voto<18
													   		 group by Corso
															) as MaxConto
								 				      )
				     )
;

--8:
select Cognome, Nome, COUNT(*) as NumeroCorsi
from Professori
INNER JOIN Corsi ON Corsi.Professore=Professori.id
group by Cognome, Nome, Professori.id 
HAVING COUNT(*)=(select MAX(NCorsi)
				 from (select COUNT(*) as NCorsi
					   from Corsi
				   	   group by Corsi.Professore
					  ) as MaxCorsi
				) 
;

--9:
select DISTINCT Co.id, Co.Denominazione
from Corsi Co
INNER JOIN Professori ON Co.Professore=Professori.id
INNER JOIN Studenti ON Studenti.Relatore=Professori.id
where Studenti.CorsoDiLaurea NOT IN (select Corsi.CorsoDiLaurea
									 from Studenti
									 INNER JOIN Professori Prof ON Studenti.Relatore=Professori.id
									 INNER JOIN Corsi ON Corsi.Professore=Professori.id
									 where Professori.id=Prof.id and Corsi.id=Co.id
									)
;
---GG: ricontrollare, quello dovrebbe essere il corso di laurea dei corsi del professore, perché serve Studenti nella sottoquery?

--10:
--DROP TABLE tempor;
CREATE TEMPORARY TABLE tempor
(
	Sessione integer primary key,
	Provati integer,
	Passati integer default 0
);
insert into tempor (select EXTRACT(MONTH FROM Data), COUNT(*)
				   from Esami
				   group by EXTRACT(MONTH FROM Data)
				   order by EXTRACT(MONTH FROM Data));


update tempor
set passati = (select COUNT(*)
				 from Esami
				 where Voto<18 and sessione= EXTRACT(MONTH FROM Data)
				 group by EXTRACT(MONTH FROM Data)
				 order by EXTRACT(MONTH FROM Data)
			);
			
select sessione, CAST(Passati*100 as FLOAT)/CAST(Provati as FLOAT) as Percentuale
from tempor
where passati is not NULL;


--11:
select Studente, Co.Denominazione, Esami.Voto
from Esami
INNER JOIN Corsi Co ON Co.id=Esami.Corso
where Esami.Voto<(select AVG(Voto)
				  from Esami
				  group by Esami.Corso HAVING Esami.Corso=Co.id
				  )
;

--12:
select Co.Denominazione, Cognome, Nome, Esami.Voto
from Studenti
INNER JOIN Esami ON Esami.Studente=Studenti.Matricola
INNER JOIN Corsi Co ON Co.id=Esami.Corso
where Esami.Voto<(select AVG(Voto)
				  from Esami
				  group by Esami.Corso HAVING Esami.Corso=Co.id
				  )
;

--13:
select Professori.Nome, Professori.Cognome, Corsi.id
from Corsi
INNER JOIN Professori ON Professori.id=Corsi.Professore
INNER JOIN Esami ON Esami.Corso=Corsi.id
where Corsi.Attivato=true
group by Professori.id, Professori.Nome, Professori.Cognome, Corsi.id
HAVING AVG(Voto)>(select AVG(Voto)
				  from Corsi
				  INNER JOIN Professori Prof ON Prof.id=Corsi.Professore
				  INNER JOIN Esami ON Esami.Corso=Corsi.id
				  where Professori.id=Prof.id
				  group by Prof.id
				 )
;

--14:
select Professori.Nome, Professori.Cognome, Studenti.Nome, Studenti.Cognome
from Studenti
INNER JOIN Professori ON Professori.id=Studenti.Relatore
INNER JOIN Esami ON Esami.Studente=Studenti.Matricola
group by Professori.id, Professori.Nome, Professori.Cognome, Studenti.Nome, Studenti.Cognome
HAVING AVG(Voto)>=(select MAX(Media)
				   from(select AVG(Voto) as Media
						from Esami
						INNER JOIN Studenti S ON S.Matricola=Esami.Studente
						where S.Relatore=Professori.id
						group by Esami.Studente
					   ) as MediaMax
				  )
order by Professori.Cognome;

--15:
select Matricola
from Studenti
INNER JOIN Esami ON Esami.Studente=Studenti.Matricola
where Relatore IS NULL and Voto>=18
group by Matricola HAVING COUNT(*)>=(select COUNT(*)
									 from Corsi
									 where Corsi.CorsoDiLaurea=Studenti.CorsoDiLaurea
									)
order by Matricola;

