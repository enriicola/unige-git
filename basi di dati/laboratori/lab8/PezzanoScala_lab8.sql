----Abbiamo lavorato insieme su tutto il codice

--STRUTTURE DI MEMORIZZAZIONE
--1:
show data_directory;
	--Output: C:/Program Files/PostgreSQL/9.6/data

--2:
select datname, oid
from pg_database;
	--12401

--3:
select oid, nspname
from pg_namespace;
	--16482

--4:
select relname, relfilenode, relpages, reltuples
from pg_class
where relnamespace=16482;
	--professori: 16483, 2, 39
	--esami: 16532, 1, 105
	--corsi: 16497, 0, 0
	--corsidilaurea: 16490, 0, 0
	--studenti: 16515, 1, 64
	--pianidistudio: 16548 0, 0

--5:
--Sì, notiamo che alcune tabelle hanno il numero di tuple ed il numero di pagine del file, uguali a zero
analyze;
select relname, relfilenode, relpages, reltuples
from pg_class
where relnamespace=16482;
	--professori: 16483, 2, 40
	--esami: 16532, 1, 81
	--corsi: 16497, 1, 38
	--corsidilaurea: 16490, 1, 23
	--studenti: 16515, 1, 64
	--pianidistudio: 16548, 1, 26
--Il risultato è cambiato, in quanto abbiamo eseguito il comando ANALYZE che aggiorna manualmente le statistiche di sistema e ci permette
--di analizzare il piano di esecuzione aggiornato

--6:
set search_path to 'unicorsi';
select pg_relation_filepath('professori');
--Il valore restituito come output (base/12401/16483) rappresenta il percorso realativo alle tuple della tabella professori(oid = 16483)

--7:
--C:\Program Files\PostgreSQL\9.6\data\base\12401\16483
--Il file corrispondente al percorso soprastante contiene i dati dei professori registrati in 'unicorsi'.


--CREAZIONE INDICI
--1:
select relname, relfilenode, relpages, reltuples, relhasindex
from pg_class
where relnamespace=16482 and relhasindex=false;
	--per tutte le nostre tabelle è gia presente un indice, e questo è visibile grazie all'attributo "relhasindex"
--2:
select *
from pg_index
join pg_class on pg_index.indexrelid=pg_class.oid
where relnamespace=16482;
	--selezionare tutto il contenuto delle tabelle può risultare superfluo, ma otteniamo tutti i dati relativi agli indici presenti legati 
	--allo schema unicorsi e quindi alle rispettive tabelle: possiamo vedere il loro id e le rispettive proprietà, ad esmepio se sono unici,
	--primari, validi, etc.


--3:
create index ind_secondario
ON esami(voto);

select *
from pg_index
join pg_class on pg_index.indexrelid=pg_class.oid
where relnamespace=16482;
	--è stato creato con successo, ed il numero di indici è incrementato: il nuovo indice ha indexrelid = 16805 ed indrelid=16532(esami),
	--non è unico in quanto secondario, di conseguenza non è (ovviamente) primario

--4:
create index ind_hash_secondario
ON studenti
using hash(iscrizione);

select *
from pg_index
join pg_class on pg_index.indexrelid=pg_class.oid
where relnamespace=16482;
	--nuovamente è stato aggiunto un indice, e questa volta il suo valore di indexrelid è 16806 e il suo valore di indrelid è 16532(studenti).
	--notiamo di particolare che per questo indice abbiamo, a differenza dei precedenti, relpages = 4 e relam = 405.
--7:
create index ind_clusterizzato
ON studenti(corsodilaurea);
cluster studenti 
USING ind_clusterizzato;

select *
from pg_index
join pg_class on pg_index.indexrelid=pg_class.oid
where relnamespace=16482;
	--è stato inserito un indice clusterizzato, che difatti risulta essere l'unico dell'elenco.

--ELABORAZIONE DI INTERROGAZIONI
--1:
	--abbiamo svolto precedentemente questo passaggio, creando lo schema e l'istanza tramite lo script fornito.
	set search_path to 'unicorsilarge';
