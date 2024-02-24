----Abbiamo lavorato insieme su tutto il codice
--set search_path to 'unicorsi';
--1:
set search_path to 'information_schema';
select * from table_privileges
where table_schema='unicorsi';

--2:
create user yoda password 'yoda';
create user luke password 'luke';
--La creazione ed il passaggio di utente sono stati compiuti senza problemi.

--3:
create view StudentiNonInTesi as 
select Matricola, Cognome, Nome, Residenza, DataNascita, LuogoNascita, CorsoDiLaurea, Iscrizione
from Studenti
where Relatore IS NULL;
--Eseguendo l'interrogazione soprastante, notiamo che non va a buon fine, perché l'utente yoda'
--non è in grado di vedere la tabella Studenti, dato che non dispone dell'autorizzazione necessaria.

--4:
set search_path to 'information_schema';
select * from table_privileges;
--Non è presente l'utente 'yoda', siccome non possiede privilegi associati.

--Abbiamo lavorato fino a qui nelle ore di laboratorio
--5:
GRANT USAGE ON SCHEMA unicorsi to yoda WITH GRANT OPTION;
GRANT SELECT ON unicorsi.Professori, unicorsi.Studenti, unicorsi.Esami TO yoda;
GRANT SELECT ON unicorsi.CorsiDiLaurea, unicorsi.Corsi to yoda WITH GRANT OPTION;

--6:
SET ROLE yoda;

--7: (punto 3, parte1)
--DROP VIEW StudentiMate;
create view StudentiMate as 
select Matricola, Cognome, Nome, COUNT(Voto) as NEsami, AVG(Voto) as Media
from Studenti
INNER JOIN CorsiDiLaurea ON Studenti.CorsoDiLaurea=CorsiDiLaurea.id
LEFT OUTER JOIN Esami ON Esami.Studente=Studenti.Matricola
where Laurea IS NULL and CorsiDiLaurea.Denominazione='Matematica'
group by Matricola, Cognome, Nome;
--Ci viene negato il permesso per l'esecuzione dell'operazione, poiché, in questo momento,
--stiamo agendo come utente yoda, nonostante la connessione al server sia tramite l'utente'postgres'

--8:
set search_path to 'information_schema';
select * 
from table_privileges
where grantee='yoda';
--Il punto 8 ci conferma quanto scritto nel punto 7: mancano i permessi necessari.

--9:
GRANT SELECT ON unicorsi.Studenti to luke;
--Non possiamo concedere a luke il privilegio, perché non abbiamo concesso la delegabilità del permesso su Studenti.

--10:
GRANT SELECT ON unicorsi.Corsi to luke;
--Questa volta possiamo concedere il privilegio, dato che il permesso sulla tabella scelta è delegabile.

--11:
SET ROLE postgres;

--12:
REVOKE SELECT ON unicorsi.Corsi from yoda RESTRICT;
--Non possiamo revocarlo con RESTRICT perché luke possiede il medesimo privilegio, dipendente da quello di yoda.

--13:
set search_path to 'information_schema';
select * 
from table_privileges
where grantor='yoda';
--Il risultato della query soprastante ci conferma quanto successo nel punto 12 (yoda, a sua volta, aveva consesso il privilegio a luke).

--14:
REVOKE SELECT ON unicorsi.Corsi from yoda CASCADE;
--Utilizzando CASCADE invece di RESTRICT, rimuoviamo il privilegio sia da yoda che da luke.

--15:
set search_path to 'information_schema';
select * 
from table_privileges
where table_schema='unicorsi' and table_name='Corsi';
--Come conferma del punto 14, eseguendo l'interrogazione soprastante, notiamo che non
--ci sono più priviliegi (associati a luke e yoda) sulla tabella Corsi.

--16:
GRANT CREATE ON SCHEMA unicorsi TO yoda;
SET ROLE yoda;

create view StudentiMatematica as 
select Matricola, Cognome, Nome, COUNT(Voto) as NEsami, AVG(Voto) as Media
from Studenti
INNER JOIN CorsiDiLaurea ON Studenti.CorsoDiLaurea=CorsiDiLaurea.id
LEFT OUTER JOIN Esami ON Esami.Studente=Studenti.Matricola
where Laurea IS NULL and CorsiDiLaurea.Denominazione='Matematica'
group by Matricola, Cognome, Nome;
--Abbiamo scelto una vista che opera su più tabelle ed intendiamo concedere a luke tutti i privilegi necessari per poterci interagire.
GRANT ALL PRIVILEGES ON StudentiMatematica TO luke;
--Abbiamo concesso a luke i permessi necessari per interagire con la vista.