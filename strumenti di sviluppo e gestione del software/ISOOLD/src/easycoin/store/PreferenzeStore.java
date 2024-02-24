package easycoin.store;

import easycoin.datatype.*;
import easycoin.datatype.criterio.*;
import easycoin.enumeration.*;
import java.util.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


public class PreferenzeStore{
    
    private Connection conn;
    
    public PreferenzeStore(){
    	
    }
     
    @SuppressWarnings("unchecked")
	public ModalitaVisualizzazione getModVis(){
         Formato fr=null;
         Concisione c=null;
         OggettoDaMostrare ogm=null;
         Hashtable ordb=new Hashtable();
         OrdinamentoBase ob=null;
         int indice=1;
         
         try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT * FROM MODVIS");
           
           while(rs.next()){
               String formato=rs.getString(1);
               String concisione=rs.getString(2);
               String oggettodamostrare=rs.getString(3);              
               fr=Formato.valueOf(formato);
               c=Concisione.valueOf(concisione);
               ogm=OggettoDaMostrare.valueOf(oggettodamostrare);           
           }          
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
         
         try{
           Statement stmt=conn.createStatement();
           ResultSet rs=stmt.executeQuery("SELECT * FROM ORDINAMENTO");
           
           while(rs.next()){
               int posizione=rs.getInt(1);
               boolean crescente=rs.getBoolean(2);                         
               ob=new OrdinamentoBase(posizione,crescente);
               ordb.put(indice,ob);
               indice++;
           }          
           rs.close();
           stmt.close();
       }catch(SQLException ex){ex.printStackTrace();}
          
        
        Ordinamento or=new Ordinamento();
        
        OrdinamentoBase o=(OrdinamentoBase)ordb.get(1);
        or.setNomeEnteEmettitore(o);
        o=(OrdinamentoBase)ordb.get(2);
        or.setAreaGeografica(o);
        o=(OrdinamentoBase)ordb.get(3);
        or.setDataInizio(o);
        o=(OrdinamentoBase)ordb.get(4);
        or.setDataFine(o);
        o=(OrdinamentoBase)ordb.get(5);
        or.setAnnoEmissione(o);
        o=(OrdinamentoBase)ordb.get(6);
        or.setZecca(o);
        o=(OrdinamentoBase)ordb.get(7);
        or.setValoreNominale(o);
        o=(OrdinamentoBase)ordb.get(8);
        or.setSpessore(o);
        o=(OrdinamentoBase)ordb.get(9);
        or.setPeso(o);
        o=(OrdinamentoBase)ordb.get(10);
        or.setDimensione(o);
        o=(OrdinamentoBase)ordb.get(11);
        or.setForma(o);
        o=(OrdinamentoBase)ordb.get(12);
        or.setBordo(o);
        o=(OrdinamentoBase)ordb.get(13);
        or.setMateriale(o);
        o=(OrdinamentoBase)ordb.get(14);
        or.setGrado(o);
        o=(OrdinamentoBase)ordb.get(15);
        or.setValoreNominale(o);
        
        
        ModalitaVisualizzazione mv=new ModalitaVisualizzazione();
        mv.setFormato(fr);
        mv.setConcisione(c);
        mv.setMostra(ogm);
        mv.setOrdinamento(or);
        
       
        return mv;
         
     }
     