--2:
	SELECT nspname, oid
	FROM pg_namespace
	WHERE nspname = 'unicorsilarge';
		--16680
	SELECT relname, relfilenode, relpages, reltuples 
	FROM pg_class
	WHERE relnamespace = 16680;
		--professori: 16681, 15, 2000
		--esami: 16730, 883, 120000
		--corsi: 16695, 17, 2000
		--corsidilaurea: 16688, 1, 23
		--studenti: 16713, 715, 60000
		--pianidistudio: 16746, 383, 60000
	SELECT SUM(relpages)
	FROM pg_class
	WHERE relnamespace = 16680 and relname not like '%key%';
	--le tabelle vengono memorizzate in 2014 blocchi; 
	
	SELECT SUM(reltuples)
	FROM pg_class
	WHERE relnamespace = 16680  and relname not like '%key%';
	--le tuple totali sono 244023;
	
	SELECT COUNT(relhasindex)
	FROM pg_class
	WHERE relnamespace = 16680 AND relhasindex = TRUE  and relname not like '%key%';
	--sono presenti indici in tute e 6 le tabelle;

--ACCESSO A RELAZIONI DI BASE E SELEZIONE
--1:
	select *
	from esami;
	--tramite il comando di "explain analyze" otteniamo i seguenti dati:
			--abbiamo scandito 120000 tuple "dall'alto verso il basso";
			--planning time: 0.125;
			--execution time: 13.906;
			--l'unico nodo presente è l'operazione di scan sequenziale sulla tabella (che quindi è anche l'unico operatore fisico);
--2:
	select *
	from esami
	where voto >18;
		--tramite il comando di "explain analyze" otteniamo i seguenti dati:
			--abbiamo scandito 52486 tuple, in quanto le restanti sono state filtrate;
			--planning time: 0.134
			--execution time: 35.573
			--abbiamo ancora un unico nodo nel piano scelto dal sistema.
--3:
	create index ind_voto
	on esami(voto);
	
	select *
	from esami
	where voto >18;
		--notiamo che il sistema sceglie lo stesso piano di esecuzione e non utilizza l'indice, di conseguenza il tempo di esecuzione rimane quasi
		--invariato e gli operatori fisici restano gli stessi
			--planning time: 0.105;
			--execution time: 33.38;
--4:
	select *
	from esami
	where voto >29;
		--questa volta abbiamo due nodi, quindi il sistema ha scelto un piano di esecuzione differente che includesse l'indice creato;
		--il tempo di esecuzione è notevolmente diminuito, grazie all'utilizzo dell'indice che prende quasi istantaeamente le 11250 tuple da restituire;
		--planning time: 0.204;
		--execution time: 5.811;

--ACCESSO A RELAZIONI DI BASE E PROIZIONE
--1:
	select studente, voto
	from esami;
		--come ai primi punti precedenti, è stato scelto un piano di esecuzione con un solo nodo, che è la scansione sequenziale;
		--planning time: 0.06;
		--execution time: 20.151;
--PRODOTTO CARTESIANO E JOIN
--1:
	select * from esami, studenti
	limit 60000;
		--i nodi adesso sono 5: il limite, il join, la scansione su studenti, la materializzazione, la scansione su esami;
		--ovviamente l'interrogazione ha richiesto più tempo per essere eseguita, nonostante il limite imposto:
		--planning time: 0.353;
		--execution time: 95.648;
		
--2:
	select * from esami
	join studenti on studenti.matricola=esami.studente;
	--i nodi del piano scelto dal sistema sono 4: la scansione su esami, la scansione su studenti, l'hash inner join e l'hashing delle tuple;
	--l'operazione ha richiesto molto più tempo delle precedenti;
	--planning time: 1.087;
	--execution time: 168.209;
--3:
	CREATE INDEX ind_matricola ON Studenti(matricola);
	CREATE INDEX ind_studente ON Esami(studente);
	
	select * from esami
	join studenti on studenti.matricola=esami.studente;
		--anche con l'inserimento degli indici il comportamento è lo stesso ed il sistema sceglie sempre lo stesso piano;
		--planning time: 0.452;
		--execution time: 146.281;
	
	set enable_hashjoin = off;
	
	select * from esami
	join studenti on studenti.matricola=esami.studente;
		--ora che abbiamo disabilitato l'hash join, il piano scelto dal sistema include gli indici creati precedentemente, ed ora include
		-- solamente 3 nodi: merge inner join, indice su studenti(ind_matricola), indice su esami(ind_studente);
		--i tempi non sono cambiati significativamente, anche se sono leggermente superiori;
		--planning time: 0.63;
		--execution time: 170.545;
		
		