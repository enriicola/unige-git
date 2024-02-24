package easycoin.store;

//import com.sun.org.apache.bcel.internal.generic.IINC;
import easycoin.datatype.*;
import java.util.*;
import easycoin.datatype.criterio.*;
import easycoin.datatype.operazione.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import easycoin.enumeration.*;
import easycoin.temporary_store.ParteSelezionata;

public class InfoStore{
    
    private Info dati;
    private Connection conn;
    private Id id_max;
   
    public InfoStore(){}
    
    public void RecuperaDati(){/*Recupera i dati*/
        Info i=new Info();
        this.Connessione("EasyCoin","Gruppo3","ciao");
        this.id_max=this.Ricerca_max_Id();
        i.setEnteEmettitoreH(getEntiEmettitori());
        i.setZeccaH(getZecche());
        i.setSistemaMonetarioH(getSistemiMonetari());
        i.setUnitaH(getUnita());
        i.setEmissioneH(getEmissioni());
        i.setMonetaH(getMonete());
        i.setTipoH(getTipiMoneta());
        i.setId(id_max);
        this.dati=i;    
    }
    
    
    public void applicaOp(Operazione op){
        
        if(op instanceof IEnte){
            IEnte IE;
            IE=(IEnte)op;/*in zecca e sistema mon passero � con campi id ee nulli, unita' lo passo pieno*/
           try{
            conn.createStatement().execute("INSERT INTO ENTEEMETTITORE VALUES("
                    +IE.getId().getId() + ",'"
                    +IE.getEnte().getNome()+"','"
                    +IE.getEnte().getNomeOriginale()+"','"
                    +IE.getEnte().getAreaGeografica()+"','"
                    +IE.getEnte().getDataInizio().toString()+"','"
                    +IE.getEnte().getDataFine().toString()+"','"
                    +IE.getEnte().getNote()+ "')");
             }catch(SQLException ex){ex.printStackTrace();}
            
            for (Enumeration zecca = IE.getZecche().elements();zecca.hasMoreElements(); ){         
                Zecca Z = (Zecca)zecca.nextElement();
                try{
                    conn.createStatement().execute("INSERT INTO ZECCA VALUES("
                    +Z.getId().getId() + ",'"
                    +Z.getInfoZ().getSigla() +"','"
                    +Z.getInfoZ().getDescrizione()+"','"
                    +IE.getId().getId()+ "')");
              }catch(SQLException ex){ex.printStackTrace();}
            
            }
            for (Enumeration sm = IE.getSistemiMonetari().elements();sm.hasMoreElements(); ){         
                SistemaMonetario S = (SistemaMonetario)sm.nextElement();
     
                try{
                    conn.createStatement().execute("INSERT INTO SISTEMAMONETARIO VALUES("
                    + S.getId().getId()+ ",'"
                    +IE.getId().getId()+"','"
                    +S.getInfoSM().getNome()+"','"
                    +S.getInfoSM().getNomeOriginale()+ "')");
              }catch(SQLException ex){ex.printStackTrace();}
            }
              for (Enumeration u = IE.getUnita().elements();u.hasMoreElements(); ){         
                    Unita IU = (Unita)u.nextElement();
                 try{
                    conn.createStatement().execute("INSERT INTO UNITA VALUES("
                    +IU.getId().getId()+ ",'"
                    +IU.getSistemaMonetario().getId()+"','"
                    +IU.getInfoU().getNome()+"','"
                    +IU.getInfoU().getNomeOriginale()+"','"
                    +IU.getInfoU().getFattoreMonteplicita()+ "')");
              }catch(SQLException ex){ex.printStackTrace();}
  
                
              }
            
            
            
        }else if(op instanceof ITipo){            
            ITipo IT;
            IT=(ITipo)op;
            
            try{
                conn.createStatement().execute("INSERT INTO TIPO VALUES("
                +IT.getId().getId()+ ",'"
                +IT.getUnita().getId()+"','"
                +IT.getEnte().getId()+"','"
                +IT.getTipo().getVnom().getParteIntera()+"','"
                +IT.getTipo().getVnom().getNumeratore()+"','"
                +IT.getTipo().getVnom().getDenominatore()+"','"
                +IT.getTipo().getDescrizione()+"','"
                +IT.getTipo().getSpessore()+"','"
                +IT.getTipo().getPeso()+"','"
                +IT.getTipo().getDimensione()+"','"
                +IT.getTipo().getForma().toString()+"','"
                +IT.getTipo().getBordo()+"','"
                +IT.getTipo().getMateriale()+"','"
                +IT.getTipo().getNota()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
            
        }
        else if(op instanceof IEmissione){
            IEmissione IE;
            IE=(IEmissione)op;
           try{
            conn.createStatement().execute("INSERT INTO EMISSIONE VALUES("
                    +IE.getId().getId() + ",'"
                    +IE.getTipo().getId() +"','"
                    +IE.getZecca().getId() +"','"
                    +IE.getEmissione().getAnno()+"','"
                    +IE.getEmissione().getNote()+ "')");
              }catch(SQLException ex){ex.printStackTrace();}

            
        }
        else if(op instanceof IMoneta){
            
            IMoneta IM;
            IM=(IMoneta)op;
            String tipoClasseStatoM="";
            String note="";
           
            
            if(IM.getMoneta().getStato().getNote() instanceof Cedibile){
                tipoClasseStatoM="Cedibile";
            }else if(IM.getMoneta().getStato().getNote() instanceof DestinataA){
                DestinataA sm=null;
                tipoClasseStatoM="DestinataA";
                sm=(DestinataA)IM.getMoneta().getStato().getNote();
                note=sm.getA();     
            }else if(IM.getMoneta().getStato().getNote() instanceof Virtuale){
                Virtuale sm=null;
                tipoClasseStatoM="Virtuale";
                sm=(Virtuale)IM.getMoneta().getStato().getNote();
                note=sm.getNota();   
            }else if(IM.getMoneta().getStato().getNote() instanceof InCollezione){
                InCollezione sm=null;
                tipoClasseStatoM="InCollezione";
                sm=(InCollezione)IM.getMoneta().getStato().getNote();
                note=sm.getLocazione();  
            }           
            try{
                conn.createStatement().execute("INSERT INTO MONETA VALUES("
                +IM.getId().getId()+ ",'"
                +IM.getEmissione().getId()+"','"
                +IM.getMoneta().getGrado().toString()+"','"
                +IM.getMoneta().getStato().isPresente()+"','"
                +tipoClasseStatoM+"','"
                +note+"','"
                +IM.getMoneta().getValoreCommerciale()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
            
        }
        
        else if(op instanceof IZecca){
            IZecca IZ;
            IZ=(IZecca)op;
           try{
            conn.createStatement().execute("INSERT INTO ZECCA VALUES("
                    +IZ.getId().getId() + ",'"
                    +IZ.getZ().getSigla() +"','"
                    +IZ.getZ().getDescrizione()+"','"
                    +IZ.getEnte().getId()+ "')");
              }catch(SQLException ex){ex.printStackTrace();}
        }
        else if(op instanceof ISistemaMonetario){
             ISistemaMonetario IS;
             IS=(ISistemaMonetario)op;
            try{
            conn.createStatement().execute("INSERT INTO SISTEMAMONETARIO VALUES("
                    + IS.getId().getId()+ ",'"
                    +IS.getEE().getId()+"','"
                    +IS.getSm().getNome()+"','"
                    +IS.getSm().getNomeOriginale()+ "')");
              }catch(SQLException ex){ex.printStackTrace();}
            
        }
        else if(op instanceof IUnita){
             IUnita IU;
             IU=(IUnita)op;
            try{
            conn.createStatement().execute("INSERT INTO UNITA VALUES("
                    +IU.getId().getId()+ ",'"
                    +IU.getSm().getId()+"','"
                    +IU.getUnita().getNome()+"','"
                    +IU.getUnita().getNomeOriginale()+"','"
                    +IU.getUnita().getFattoreMonteplicita()+ "')");
              }catch(SQLException ex){ex.printStackTrace();}
            
        }
         
        else if(op instanceof MEnte){
			MEnte ME;
			ME=(MEnte)op;
			try
			{
				conn.createStatement().execute("UPDATE  ENTEEMETTITORE SET NOME='"
					+ME.getE().getNome()+"',NOMEORIGINALE='"
					+ME.getE().getNomeOriginale()+"',AREAGEOGRAFICA='"
					+ME.getE().getAreaGeografica()+"',DATAINIZIO='"
					+ME.getE().getDataInizio().toString()+"',DATAFINE='"
					+ME.getE().getDataFine().toString()+"',NOTE='"
					+ME.getE().getNote()+ "' WHERE ID="+ME.getId().getId()+"");
			}
			catch(SQLException ex){ex.printStackTrace();}
            
			for (Enumeration zecca = ME.getZecche().elements();zecca.hasMoreElements(); )
			{         
				Zecca Z = (Zecca)zecca.nextElement();
				try
				{
					conn.createStatement().execute("UPDATE  ZECCA SET SIGLA='"
						+Z.getInfoZ().getSigla()+"',DESCRIZIONE='"
						+Z.getInfoZ().getDescrizione()+"',ENTEEMETTITORE="
						+Z.getEnteEmettitore().getId()+ " WHERE ID="+Z.getId().getId()+"");
				}
				catch(SQLException ex){ex.printStackTrace();}
            
			}
			for (Enumeration sm = ME.getSistemiMonetari().elements();sm.hasMoreElements(); )
			{         
				SistemaMonetario S = (SistemaMonetario)sm.nextElement();
     
				try
				{
					conn.createStatement().execute("UPDATE  SISTEMAMONETARIO SET ENTEEMETTITORE="
						+S.getEnteEmettitore().getId()+",NOME='"
						+S.getInfoSM().getNome()+"',NOMEO='"
						+S.getInfoSM().getNomeOriginale()+ "' WHERE ID="+S.getId().getId()+"");
				}
				catch(SQLException ex){ex.printStackTrace();}
			}
			for (Enumeration u = ME.getUnita().elements();u.hasMoreElements(); )
			{         
				Unita IU = (Unita)u.nextElement();
				try
				{
                    
					conn.createStatement().execute("UPDATE  UNITA SET SISTEMAMONETARIO="
						+IU.getSistemaMonetario().getId()+",NOME='"
						+IU.getInfoU().getNome()+"',NOMEORIGINALE='"
						+IU.getInfoU().getNomeOriginale()+"',FATTOREMOLTECIPLITA='"
						+IU.getInfoU().getFattoreMonteplicita()+ "' WHERE ID="+IU.getId().getId()+"");
				}
				catch(SQLException ex){ex.printStackTrace();}
  
                
			}
        }
        else if(op instanceof MTipo){
            
            MTipo MT;
            MT=(MTipo)op;
            
            try{
                conn.createStatement().execute("UPDATE  TIPO SET PARTEINTERA="
                +MT.getTipo().getVnom().getParteIntera()+",NUMERATORE="
                +MT.getTipo().getVnom().getNumeratore()+",DENOMINATORE="
                +MT.getTipo().getVnom().getDenominatore()+",DESCRIZIONE='"
                +MT.getTipo().getDescrizione()+"',SPESSORE="
                +MT.getTipo().getSpessore()+",PESO="
                +MT.getTipo().getPeso()+",DIMENSIONE="
                +MT.getTipo().getDimensione()+",FORMA='"
                +MT.getTipo().getForma().toString()+"',BORDO='"
                +MT.getTipo().getBordo()+"',MATERIALE='"
                +MT.getTipo().getMateriale()+"',NOTA='"
                +MT.getTipo().getNota()+ "' WHERE ID="+MT.getId().getId()+"");
          }catch(SQLException ex){ex.printStackTrace();}
            
        }
        else if(op instanceof MEmissione){
               MEmissione ME;
               ME=(MEmissione)op;
               
                 try{
                conn.createStatement().execute("UPDATE  EMISSIONE SET TIPO="
                +ME.getIdT().getId()+",ZECCA="
                +ME.getIdZ().getId()+",ANNO="
                +ME.getEmissione().getAnno()+",NOTE='"
                +ME.getEmissione().getNote()+ "' WHERE ID="+ME.getId().getId()+"");
          }catch(SQLException ex){ex.printStackTrace();}
       
            
        }
        else if(op instanceof MMoneta){
            
            MMoneta IM;
            IM=(MMoneta)op;
            String tipoClasseStatoM="";
            String note="";
           
            
            if(IM.getMoneta().getStato().getNote() instanceof Cedibile){
                tipoClasseStatoM="Cedibile";
            }else if(IM.getMoneta().getStato().getNote() instanceof DestinataA){
                DestinataA sm=null;
                tipoClasseStatoM="DestinataA";
                sm=(DestinataA)IM.getMoneta().getStato().getNote();
                note=sm.getA();     
            }else if(IM.getMoneta().getStato().getNote() instanceof Virtuale){
                Virtuale sm=null;
                tipoClasseStatoM="Virtuale";
                sm=(Virtuale)IM.getMoneta().getStato().getNote();
                note=sm.getNota();   
            }else if(IM.getMoneta().getStato().getNote() instanceof InCollezione){
                InCollezione sm=null;
                tipoClasseStatoM="InCollezione";
                sm=(InCollezione)IM.getMoneta().getStato().getNote();
                note=sm.getLocazione();  
            }
             try{
                conn.createStatement().execute("UPDATE  MONETA SET GRADO='"           
                +IM.getMoneta().getGrado().toString()+"',PRESENTE="
                +IM.getMoneta().getStato().isPresente()+",TIPOCLASSESTATOM='"
                +tipoClasseStatoM+"',NOTE='"
                +note+"',VALORECOMMERCIALE="
                +IM.getMoneta().getValoreCommerciale()+ " WHERE ID="+IM.getIdM().getId()+"");
          }catch(SQLException ex){ex.printStackTrace();}
          
            
        }else if(op instanceof MZecca){            
            MZecca MZ;
            MZ=(MZecca)op;
             try{
                conn.createStatement().execute("UPDATE  ZECCA SET SIGLA='"           
                +MZ.getZ().getSigla()+"',DESCRIZIONE='"
                +MZ.getZ().getDescrizione()+"',ENTEEMETTITORE="
                +MZ.getEnte().getId()+ " WHERE ID="+MZ.getId().getId()+"");
          }catch(SQLException ex){ex.printStackTrace();}
        }
        
        else if(op instanceof MSistemaMonetario){
            MSistemaMonetario MSM;
            MSM=(MSistemaMonetario)op;
             try{
                conn.createStatement().execute("UPDATE  SISTEMAMONETARIO SET ENTEEMETTITORE="           
                +MSM.getEE().getId()+",NOME='"
                +MSM.getSm().getNome()+"',NOMEO='"
                +MSM.getSm().getNomeOriginale()+ "' WHERE ID="+MSM.getId().getId()+"");
          }catch(SQLException ex){ex.printStackTrace();}
        }
        
        else if(op instanceof MUnita){
            MUnita MU;
            MU=(MUnita)op;
             try{
                conn.createStatement().execute("UPDATE  UNITA SET SISTEMAMONETARIO="           
                +MU.getSm().getId()+",NOME='"
                +MU.getUnita().getNome()+"',NOMEORIGINALE='"
                +MU.getUnita().getNomeOriginale()+ "',FATTOREMOLTECIPLITA=" +
                +MU.getUnita().getFattoreMonteplicita()+" WHERE ID="+MU.getId().getId()+"");
          }catch(SQLException ex){ex.printStackTrace();}
        
        
        }else if(op instanceof EEnte){/*eliminazione ezze e sistemi monetari gia' impostata in cascata nel db*/
            EEnte EE;
            EE=(EEnte)op;
             try {
            conn.createStatement().execute("DELETE FROM ENTEEMETTITORE WHERE id="+EE.getId().getId());            
        } catch (SQLException ex) {ex.printStackTrace();}
            
            
        }         
        else if(op instanceof ETipo){
             ETipo ET;
             ET=(ETipo)op;
             try {
            conn.createStatement().execute("DELETE FROM TIPO WHERE id="+ET.getId().getId());
            
        } catch (SQLException ex) {ex.printStackTrace();}
            
        }
        
         else if(op instanceof EMoneta){/*modifica in cascata non ancora apportata nel db*/
             EMoneta EM;
             EM=(EMoneta)op;
             try {
            conn.createStatement().execute("DELETE  FROM MONETA WHERE id="+EM.getId().getId());
            
        } catch (SQLException ex) {ex.printStackTrace();}
            
        }
        
         else if(op instanceof EEmissione){/*modifica in cascata non ancora apportata nel db*/
            EEmissione EE;
            EE=(EEmissione)op;
          try {
            conn.createStatement().execute("DELETE FROM EMISSIONE WHERE id="+EE.getId().getId());            
        } catch (SQLException ex) {ex.printStackTrace();}
        
            
        } else if(op instanceof EZecca){
              EZecca EZ;
              EZ=(EZecca)op;
          try {
            conn.createStatement().execute("DELETE FROM ZECCA WHERE id="+EZ.getId().getId());            
        } catch (SQLException ex) {ex.printStackTrace();}
            
        }
         else if(op instanceof ESistemaMonetario){
              ESistemaMonetario ESM;
              ESM=(ESistemaMonetario)op;
          try {
            conn.createStatement().execute("DELETE FROM SISTEMAMONETARIO WHERE id="+ESM.getId().getId());            
        } catch (SQLException ex) {ex.printStackTrace();}
            
        }
         else if(op instanceof EUnita){
              EUnita EU;
              EU=(EUnita)op;
          try {
            conn.createStatement().execute("DELETE FROM UNITA WHERE id="+EU.getId().getId());            
        } catch (SQLException ex) {ex.printStackTrace();}
            
        }
         else if(op instanceof Aggiungi){
            
        }
        
        
    }    
    
    public void aggiorna(Hashtable operazioni){
    
        for (Enumeration op = operazioni.elements(); op.hasMoreElements();){
            Operazione O = (Operazione)op.nextElement();
            applicaOp(O);
            }
        }
    
	@SuppressWarnings({ "unchecked", "deprecation" })
	public Info ricercaEC(CriterioRicerca criterio)
	{//return null se non trovato
		Info i=new Info();
		
		if(criterio != null){
			 String operatore="";
	
	         
			 int isFirst=0;
			 //String query="SELECT ENTEEMETTITORE.ID FROM (((ENTEEMETTITORE INNER JOIN TIPO ON ENTEEMETTITORE.ID=TIPO .ENTEEMETTITORE)INNER JOIN SISTEMAMONETARIO ON TIPO.ENTEEMETTITORE=SISTEMAMONETARIO.ENTEEMETTITORE)INNER JOIN EMISSIONI ON TIPO.ENTEEMETTITORE= EMISSIONI.ENTEEMETTITORE  WHERE";
			 String queryIn = "SELECT ENTEEMETTITORE.ID FROM (((ENTEEMETTITORE JOIN TIPO ON ENTEEMETTITORE.ID=TIPO .ENTEEMETTITORE)JOIN SISTEMAMONETARIO ON TIPO.ENTEEMETTITORE=SISTEMAMONETARIO.ENTEEMETTITORE)JOIN EMISSIONE ON TIPO.ID=EMISSIONE.TIPO) ";
			 String query="";
			 //ANNO EMISSIONE
			 if(!criterio.getAnnoEmissione().equals(null)){
				 if(criterio.getAnnoEmissione().getArg()!= 0){
					 if(criterio.getAnnoEmissione().getOperatore().toString().compareTo("uguale")==0){
					 	operatore="=";
					 }
					 if(criterio.getAnnoEmissione().getOperatore().toString().compareTo("maggiore")==0){
					 	operatore=">";
					 }
					 if(criterio.getAnnoEmissione().getOperatore().toString().compareTo("maggiore_uguale")==0){
					 	operatore=">=";
					 }
					 if(criterio.getAnnoEmissione().getOperatore().toString().compareTo("minore")==0){
					 	operatore="<";
					 }
					 if(criterio.getAnnoEmissione().getOperatore().toString().compareTo("minore_uguale")==0){
					 	operatore="<=";
					 }
					 if(criterio.getAnnoEmissione().getOperatore().toString().compareTo("diverso")==0){
					 	operatore="!=";
					 }
					 if(isFirst==0){
						 query= query+" EMISSIONE.ANNO"+operatore+"'"+criterio.getAnnoEmissione().getArg()+"01-01'";
						 isFirst++;
					 }else{
					 	query= query+" AND EMISSIONE.ANNO"+operatore+"'"+criterio.getAnnoEmissione().getArg()+"01-01'";
					 }
				 }	 
			 }
			 //AREA GEOGRAFICA
			 if(criterio.getAreaGeografica().getArg()!=null){
				 if(criterio.getAreaGeografica().getArg()!=""){
					 if(criterio.getAreaGeografica().getOperatore().toString().compareTo("uguale")==0){
						 operatore="=";
					 }
					 if(criterio.getAreaGeografica().getOperatore().toString().compareTo("maggiore")==0){
						 operatore=">";
					 }
					 if(criterio.getAreaGeografica().getOperatore().toString().compareTo("maggiore_uguale")==0){
						 operatore=">=";
					 }
					 if(criterio.getAreaGeografica().getOperatore().toString().compareTo("minore")==0){
						 operatore="<";
					 }
					 if(criterio.getAreaGeografica().getOperatore().toString().compareTo("minore_uguale")==0){
						 operatore="<=";
					 }
					 if(criterio.getAreaGeografica().getOperatore().toString().compareTo("diverso")==0){
						 operatore="!=";
					 }
					 if(isFirst==0){
						 query= query+" ENTEEMETTITORE.AREAGEOGRAFICA"+operatore+"'"+criterio.getAreaGeografica().getArg()+"'";
					 	isFirst++;
					 }else{
						 query= query+" AND ENTEEMETTITORE.AREAGEOGRAFICA"+operatore+"'"+criterio.getAreaGeografica().getArg()+"'";
					 }
				 }
			 }
			 //BORDO
			 if(criterio.getBordo().getArg()!=null){
				 if(criterio.getBordo().getArg()!=""){
					 if(criterio.getBordo().getOperatore().toString().compareTo("uguale")==0){
						 operatore="=";
					 }
					 if(criterio.getBordo().getOperatore().toString().compareTo("maggiore")==0){
						 operatore=">";
					 }
					 if(criterio.getBordo().getOperatore().toString().compareTo("maggiore_uguale")==0){
						 operatore=">=";
					 }
					 if(criterio.getBordo().getOperatore().toString().compareTo("minore")==0){
						 operatore="<";
					 }
					 if(criterio.getBordo().getOperatore().toString().compareTo("minore_uguale")==0){
						 operatore="<=";
					 }
					 if(criterio.getBordo().getOperatore().toString().compareTo("diverso")==0){
						 operatore="!=";
					 }
					 if(isFirst==0){
						 query= query+" TIPO.BORDO"+operatore+"'"+criterio.getBordo().getArg()+"'";
					 	isFirst++;
					 }else{
						 query= query+" AND TIPO.BORDO"+operatore+"'"+criterio.getBordo().getArg()+"'";
					 }
				 }
			 }
			 //DATA FINE
			 if(criterio.getDataFine().getArg().toString()!=null){
				 if(!criterio.getDataFine().getArg().equals(new java.sql.Date(1-1900,1,1))){
					 if(criterio.getDataFine().getOperatore().toString().compareTo("uguale")==0){
					 	operatore="=";
					 }
					 if(criterio.getDataFine().getOperatore().toString().compareTo("maggiore")==0){
					 	operatore=">";
					 }
					 if(criterio.getDataFine().getOperatore().toString().compareTo("maggiore_uguale")==0){
					 	operatore=">=";
					 }
					 if(criterio.getDataFine().getOperatore().toString().compareTo("minore")==0){
					 	operatore="<";
					 }
					 if(criterio.getDataFine().getOperatore().toString().compareTo("minore_uguale")==0){
					 	operatore="<=";
					 }
					 if(criterio.getDataFine().getOperatore().toString().compareTo("diverso")==0){
					 	operatore="!=";
					 }
					 if(isFirst==0){
					 	query= query+" ENTEEMETTITORE.DATAFINE"+operatore+"'"+criterio.getDataFine().getArg().toString()+"'";
					 	isFirst++;
					 }else{
					 	query= query+" AND ENTEEMETTITORE.DATAFINE"+operatore+"'"+criterio.getDataFine().getArg().toString()+"'";
					 }
				 }
			 }
			 //DATA INIZIO
			 if(criterio.getDataInizio().getArg().toString()!=null){
				 if(!criterio.getDataInizio().getArg().equals(new java.sql.Date(1-1900,1,1))){
					 if(criterio.getDataInizio().getOperatore().toString().compareTo("uguale")==0){
					 	operatore="=";
					 }
					 if(criterio.getDataInizio().getOperatore().toString().compareTo("maggiore")==0){
					 	operatore=">";
					 }
					 if(criterio.getDataInizio().getOperatore().toString().compareTo("maggiore_uguale")==0){
					 	operatore=">=";
					 }
					 if(criterio.getDataInizio().getOperatore().toString().compareTo("minore")==0){
					 	operatore="<";
					 }
					 if(criterio.getDataInizio().getOperatore().toString().compareTo("minore_uguale")==0){
					 	operatore="<=";
					 }
					 if(criterio.getDataInizio().getOperatore().toString().compareTo("diverso")==0){
					 	operatore="!=";
					 }
					 if(isFirst==0){
					 	query= query+" ENTEEMETTITORE.DATAINIZIO"+operatore+"'"+criterio.getDataInizio().getArg().toString()+"'";
					 	isFirst++;
					 }else{
					 	query= query+" AND ENTEEMETTITORE.DATAINIZIO"+operatore+"'"+criterio.getDataInizio().getArg().toString()+"'";
					 }
				 }
			 }
			 //DESCRIZIONE
			 if(criterio.getDescrizione().toString()!=null){
				 if(criterio.getDescrizione().getArg()!=""){
					 if(criterio.getDescrizione().getOperatore().toString().compareTo("uguale")==0){
						 operatore="=";
					 }
					 if(criterio.getDescrizione().getOperatore().toString().compareTo("maggiore")==0){
						 operatore=">";
					 }
					 if(criterio.getDescrizione().getOperatore().toString().compareTo("maggiore_uguale")==0){
						 operatore=">=";
					 }
					 if(criterio.getDescrizione().getOperatore().toString().compareTo("minore")==0){
						 operatore="<";
					 }
					 if(criterio.getDescrizione().getOperatore().toString().compareTo("minore_uguale")==0){
						 operatore="<=";
					 }
					 if(criterio.getDescrizione().getOperatore().toString().compareTo("diverso")==0){
						 operatore="!=";
					 }
					 if(isFirst==0){
						 query= query+" TIPO.DESCRIZIONE"+operatore+"'"+criterio.getDescrizione().getArg()+"'";
						 isFirst++;
					 }else{
						 query= query+" AND TIPO.DESCRIZIONE"+operatore+"'"+criterio.getDescrizione().getArg()+"'";
					 }
				 }
			 }
			 //DIMENSIONE
			 if(!criterio.getDimensione().equals(null)){
				 if(criterio.getDimensione().getArg()!=0){
					 if(criterio.getDimensione().getOperatore().toString().compareTo("uguale")==0){
						 operatore="=";
					 }
					 if(criterio.getDimensione().getOperatore().toString().compareTo("maggiore")==0){
						 operatore=">";
					 }
					 if(criterio.getDimensione().getOperatore().toString().compareTo("maggiore_uguale")==0){
						 operatore=">=";
					 }
					 if(criterio.getDimensione().getOperatore().toString().compareTo("minore")==0){
						 operatore="<";
					 }
					 if(criterio.getDimensione().getOperatore().toString().compareTo("minore_uguale")==0){
						 operatore="<=";
					 }
					 if(criterio.getDimensione().getOperatore().toString().compareTo("diverso")==0){
						 operatore="!=";
					 }
					 if(isFirst==0){
						 query= query+" TIPO.DIMENSIONE"+operatore+criterio.getDimensione().getArg()+"";
						 isFirst++;
					 }else{
						 query= query+" AND TIPO.DIMENSIONE"+operatore+criterio.getDimensione().getArg()+"";
					 }
				 }
			 }
			 //FORMA
			 if(criterio.getForma().getArg().toString()!=null){
				 if(!(criterio.getForma().getArg().equals(Forma.niente))){
					 if(criterio.getForma().getOperatore().toString().compareTo("uguale")==0){
						 operatore="=";
					 }
					 if(criterio.getForma().getOperatore().toString().compareTo("maggiore")==0){
						 operatore=">";
					 }
					 if(criterio.getForma().getOperatore().toString().compareTo("maggiore_uguale")==0){
						 operatore=">=";
					 }
					 if(criterio.getForma().getOperatore().toString().compareTo("minore")==0){
						 operatore="<";
					 }
					 if(criterio.getForma().getOperatore().toString().compareTo("minore_uguale")==0){
						 operatore="<=";
					 }
					 if(criterio.getForma().getOperatore().toString().compareTo("diverso")==0){
						 operatore="!=";
					 }
					 if(isFirst==0){
						 query= query+" TIPO.FORMA"+operatore+"'"+criterio.getForma().getArg().toString()+"'";
					 	isFirst++;
					 }else{
						 query= query+" AND TIPO.FORMA"+operatore+"'"+criterio.getForma().getArg().toString()+"'";
					 }
				 }
			 }
			 //MATERIALE
			 if(criterio.getMateriale().getArg()!=null){
				 if(criterio.getMateriale().getArg()!=""){
					 if(criterio.getMateriale().getOperatore().toString().compareTo("uguale")==0){
						 operatore="=";
					 }
					 if(criterio.getMateriale().getOperatore().toString().compareTo("maggiore")==0){
						 operatore=">";
					 }
					 if(criterio.getMateriale().getOperatore().toString().compareTo("maggiore_uguale")==0){
						 operatore=">=";
					 }
					 if(criterio.getMateriale().getOperatore().toString().compareTo("minore")==0){
						 operatore="<";
					 }
					 if(criterio.getMateriale().getOperatore().toString().compareTo("minore_uguale")==0){
						 operatore="<=";
					 }
					 if(criterio.getMateriale().getOperatore().toString().compareTo("diverso")==0){
						 operatore="!=";
					 }
					 if(isFirst==0){
						 query= query+" TIPO.MATERIALE"+operatore+"'"+criterio.getMateriale().getArg()+"'";
						 isFirst++;
					 }else{
						 query= query+" AND TIPO.MATERIALE"+operatore+"'"+criterio.getMateriale().getArg()+"'";
					 }
				 }
			 }
			 //NOME ENTE EMETTITORE
			 if(criterio.getNomeEnteEmettitore().getArg()!=null){
				 if(criterio.getNomeEnteEmettitore().getArg()!= ""){
					 if(criterio.getNomeEnteEmettitore().getOperatore().toString().compareTo("uguale")==0){
						 operatore="=";
					 }
					 if(criterio.getNomeEnteEmettitore().getOperatore().toString().compareTo("maggiore")==0){
						 operatore=">";
					 }
					 if(criterio.getNomeEnteEmettitore().getOperatore().toString().compareTo("maggiore_uguale")==0){
						 operatore=">=";
					 }
					 if(criterio.getNomeEnteEmettitore().getOperatore().toString().compareTo("minore")==0){
						 operatore="<";
					 }
					 if(criterio.getNomeEnteEmettitore().getOperatore().toString().compareTo("minore_uguale")==0){
						 operatore="<=";
					 }
					 if(criterio.getNomeEnteEmettitore().getOperatore().toString().compareTo("diverso")==0){
						 operatore="!=";
					 }
					 if(isFirst==0){
						 query= query+" ENTEEMETTITORE.NOME"+operatore+"'"+criterio.getNomeEnteEmettitore().getArg()+"'";
						 isFirst++;
					 }else{
						 query= query+" AND ENTEEMETTITORE.NOME"+operatore+"'"+criterio.getNomeEnteEmettitore().getArg()+"'";
					 }
				 }
			 }
			 //PESO
			 if(!criterio.getPeso().equals(null)){
				 if(criterio.getPeso().getArg()!= 0){
					 if(criterio.getPeso().getOperatore().toString().compareTo("uguale")==0){
						 operatore="=";
					 }
					 if(criterio.getPeso().getOperatore().toString().compareTo("maggiore")==0){
						 operatore=">";
					 }
					 if(criterio.getPeso().getOperatore().toString().compareTo("maggiore_uguale")==0){
						 operatore=">=";
					 }
					 if(criterio.getPeso().getOperatore().toString().compareTo("minore")==0){
						 operatore="<";
					 }
					 if(criterio.getPeso().getOperatore().toString().compareTo("minore_uguale")==0){
						 operatore="<=";
					 }
					 if(criterio.getPeso().getOperatore().toString().compareTo("diverso")==0){
						 operatore="!=";
					 }
					 if(isFirst==0){
						 query= query+" TIPO.PESO"+operatore+criterio.getPeso().getArg()+"";
					 	isFirst++;
					 }else{
						 query= query+" AND TIPO.PESO"+operatore+criterio.getPeso().getArg()+"";
					 }
				 }
			 }
			 //SPESSORE
			 if(!criterio.getSpessore().equals(null)){
				 if(criterio.getSpessore().getArg()!=0){
					 if(criterio.getSpessore().getOperatore().toString().compareTo("uguale")==0){
						 operatore="=";
					 }
					 if(criterio.getSpessore().getOperatore().toString().compareTo("maggiore")==0){
						 operatore=">";
					 }
					 if(criterio.getSpessore().getOperatore().toString().compareTo("maggiore_uguale")==0){
						 operatore=">=";
					 }
					 if(criterio.getSpessore().getOperatore().toString().compareTo("minore")==0){
						 operatore="<";
					 }
					 if(criterio.getSpessore().getOperatore().toString().compareTo("minore_uguale")==0){
						 operatore="<=";
					 }
					 if(criterio.getSpessore().getOperatore().toString().compareTo("diverso")==0){
						 operatore="!=";
					 }
					 if(isFirst==0){
						 query= query+" TIPO.SPESSORE"+operatore+criterio.getSpessore().getArg()+"";
					 	isFirst++;
					 }else{
						 query= query+" AND TIPO.SPESSORE"+operatore+criterio.getSpessore().getArg()+"";
					 }
				 }
			 }
			 /*VALORE NOMINALE
			 if(!criterio.getValoreNominale().equals(null)){
				 if(criterio.getValoreNominale().getOperatore().toString().compareTo("uguale")==0){
				 operatore="=";
				 }
				 if(criterio.getValoreNominale().getOperatore().toString().compareTo("maggiore")==0){
				 operatore=">";
				 }
				 if(criterio.getValoreNominale().getOperatore().toString().compareTo("maggiore_uguale")==0){
				 operatore=">=";
				 }
				 if(criterio.getValoreNominale().getOperatore().toString().compareTo("minore")==0){
				 operatore="<";
				 }
				 if(criterio.getValoreNominale().getOperatore().toString().compareTo("minore_uguale")==0){
				 operatore="<=";
				 }
				 if(criterio.getValoreNominale().getOperatore().toString().compareTo("diverso")==0){
				 operatore="!=";
				}
	                
				 if(isFirst==0){
				 	query= query+" TIPO.VALORENOMINALE"+operatore+criterio.getValoreNominale().getArg()+"";
				 	isFirst++;
				 }else{
				 	query= query+" AND TIPO.VALORENOMINALE"+operatore+criterio.getValoreNominale().getArg()+"";
				 }
			 }*/
			 if(query==""){
				 	query = queryIn+" GROUP BY ENTEEMETTITORE.ID";
				 }else{
					query = queryIn+" WHERE "+query+" GROUP BY ENTEEMETTITORE.ID";
				 } 
			 //query = query+" GROUP BY ENTEEMETTITORE.ID";
			 System.out.println(query);
			 this.RecuperaDati();
			 ParteSelezionata auxPSEL= new ParteSelezionata();
			 auxPSEL.set(this.dati);
			 Hashtable entiEmettitori=new Hashtable();
			 try{
				 Statement stmt=conn.createStatement();
				 ResultSet rs=stmt.executeQuery(query);
				 System.out.println("query eseguita");
		           
				 while(rs.next()){
					 System.out.println("entro while");
					 Id id=new Id(rs.getInt(1));
					 Info auxInfo = auxPSEL.infoCompletaEE(id);
					 entiEmettitori.put(id.getId(), auxInfo);
				 }
				 rs.close();
				 stmt.close();
				 System.out.println("esco while");
		        if(!entiEmettitori.isEmpty()){
		        	System.out.println("hash pieno");
					 for(Enumeration key=entiEmettitori.elements(); key.hasMoreElements();){
						 Info auxInfo = (Info)key.nextElement();
						 for(Enumeration keyE=auxInfo.getEmissioneH().elements(); keyE.hasMoreElements();){
							 Emissione auxE = (Emissione)keyE.nextElement();
							 //inserisciE(InfoEmissione IE, Id idT,Id idZ,Id id)
							 i.getEmissioneH().put(auxE.getId().getId(),auxE);
						 }
						 for(Enumeration keyEE=auxInfo.getEnteEmettitoreH().elements(); keyEE.hasMoreElements();){
							 EnteEmettitore auxEE = (EnteEmettitore)keyEE.nextElement();
							 i.getEnteEmettitoreH().put(auxEE.getId().getId(),auxEE);
						 }
						 for(Enumeration keyM=auxInfo.getMonetaH().elements(); keyM.hasMoreElements();){
							 Moneta auxM=(Moneta)keyM.nextElement();
							 i.getMonetaH().put(auxM.getId().getId(),auxM);
						 }
						 for(Enumeration keySM=auxInfo.getSistemaMonetarioH().elements(); keySM.hasMoreElements();){
							 SistemaMonetario auxSM=(SistemaMonetario)keySM.nextElement();
							 i.getSistemaMonetarioH().put(auxSM.getId().getId(), auxSM);
						 }
						 for(Enumeration keyT=auxInfo.getTipoH().elements(); keyT.hasMoreElements();){
							 Tipo auxT=(Tipo)keyT.nextElement();
							 i.getTipoH().put(auxT.getId().getId(),auxT);
						 }
						 for(Enumeration keyU=auxInfo.getUnitaH().elements(); keyU.hasMoreElements();){
							 Unita auxU=(Unita)keyU.nextElement();
							 i.getUnitaH().put(auxU.getId().getId(),auxU);
						 }
						 for(Enumeration keyZ=auxInfo.getZeccaH().elements(); keyZ.hasMoreElements();){
							 Zecca auxZ=(Zecca)keyZ.nextElement();
							 i.getZeccaH().put(auxZ.getId().getId(),auxZ);
						 }
					 }
		        }else{
		        	System.out.println("hash vuoto");
		        	return i;
		        }
			 }catch(SQLException ex){ex.printStackTrace();}

			 return i;
			 
		}else{
			this.RecuperaDati();
			i = this.getDati();
			return i;
		}
	}


    
    public Info ricercaMonete(CriterioRicerca criterio){//return null se non trovato  	 
   	 
     	 Info i=new Info();
   	 this.RecuperaDati();
   	 i=this.getDati();    	
   	 return i;
   }
    
    
    public void setDati(Info dati){
        this.dati=dati;
    }
    
    public Info getDati(){
        return dati;
    }
    
    public Id getId_max(){
        return this.id_max;
    }
    
  public void Connessione(String database,String username,String password){
     /**Caricamento Driver**/
     try{ 
     Class.forName("org.h2.Driver");
    }catch (ClassNotFoundException ex){ex.printStackTrace();}
    
     /**Connessione database**/
     try{
    conn = DriverManager.getConnection("jdbc:h2:"+database,username,password);
     }catch (SQLException ex){ex.printStackTrace();}
    }
  
  public void ChiudiConnessione(){
        try {
            conn.close();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
  }
    
  
    public Id Ricerca_max_Id(){
        int max_att=0;
        int aux_max=0;
        try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT MAX(ID) FROM ENTEEMETTITORE");
           rs.next();
           aux_max=rs.getInt(1);
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
        if(aux_max>max_att){max_att=aux_max;}
        try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT MAX(ID) FROM ZECCA");
           rs.next();
           aux_max=rs.getInt(1);
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
        if(aux_max>max_att){max_att=aux_max;}
        try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT MAX(ID) FROM TIPO");
           rs.next();
           aux_max=rs.getInt(1);
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
        if(aux_max>max_att){max_att=aux_max;}
        try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT MAX(ID) FROM EMISSIONE");
           rs.next();
           aux_max=rs.getInt(1);
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
        if(aux_max>max_att){max_att=aux_max;}
        try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT MAX(ID) FROM MONETA");
           rs.next();
           aux_max=rs.getInt(1);
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
        if(aux_max>max_att){max_att=aux_max;}
        try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT MAX(ID) FROM SISTEMAMONETARIO");
           rs.next();
           aux_max=rs.getInt(1);
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
        if(aux_max>max_att){max_att=aux_max;}
        try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT MAX(ID) FROM UNITA");
           rs.next();
           aux_max=rs.getInt(1);
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
        if(aux_max>max_att){max_att=aux_max;}
        
        Id id_exit=new Id(max_att);
        return id_exit;
        
    }
   
    
    
    @SuppressWarnings("unchecked")
	public Hashtable getEntiEmettitori(){
        Hashtable entiEmettitori=new Hashtable();
         try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT * FROM ENTEEMETTITORE");
           
           while(rs.next()){
               int id=rs.getInt(1);
               String nome=rs.getString(2);
               String nomeOriginale=rs.getString(3);
               String areaGeografica=rs.getString(4);
               java.sql.Date dataInizio=rs.getDate(5);
               java.sql.Date dataFine=rs.getDate(6);
               String note=rs.getString(7);
               InfoEnteEmettitore infoEE=new InfoEnteEmettitore(nome,nomeOriginale,areaGeografica,dataInizio,dataFine,note);
               Id idI=new Id(id);
               EnteEmettitore EE=new EnteEmettitore(idI,infoEE);
               entiEmettitori.put(idI.getId(),EE);
           }
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
       return entiEmettitori;
    }
    
    @SuppressWarnings("unchecked")
	public Hashtable getZecche(){
        Hashtable zecche=new Hashtable();
         try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT * FROM ZECCA");
           
           while(rs.next()){
               int id=rs.getInt(1);
               String sigla=rs.getString(2);
               String descrizione=rs.getString(3);
               int EE=rs.getInt(4);
               InfoZecca infoZ=new InfoZecca(sigla,descrizione);
               Id idZ=new Id(id);
               Id idE=new Id(EE);
               Zecca Z=new Zecca(infoZ,idZ,idE);
               zecche.put(idZ.getId(),Z);
           }
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
       return zecche;
    }
    
    @SuppressWarnings("unchecked")
    public Hashtable getSistemiMonetari(){
        Hashtable sistemimonetari=new Hashtable();
         try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT * FROM SISTEMAMONETARIO");
           
           while(rs.next()){
               int id=rs.getInt(1);
               int EE=rs.getInt(2);
               String nome=rs.getString(3);
               String nomeO=rs.getString(4);
               InfoSistemaMonetario infoS=new InfoSistemaMonetario(nome,nomeO);
               Id idS=new Id(id);
               Id idE=new Id(EE);
               SistemaMonetario SM=new SistemaMonetario(idS,infoS,idE);
               sistemimonetari.put(idS.getId(),SM);
           }
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
       return sistemimonetari;
    }
    
    @SuppressWarnings("unchecked")
    public Hashtable getUnita(){
        Hashtable unita=new Hashtable();
         try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT * FROM UNITA");
           
           while(rs.next()){
               int id=rs.getInt(1);
               int SM=rs.getInt(2);
               String nome=rs.getString(3);
               String nomeOriginale=rs.getString(4);
               float fattoreMolteciplita=rs.getFloat(5);
               InfoUnita infoU=new InfoUnita(nome,nomeOriginale,fattoreMolteciplita);
               Id idU=new Id(id);
               Id idSM=new Id(SM);
               Unita U=new Unita(idU,idSM,infoU);
               unita.put(idU.getId(),U);
           }
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
       return unita;
    }
    
    @SuppressWarnings("unchecked")
    public Hashtable getEmissioni(){
        Hashtable emissioni=new Hashtable();
         try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT * FROM EMISSIONE");
           
           while(rs.next()){
               int id=rs.getInt(1);
               int tipo=rs.getInt(2);
               int zecca=rs.getInt(3);
               int anno=rs.getInt(4);
               String note=rs.getString(5);
               InfoEmissione infoE=new InfoEmissione(anno,note);
               Id idEM=new Id(id);
               Id idT=new Id(tipo);
               Id idZ=new Id(zecca);
               Emissione E=new Emissione(idEM,idT,idZ,infoE);
               emissioni.put(idEM.getId(),E);
           }
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
       return emissioni;
    }
    
    @SuppressWarnings("unchecked")
    public Hashtable getMonete(){
        
        Hashtable monete=new Hashtable();
        InCollezione inc=null;
        Cedibile c=null;
        DestinataA d=null;
        Virtuale v=null;
        Stato stato=null;
         try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT * FROM MONETA");          
           while(rs.next()){
               Grado grado = null;
               //StatoM statoM = null;
               int id=rs.getInt(1);
               int emissione=rs.getInt(2);
               String gr=rs.getString(3);
               boolean presente=rs.getBoolean(4);
               String tipoClasseStatoM=rs.getString(5);
               String note=rs.getString(6);
               float valoreCommerciale=rs.getFloat(7);
               
             
               grado=Grado.valueOf(gr);
               if(tipoClasseStatoM.compareTo("InCollezione")==0){
                inc=new InCollezione();
                inc.setLocazione(note);
                stato=new Stato(presente,inc); 
               }
               if(tipoClasseStatoM.compareTo("Cedibile")==0){
                 c=new Cedibile();
                 stato=new Stato(presente,c); 
               
               }
               if(tipoClasseStatoM.compareTo("DestinataA")==0){
                 d=new DestinataA();
                 d.setA(note);
                 stato=new Stato(presente,d); 
                
               }
               if(tipoClasseStatoM.compareTo("Virtuale")==0){
                  v=new Virtuale();
                  v.setNota(note);
                  stato=new Stato(presente,v); 
                  
               }              
               InfoMoneta infoM=new InfoMoneta(grado,stato,valoreCommerciale);
               Id idM=new Id(id);
               Id idE=new Id(emissione);
               Moneta M=new Moneta(idM,infoM,idE);
               monete.put(idM.getId(),M);
           }
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
       return monete;
    }
    
    @SuppressWarnings("unchecked")
    public Hashtable getTipiMoneta(){
        Hashtable tipiMoneta=new Hashtable();
         try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT * FROM TIPO");
           Forma forma=null;
           
           while(rs.next()){
               int id=rs.getInt(1);
               int unita=rs.getInt(2);
               int enteEmettitore=rs.getInt(3);
               int parteIntera=rs.getInt(4);
               int numeratore=rs.getInt(5);
               int denominatore=rs.getInt(6);
               String descrizione=rs.getString(7);
               float spessore=rs.getFloat(8);
               float peso=rs.getFloat(9);
               float dimensione=rs.getFloat(10);
               String fr=rs.getString(11);
               String bordo=rs.getString(12);
               String materiale=rs.getString(13);
               String nota=rs.getString(14);
               
               ValoreNominale vnom=new ValoreNominale(parteIntera,numeratore,denominatore);  
               forma=Forma.valueOf(fr);
               InfoTipoMoneta infoTM=new InfoTipoMoneta(vnom,descrizione,spessore,peso,dimensione,forma,bordo,materiale,nota);
               
               Id idTM=new Id(id);
               Id idU=new Id(unita);
               Id idEE=new Id(enteEmettitore);
               Tipo TM=new Tipo(idTM,idU,idEE,infoTM);
               tipiMoneta.put(idTM.getId(),TM);
           }
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
       return tipiMoneta;
    }

  
}