    public CriterioRicerca getCriterio(){
        CriterioRicerca cr=null; 
        InCollezione inc=null;
         Cedibile c=null;
         DestinataA d=null;
         Virtuale v=null;
         Stato stato=null;
         
        try{
            Statement stmt=conn.createStatement();
            ResultSet rs=stmt.executeQuery("SELECT * FROM CRITRIC");
            
            while(rs.next()){
                String nomeEnteEmettitore=rs.getString(1);
                String areaGeografica=rs.getString(2);
                int annoEmissione=rs.getInt(3);
                java.sql.Date dataInizio=rs.getDate(4);
                java.sql.Date dataFine=rs.getDate(5);
                String zecca=rs.getString(6);
                int valoreNominale=rs.getInt(7);
                String unita=rs.getString(8);
                float spessore=rs.getFloat(9);
                float peso=rs.getFloat(10);
                float dimensione=rs.getFloat(11);               
                String bordo=rs.getString(12);
                String forma=rs.getString(13);
                String materiale=rs.getString(14);
                String descrizione=rs.getString(15);
                float valoreCommerciale=rs.getFloat(16);              
                String grado=rs.getString(17);
                boolean presente=rs.getBoolean(18);
                String tipoClasseStatoM=rs.getString(19);
                String note=rs.getString(20);
                
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
                        
                cr=new CriterioRicerca();
                cr.setNomeEnteEmettitore(new CriterioString(nomeEnteEmettitore));
                cr.setAreaGeografica(new CriterioString(areaGeografica));
                cr.setAnnoEmissione(new CriterioInt(annoEmissione));
                cr.setDataInizio(new CriterioDate(dataInizio));
                cr.setDataFine(new CriterioDate(dataFine));
                cr.setZecca(new CriterioString(zecca));
                cr.setValoreNominale(new CriterioInt(valoreNominale));
                cr.setUnita(new CriterioString(unita));
                cr.setSpessore(new CriterioFloat(spessore));
                cr.setPeso(new CriterioFloat(peso));
                cr.setDimensione(new CriterioFloat(dimensione));
                cr.setBordo(new CriterioString(bordo));
                Forma f=Forma.valueOf(forma);
                cr.setForma(new CriterioForma(f));
                cr.setMateriale(new CriterioString(materiale));
                cr.setDescrizione(new CriterioString(descrizione));
                cr.setValoreCommerciale(new CriterioFloat(valoreCommerciale));
                Grado gg=Grado.valueOf(grado);
                cr.setGrado(new CriterioGrado(gg));
                cr.setStato(new CriterioStato(stato));
                

                //ValoreNominale vnom=new ValoreNominale(parteIntera,numeratore,denominatore); 
            }          
            
        }catch(SQLException ex){ex.printStackTrace();}
         try{
            Statement stmt=conn.createStatement();
            ResultSet rs=stmt.executeQuery("SELECT * FROM OPERATORE");
            
            while(rs.next()){
                String op_nomeEnteEmettitore=rs.getString(1);
                String op_areaGeografica=rs.getString(2);
                String op_annoEmissione=rs.getString(3);
                String op_dataInizio=rs.getString(4);
                String op_dataFine=rs.getString(5);
                String op_zecca=rs.getString(6);
                String op_valoreNominale=rs.getString(7);
                String op_unita=rs.getString(8);
                String op_spessore=rs.getString(9);
                String op_peso=rs.getString(10);
                String op_dimensione=rs.getString(11);               
                String op_bordo=rs.getString(12);
                String op_forma=rs.getString(13);
                String op_materiale=rs.getString(14);
                String op_descrizione=rs.getString(15);
                String op_valoreCommerciale=rs.getString(16);              
                String op_grado=rs.getString(17);
                String op_stato=rs.getString(18);

               
                if(cr.getNomeEnteEmettitore()!= null){
             	   cr.getNomeEnteEmettitore().setOperatore(Operatore.valueOf(op_nomeEnteEmettitore));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getAreaGeografica().setOperatore(Operatore.valueOf(op_areaGeografica));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getAnnoEmissione().setOperatore(Operatore.valueOf(op_annoEmissione));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getDataInizio().setOperatore(Operatore.valueOf(op_dataInizio));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getDataFine().setOperatore(Operatore.valueOf(op_dataFine));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getZecca().setOperatore(Operatore.valueOf(op_zecca));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getValoreNominale().setOperatore(Operatore.valueOf(op_valoreNominale));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getUnita().setOperatore(Operatore.valueOf(op_unita));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getSpessore().setOperatore(Operatore.valueOf(op_spessore));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getPeso().setOperatore(Operatore.valueOf(op_peso));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getDimensione().setOperatore(Operatore.valueOf(op_dimensione));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getBordo().setOperatore(Operatore.valueOf(op_bordo));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getForma().setOperatore(Operatore.valueOf(op_forma));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getMateriale().setOperatore(Operatore.valueOf(op_materiale));
                }
                if(cr.getNomeEnteEmettitore()!=null){
             	   cr.getDescrizione().setOperatore(Operatore.valueOf(op_descrizione));
 	           }
        		   if(cr.getNomeEnteEmettitore()!=null){   
        			cr.getValoreCommerciale().setOperatore(Operatore.valueOf(op_valoreCommerciale));
     		   }
     		   if(cr.getNomeEnteEmettitore()!=null){ 
     			cr.getGrado().setOperatore(Operatore.valueOf(op_grado));
 			   }
 			   if(cr.getNomeEnteEmettitore()!=null){  
 				cr.getStato().setOperatore(Operatore.valueOf(op_stato));
 			   }
                //ValoreNominale vnom=new ValoreNominale(parteIntera,numeratore,denominatore); 
            }          
            rs.close();
            stmt.close();
        }catch(SQLException ex){ex.printStackTrace();}
        return cr;
      }
     
    
    public void setModVis(ModalitaVisualizzazione mod){
    	try{
            conn.createStatement().execute("UPDATE MODVIS SET FORMATO='"
            +mod.getFormato().toString()+ "'; UPDATE MODVIS SET CONCISIONE='"
            +mod.getConcisione().toString()+ "'; UPDATE MODVIS SET OGGETTODAMOSTRARE='"             
            +mod.getMostra().toString()+ "';");
    	}catch(SQLException ex){ex.printStackTrace();}
        /*
          try{
                conn.createStatement().execute("DELETE FROM MODVIS WHERE 1");
           
          }catch(SQLException ex){ex.printStackTrace();}
    
          try{
                conn.createStatement().execute("DELETE FROM ORDINAMENTO WHERE 1");
           
          }catch(SQLException ex){ex.printStackTrace();}
  
         try{
                conn.createStatement().execute("INSERT INTO MODVIS VALUES('"
                +mod.getFormato().toString()+ "','"
                +mod.getConcisione().toString()+ "','"             
                +mod.getMostra().toString()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}

	
         try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getNomeEnteEmettitore().getPosizione()+ ",'"         
                +mod.getOrdinamento().getNomeEnteEmettitore().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
          try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getAreaGeografica().getPosizione()+ ",'"         
                +mod.getOrdinamento().getAreaGeografica().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getDataInizio().getPosizione()+ ",'"         
                +mod.getOrdinamento().getDataInizio().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getDataFine().getPosizione()+ ",'"         
                +mod.getOrdinamento().getDataFine().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getAnnoEmissione().getPosizione()+ ",'"         
                +mod.getOrdinamento().getAnnoEmissione().isCrescente()+ "')");
         }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getZecca().getPosizione()+ ",'"         
                +mod.getOrdinamento().getZecca().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getValoreNominale().getPosizione()+ ",'"         
                +mod.getOrdinamento().getValoreNominale().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
      
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getSpessore().getPosizione()+ ",'"         
                +mod.getOrdinamento().getSpessore().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getPeso().getPosizione()+ ",'"         
                +mod.getOrdinamento().getPeso().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getDimensione().getPosizione()+ ",'"         
                +mod.getOrdinamento().getDimensione().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getForma().getPosizione()+ ",'"         
                +mod.getOrdinamento().getForma().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getBordo().getPosizione()+ ",'"         
                +mod.getOrdinamento().getBordo().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getMateriale().getPosizione()+ ",'"         
                +mod.getOrdinamento().getMateriale().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
        try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getGrado().getPosizione()+ ",'"         
                +mod.getOrdinamento().getGrado().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}
         try{
                conn.createStatement().execute("INSERT INTO ORDINAMENTO VALUES("
                +mod.getOrdinamento().getValoreCommerciale().getPosizione()+ ",'"         
                +mod.getOrdinamento().getValoreCommerciale().isCrescente()+ "')");
          }catch(SQLException ex){ex.printStackTrace();}*/
     }
         
     
    public void setCriterio(CriterioRicerca criterio){
        
	    String areaGeografica = "";
	    int  annoEmissione = 0;
	    java.sql.Date  datainizio = new java.sql.Date(0);
	    java.sql.Date  datafine = new java.sql.Date(0);
		String zecca = "";
		int valoreNominale =0;
		String unita = "";
		float spessore =0;
		float peso =0;
		float dimensione =0;
		String bordo = "";
		String forma = "";
		String materiale = "";
		String descrizione = "";
		float valoreCommerciale =0;
		String grado = "proof";
		boolean presente =false;
		String nomeEnteEmettitore = "";
		
    	if(criterio!= null){
	    	 if(criterio.getNomeEnteEmettitore()!= null){
	          nomeEnteEmettitore=criterio.getNomeEnteEmettitore().getArg();
	    	 }
	    	 if(criterio.getAreaGeografica()!= null){
	          areaGeografica=criterio.getAreaGeografica().getArg();
	         }
	         if(criterio.getAnnoEmissione()!= null){
	          annoEmissione=criterio.getAnnoEmissione().getArg();
	         }
	         if(criterio.getDataInizio()!= null){
	          datainizio=criterio.getDataInizio().getArg();
	         }
	         if(criterio.getDataFine()!= null){
	          datafine=criterio.getDataFine().getArg();
	         }
	         if(criterio.getZecca()!= null){
	          zecca=criterio.getZecca().getArg();
	         }
	         if(criterio.getValoreNominale()!= null){
	          valoreNominale=criterio.getValoreNominale().getArg();
	         }
	         if(criterio.getUnita()!= null){
	          unita=criterio.getUnita().getArg();
	         }
	         if(criterio.getSpessore()!= null){
	          spessore=criterio.getSpessore().getArg();
	         }
	         if(criterio.getPeso()!= null){
	        	 peso=criterio.getPeso().getArg();
	         }
	          if(criterio.getDimensione()!= null){
	        	  dimensione=criterio.getDimensione().getArg();
	          }
	          if(criterio.getBordo()!= null){
	        	  bordo=criterio.getBordo().getArg();
	          }
	          if(criterio.getForma()!= null){
	        	  forma=criterio.getForma().getArg().toString();
	          }
	          if(criterio.getMateriale()!= null){
	        	  materiale=criterio.getMateriale().getArg();
	          }
	          if(criterio.getDescrizione()!= null){
	        	  descrizione=criterio.getDescrizione().getArg();
	          }
	          if(criterio.getValoreCommerciale()!= null){
	        	  valoreCommerciale=criterio.getValoreCommerciale().getArg();
	          }
	          if(criterio.getGrado()!= null){
	        	  grado=criterio.getGrado().getArg().toString();
	          }
	          if(criterio.getStato()!= null){
	        	  presente=criterio.getStato().getArg().isPresente();
	          }
	
	          String tipoClasseStatoM="";
	          String note="";
	            
	          if(criterio.getStato()!= null){
	            if(criterio.getStato().getArg().getNote() instanceof Cedibile){
	                tipoClasseStatoM="Cedibile";
	            }else if(criterio.getStato().getArg().getNote() instanceof DestinataA){
	                DestinataA sm=null;
	                tipoClasseStatoM="DestinataA";
	                sm=(DestinataA)criterio.getStato().getArg().getNote();
	                note=sm.getA();     
	            }else if(criterio.getStato().getArg().getNote() instanceof Virtuale){
	                Virtuale sm=null;
	                tipoClasseStatoM="Virtuale";
	                sm=(Virtuale)criterio.getStato().getArg().getNote();
	                note=sm.getNota();   
	            }else if(criterio.getStato().getArg().getNote() instanceof InCollezione){
	                InCollezione sm=null;
	                tipoClasseStatoM="InCollezione";
	                sm=(InCollezione)criterio.getStato().getArg().getNote();
	                note=sm.getLocazione();  
	            }
	          }
	          
	           try{
	                conn.createStatement().execute("DELETE FROM critric WHERE 1");
	           
	          }catch(SQLException ex){ex.printStackTrace();}
	          try{
	      
					
					conn.createStatement().execute("INSERT INTO critric VALUES('"
	                +nomeEnteEmettitore+ "','"
	                +areaGeografica+ "','"
	                +annoEmissione+ "','"
	                +datainizio+ "','"
	                +datafine+ "','"
	                +zecca+ "','"
	                +valoreNominale+ "','"
	                +unita+ "','"
	                +spessore+ "','"
	                +peso+ "','"
	                +dimensione+ "','"
	                +bordo+ "','"
	                +forma+ "','"
	                +materiale+ "','"
	                +descrizione+ "','"
	                +valoreCommerciale+ "','"
	                +grado+ "','"
	                +presente+ "','"
	                +tipoClasseStatoM+ "','"              
	                +note+ "')");
	          }catch(SQLException ex){ex.printStackTrace();}
	          try{
	                conn.createStatement().execute("DELETE FROM OPERATORE WHERE 1");
	           
	          }catch(SQLException ex){ex.printStackTrace();}
	           
	          try{
	        	  
	        	  
	        	    String insert = "INSERT INTO OPERATORE VALUES(";
	        	    if(criterio.getNomeEnteEmettitore()!= null){
	        	    	insert=insert+"'"+criterio.getNomeEnteEmettitore().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getAreaGeografica()!= null){
	        	    	insert=insert+"'"+criterio.getAreaGeografica().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getAnnoEmissione()!= null){
		        		   insert=insert+"'"+criterio.getAnnoEmissione().getOperatore().toString()+"',";
		        	   }else{insert=insert+"'uguale',";}
	        	    if(criterio.getDataInizio()!= null){
	        	    	insert=insert+"'"+criterio.getDataInizio().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getDataFine()!= null){
	        	    	insert=insert+"'"+criterio.getDataFine().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getZecca()!= null){
	        	    	insert=insert+"'"+criterio.getZecca().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getValoreNominale()!= null){
	        	    	insert=insert+"'"+criterio.getValoreNominale().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getUnita()!= null){
	        	    	insert=insert+"'"+criterio.getUnita().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getSpessore()!= null){
	        	    	insert=insert+"'"+criterio.getSpessore().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getPeso()!= null){
	        	    	insert=insert+"'"+criterio.getPeso().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getDimensione()!= null){
	        	    	insert=insert+"'"+criterio.getDimensione().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getBordo()!= null){
	        	    	insert=insert+"'"+criterio.getBordo().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getForma()!= null){
	        	    	insert=insert+"'"+criterio.getForma().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getMateriale()!= null){
	        	    	insert=insert+"'"+criterio.getMateriale().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getDescrizione()!= null){
	        	    	insert=insert+"'"+criterio.getDescrizione().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	    if(criterio.getValoreCommerciale()!= null){
	        	    	insert=insert+"'"+criterio.getValoreCommerciale().getOperatore().toString()+ "',";
	        	    }else{insert=insert+"'uguale',";}
	        	   if(criterio.getGrado()!= null){
	        		   insert=insert+"'"+criterio.getGrado().getOperatore().toString()+ "'," ; 
	        	   }else{insert=insert+"'uguale',";}
	        	   if(criterio.getStato()!= null){
	        		   insert=insert+"'"+criterio.getStato().getOperatore().toString()+"')";
	        	   }else{insert=insert+"'uguale')";}
	        	  
	        	  /**
	        	   * "INSERT INTO OPERATORE VALUES('"	
	                +criterio.getNomeEnteEmettitore().getOperatore().toString()+ "','"		
	                +criterio.getAreaGeografica().getOperatore().toString()+ "',"
	                +criterio.getDataInizio().getOperatore().toString()+ "','"
	                +criterio.getDataFine().getOperatore().toString()+ "','"
	                +criterio.getZecca().getOperatore().toString()+ "',"
	                +criterio.getValoreNominale().getOperatore().toString()+ ",'"
	                +criterio.getUnit�().getOperatore().toString()+ "',"
	                +criterio.getSpessore().getOperatore().toString()+ ","
	                +criterio.getPeso().getOperatore().toString()+ ","
	                +criterio.getDimensione().getOperatore().toString()+ ",'"
	                +criterio.getBordo().getOperatore().toString()+ "','"
	                +criterio.getForma().getOperatore().toString()+ "','"
	                +criterio.getMateriale().getOperatore().toString()+ "','"
	                +criterio.getDescrizione().getOperatore().toString()+ "',"
	                +criterio.getValoreCommerciale().getOperatore().toString()+ ",'"
	                +criterio.getGrado().getOperatore().toString()+ "',"            
	                +criterio.getStato().getOperatore().toString()+ "')"*/
	                conn.createStatement().execute(insert);
	          }catch(SQLException ex){ex.printStackTrace();}
    	}
         
     }
    
     public void Connessione(String database,String username,String password){
     /**Caricamento Driver**/
     try{ 
     Class.forName("org.h2.Driver");
    }catch (ClassNotFoundException ex){ex.printStackTrace();}
    
     /**Connessione database**/
     try{
    this.conn = DriverManager.getConnection("jdbc:h2:"+database,username,password);
     }catch (SQLException ex){ex.printStackTrace();}
    }
  
  public void ChiudiConnessione(){
        try {
            conn.close();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
  }


}

