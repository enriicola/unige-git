--la creazione dell'indice univoco "prof_c" è fallita poiché la chiave (professore)=(15) è duplicata.

--6:
--ALTER TABLE Esami
--ADD CONSTRAINT range_voto CHECK ((voto between 18 and 30) or (voto = 33));
--non va a buon fine poiché alcune tuple lo violano,
--quindi droppo gli insufficienti, setto a 33 gli aventi lode e richiamo il vincolo ->
DELETE FROM Esami
WHERE Voto<18;
UPDATE Esami SET Voto = 33
WHERE Voto>30;

ALTER TABLE Esami
ADD CONSTRAINT range_voto CHECK ((voto between 18 and 30) or (voto = 33));
--adesso funziona correttamente


--parte 1.2:
--1:
insert into Professori  values (38, 'Prini', 'Gian Franco', 50000);
--Va a buon fine
insert into Professori  values (39, 'Bandini', 'Stefania');
--Va a buon fine, perchè lo stipendio consente un valore di default
--insert into Professori  values (40, 'Rosti');
--Non va a buon fine, perchè il nome non può essere null


--2:
UPDATE Professori
SET Stipendio=Stipendio+5000 where Stipendio<15000;

--3:
UPDATE Professori
SET Stipendio=Stipendio-(0.05*Stipendio)
where NOT EXISTS (select Relatore
				  from Studenti
				  where Professori.id=Relatore
				 );

--4:
UPDATE Professori
SET stipendio= (select avg(stipendio) media 
				from professori
				join Corsi on Corsi.professore= professori.id
				join CorsiDiLaurea on Corsi.CorsoDiLaurea= CorsiDiLaurea.id
				join Studenti on Studenti.relatore= professori.id
			    where corsidilaurea.Denominazione= 'Informatica') * 1.05
where professori.id in (select professori.id 
					from professori
					join Corsi on Corsi.professore= professori.id
					join CorsiDiLaurea on Corsi.CorsoDiLaurea= CorsiDiLaurea.id
					join Studenti on Studenti.relatore= professori.id
					where corsidilaurea.Denominazione= 'Informatica') ;

select * from professori
join Corsi on Corsi.professore= professori.id
join CorsiDiLaurea on Corsi.CorsoDiLaurea= CorsiDiLaurea.id
join Studenti on Studenti.relatore= professori.id
where corsidilaurea.Denominazione= 'Informatica' ;

--5:
ALTER TABLE Esami ALTER COLUMN Voto DROP NOT NULL;

INSERT INTO Corsi VALUES ('labinfo',9,'Laboratorio di Informatica',default,TRUE)

INSERT INTO Esami SELECT Matricola,'labinfo', CAST(NOW() as DATE), null
FROM Studenti WHERE Relatore IS NULL and CorsoDiLaurea=9;

UPDATE Esami 
SET Voto=(SELECT AVG(Voto)
		  FROM Esami E
		  WHERE Esami.Studente=E.Studente
		 )
WHERE Voto IS NULL AND Corso='labinfo';

--ALTER TABLE Esami
--ADD CONSTRAINT vnn CHECK (Voto IS NOT NULL);
--Non posso ripristinare il vincolo perché alcuni Studenti hanno come unica
--tupla esame relativa quella di labinfo e quindi il loro voto rimane null
--violando così il vincolo che vorrei ripristinare.


--6:
--Assegnare ai corsi che non hanno docente il docente che ha meno corsi attivi 
--assegnati e che (a parità di numero di corsi assegnati) precede gli altri in ordine 
--alfabetico.

UPDATE Corsi
SET Professore=(SELECT Professore
			    FROM Corsi
				join professori on corsi.professore=professori.id
				WHERE Cognome <= ALL(Select cognome
								  FROM Corsi
								  join professori PROF on corsi.professore=professori.id
								  group by cognome, professore HAVING COUNT(*)<= ALL((SELECT COUNT(*)
								    					  								FROM Corsi
														  								GROUP BY Professore)) )
				GROUP BY Professore HAVING COUNT(*)<=ALL (SELECT COUNT(*)
								    					  FROM Corsi
													  	  GROUP BY Professore)
			   )
WHERE Professore IS NULL;