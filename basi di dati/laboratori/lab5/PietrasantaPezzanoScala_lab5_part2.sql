set search_path to banca;

--1:
insert into ContoCorrente values(0, 100);
insert into ContoCorrente values(5, 0);
INSERT INTO ContoCorrente VALUES (1,0);
INSERT INTO ContoCorrente VALUES (2,0);
INSERT INTO ContoCorrente VALUES (3,0);
INSERT INTO ContoCorrente VALUES (4,0);
--INSERT INTO ContoCorrente VALUES (5,10);
--L'inserimento soprastante non rispetta il vincolo di univocità
INSERT INTO ContoCorrente VALUES (6,0);
--Quante transazioni sono state eseguite?
	--sono state eseguite 7 transazioni
--Come avviene la verifica del vincolo di chiave primaria?
	--avviene implicitamente con la transazione

--2:
DELETE FROM ContoCorrente
where numero IN (1,2,3,4);

INSERT INTO ContoCorrente VALUES (1,0);
INSERT INTO ContoCorrente VALUES (2,0);
INSERT INTO ContoCorrente VALUES (3,0);
INSERT INTO ContoCorrente VALUES (4,0);
INSERT INTO ContoCorrente VALUES (5,10);
INSERT INTO ContoCorrente VALUES (6,0);
--viene fatta un'unica transazione
--Eseguendo gli insert assieme, dal momento in cui uno di essi fallisce (a causa del vincolo di 
-- univocità), viene bloccata la completa esecuzione del codice per la proprietà di atomicità e di 
-- conseguenza viene fatta un'azione di RollBack, tornando "all'istante" precedente all'esecuzione.


--3:
DELETE FROM ContoCorrente
where numero IN (1,2,3,4); 
BEGIN;
INSERT INTO ContoCorrente VALUES (1,0);
INSERT INTO ContoCorrente VALUES (2,0);
INSERT INTO ContoCorrente VALUES (3,0);
INSERT INTO ContoCorrente VALUES (4,0);
INSERT INTO ContoCorrente VALUES (5,10);
INSERT INTO ContoCorrente VALUES (6,0);
COMMIT;
--non vengono inserite tuple poiché esiste già una tupla con chiave 5
--viene nuovamente fatta una sola transazione

--4:
DELETE FROM ContoCorrente
where numero IN (1,2,3,4);

BEGIN;
INSERT INTO ContoCorrente VALUES (1,0);
INSERT INTO ContoCorrente VALUES (2,0);
INSERT INTO ContoCorrente VALUES (3,0);
INSERT INTO ContoCorrente VALUES (4,0);
COMMIT;
--questa volta il comando va a buon fine e vengono inserite 4 tuple
--poiché vengono rispettati tutti i vincoli

--5:
DELETE FROM ContoCorrente
where numero IN (1,2,3,4);

BEGIN;
INSERT INTO ContoCorrente VALUES (1,0);
INSERT INTO ContoCorrente VALUES (2,0);
INSERT INTO ContoCorrente VALUES (3,0);
INSERT INTO ContoCorrente VALUES (4,0);
ROLLBACK;
--l'operazione di per sé non genera errori, ma non vengono inserite tuple, in quanto
--il comando ROLLBACK ci riporta allo stato di partenza (prima dell'esecuzione)

--6:
DELETE FROM ContoCorrente
where numero IN (1,2,3,4);

BEGIN;
SET CONSTRAINTS ALL DEFERRED;
INSERT INTO ContoCorrente VALUES (1,0);
INSERT INTO ContoCorrente VALUES (2,0);
INSERT INTO ContoCorrente VALUES (3,0);
INSERT INTO ContoCorrente VALUES (4,0);
INSERT INTO ContoCorrente VALUES (5,10);
INSERT INTO ContoCorrente VALUES (6,0);
DELETE FROM ContoCorrente WHERE saldo>10;
COMMIT;
--non vengono inserite (né rimosse) tuple in quanto viene violato il vincolo di
--chiave primaria (esiste già una tupla con chiave primaria 5)





parte 2.2: sono 9-12 CFU:

--1) dopo l'esecuzione di t1, eseguendo t2 noto che va in loop, dato che attente il rilascio del lock ma, dopo la chiamata di commit in t1, t2 fa ROLLBACK in quanto aspettava dati che sono stati modificati;
non si genera anomalia poiché viene rispettato il livello REPEATABLE READ

--2)in questo caso viene aggiornato il campo secondo t2 in quanto, facendo t1 ROLLBACK, non viene considerato l'UPDATE da lui eseguito (non si genera anomalia);

--3)non viene modificato alcun valore in quanto il livello READ COMMITTED permette ad entrambe le transazioni di modificare il campo (non si generano anomalie);

--4) Inizialmente t1 acquisisce il lock e T2 aspetta, come indicato dal livello read committed. Appena t1 viene eseguita si genera un deadlock poichè t2 entra in conflitto con t1 a causa del rollback. La base dati viene modificata solo secondo t1.

