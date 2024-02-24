/*[...]Si richiede inoltre di definire i ruoli utente, giocatore, gameadmin, gamecreator individuando una
gerarchia tra di essi.
Assegnare ai ruoli sopra descritti i privilegi che ritenete ragionevoli nel dominio applicativo considerato, tenendo
in considerazione quanto specificato nella descrizione del dominio e il fatto che un game admin è colui che attiva
le sfide e approva i task e un game creator è colui che crea i giochi, motivando le scelte effettuate.*/

set search_path to "OCA";

--creazione del ruolo "utente" ed assegnazione privilegi
create role utente;
grant select on table utente to utente;
grant select on table squadra to utente;
grant select on table gioco to utente;

--creazione del ruolo "giocatore" ed assegnazione privilegi
create role giocatore;
grant utente to giocatore;
grant select on table appartiene to giocatore;
grant select on table sfida to giocatore;
grant select on table turno to giocatore;
grant select on table task to giocatore;
grant select on table quiz to giocatore;
grant insert on table consegna_task to giocatore;
grant insert on table risposta_quiz_utente to giocatore;

--creazione del ruolo "gameadmin" ed assegnazione privilegi
create role gameadmin;
grant giocatore to gameadmin;
grant all on table sfida to gameadmin;
grant all on table task to gameadmin;
grant all on table consegna_task to gameadmin;
grant select on all tables in schema "OCA" to gameadmin;


--creazione del ruolo "gamecreator" ed assegnazione privilegi
create role gamecreator;
grant gameadmin to gamecreator;
grant all on all tables IN schema "OCA" TO gamecreator WITH GRANT OPTION;


--Gerarchia mantenuta: gamecreator > gameadmin > giocatore > utente.
