----Abbiamo lavorato insieme su tutto il codice
set search_path to 'unicorsi';

--CREAZIONE DI ROUTINE E UTILIZZO DI CURSORI
--1:
create or replace function 
$$ 
BEGIN
   if(SELECT AVG(stipendio)
	  FROM professori JOIN corsi ON corsi.professore=professori.id
      WHERE corsi.attivato IS TRUE) < 15000
	then
		UPDATE Professori
		set Stipendio=Stipendio*1.1;
		raise notice 'lo stipendio è stato aumentato del 10 percento';
   else
   		UPDATE Professori
   		set Stipendio=Stipendio*1.05;
		raise notice 'lo stipendio è stato aumentato del 5 percento';
   END IF;
END;
$$ LANGUAGE plpgsql;

select increase();

select stipendio from professori;
--Abbiamo lavorato fino a qui nelle ore di laboratorio.

--2:
create or replace function increase_bis(IN soglia numeric(8,2)) returns numeric(8,2) as
$$
DECLARE 
	aumentiTOT numeric(8,2);
	stip_medi numeric (8,2);
BEGIN
	stip_medi := (SELECT AVG(professori.stipendio)
						   FROM professori JOIN corsi ON corsi.professore=professori.id
						   WHERE corsi.attivato IS TRUE);
   if(stip_medi< soglia)
	then
		 aumentiTOT:=  ((SELECT sum(professori.stipendio)
						   FROM professori JOIN corsi ON corsi.professore=professori.id
						   WHERE corsi.attivato IS TRUE) *0.1);
		UPDATE Professori
		set Stipendio=Stipendio*1.1;
		raise notice 'lo stipendio è stato aumentato del 10 percento';
   else
   		 aumentiTOT:= ((SELECT sum(professori.stipendio)
						   FROM professori JOIN corsi ON corsi.professore=professori.id
						   WHERE corsi.attivato IS TRUE) *0.05);
   		UPDATE Professori
   		set Stipendio=Stipendio*1.05;
		raise notice 'lo stipendio è stato aumentato del 5 percento';
   END IF;
   return aumentiTOT;
END;
$$ LANGUAGE plpgsql;

select increase_bis(100000);

select stipendio from professori
INNER JOIN corsi ON corsi.professore=professori.id
WHERE corsi.attivato IS TRUE
order by stipendio desc;


--ROUTINE CON PARAMETRI E GESTIONE DEGLI ERRORI
--2:
create or replace function NumLaureati (IN data_laurea DATE, IN cod_corso_laurea DECIMAL(3,0))
returns integer AS
$$
BEGIN
	if data_laurea> CURRENT_DATE
	then raise notice 'La data inserita non è valida';
		return -1;
	end if;
	if cod_corso_laurea not in (select id 
								from corsiDiLaurea)
	then raise notice 'Il corso inserito non esiste';
		return -1;
	end if;
	
	return (select count(*)
		   from studenti
		   inner join corsidilaurea on corsiDiLaurea.id=studenti.corsodilaurea
		   where laurea>data_laurea);
END;
$$ LANGUAGE plpgsql;

select NumLaureati(date '04/04/2022',16);

--UTILIZZO DI SQL DINAMICO
--1:
create or replace function datiInTab(IN tabella varchar(20)) returns INTEGER as
$$
DECLARE
	pippo numeric(4,0);
	ilcomando VARCHAR(120) := 'select count(*) FROM '|| tabella;
BEGIN
	execute ilcomando
	INTO pippo;
	return pippo;
end;
$$ LANGUAGE plpgsql;

select datiInTab('studenti');

--2:
create or replace function CreaVistaPR (IN vistaPR varchar(20), IN x numeric(8,2) )
returns void as
$$
begin
	execute 'create view '||vistaPR||' as
	select distinct professori.id, professori.cognome, professori.nome, professori.stipendio
	from professori
	inner join studenti on professori.id= studenti.relatore
	where stipendio > ' ||x;
end;
$$ LANGUAGE plpgsql;

select CreaVistaPR('vistaLaser',60000);
select * from vistalaser;

--CHIAMATE TRA FUNZIONI
--1:
create or replace function contorno_vista(IN x numeric(8,2)) returns void as
$$
declare
id_prof numeric(6);
Nome_prof VARCHAR(20);
Cognome_prof VARCHAR(20);
Stip NUMERIC(8,2);
cursore CURSOR FOR (select * from PRicchi);
begin
	perform CreaVistaPR('PRicchi',60000);
	raise notice 'id | nome | cognome | stipendio';
	open cursore;
	fetch cursore into id_prof, Nome_prof, cognome_prof, stip;
	while found LOOP
		begin
		raise notice '% | % | % | %', id_prof, Nome_prof, cognome_prof, stip;
		fetch cursore into id_prof, Nome_prof, cognome_prof, stip;
		end;
	end loop;

	drop view PRicchi;
end;
$$ LANGUAGE plpgsql;

select contorno_vista(60000);
--CREAZIONE DI TRIGGER
--1:
create or replace function controllo_prof() returns trigger as
$$
BEGIN
	if exists (select professori.id
	 		 from professori
			 inner join corsi on corsi.professore = professori.id
			 where corsi.attivato is true
			 group by professori.id
			 having count(corsi.attivato)>=5)
	then raise exception 'un professore non può avere piu di cinque corsi attivati';
	end if;
end;
$$
language plpgsql;

create trigger ControllaProf
Before INSERT or UPDATE ON Corsi
FOR EACH ROW
execute procedure controllo_prof();


--2:
Update corsi
set professore=1
where corsi.id='algo1';
--mi viene restiruito il messaggio d'errore impostato nella funzione;

--3:
update corsi
set professore=15
where professore in (select corsi.professore from corsi
					inner join corsidilaurea on corsi.corsodilaurea = corsidilaurea.id
					where attivato is false and corsidilaurea.denominazione = 'informatica');
update corsi
set professore=1
where professore in (select corsi.professore from corsi
					inner join corsidilaurea on corsi.corsodilaurea = corsidilaurea.id
					where attivato is false and corsidilaurea.denominazione = 'matematica');

update corsi
set attivato =true
where attivato is false;
--nuovamente mi viene sollevata l'eccezione circa il massimo di 5 corsi attivati per 
--ciascun professore;

--4:
drop trigger controllaprof on corsi;


--5:
create or replace function controllo_prof() returns trigger as
$$
BEGIN
	if exists (select professori.id
	 		 from professori
			 inner join corsi on corsi.professore = professori.id
			 where corsi.attivato is true
			 group by professori.id
			 having count(corsi.attivato)>=5)
	then raise notice 'un prof non può avere piu di cinque corsi attivati';
		 return NEW;
	end if;
end;
$$
language plpgsql;

create trigger ControllaProf
after INSERT or UPDATE ON Corsi
FOR EACH ROW
execute procedure controllo_prof();

--2:
update corsi
set attivato =true
where attivato is false;
--le tuple vengono modificate, e mi viene restituito per lo stesso numero di aggiornamenti (in
--questo caso 5) il messaggio di notifica circa il superamento del limite; nonostante ciò
-- però nulla della nostra modifica viene bloccato.

insert into professori values (40, 'Bagnasco', 'Luigi', 900);
--inserendo il professore con chiave 38 (o 39) abbiamo rotto il vincolo di univocità in
--quanto era già presente un professore con lo stesso id; l'inserimento con chiave 40 viene effettuato con successo, ma
--comunque in ogni caso viene riportato il messaggio di notifica circa il superamento del limite
--dei 5 corsi massimi attivi per professore;


