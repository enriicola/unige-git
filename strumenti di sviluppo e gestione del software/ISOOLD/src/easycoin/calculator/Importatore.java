package easycoin.calculator;

import java.io.File;
import java.sql.Date;
import java.util.Hashtable;
import easycoin.datatype.FilePath;
import easycoin.datatype.*;
import easycoin.store.*;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;
import easycoin.enumeration.*;

public class Importatore {
	
    private Info i=new Info();
    private Hashtable enteEmettitore;
    //int kee=0;
    private Hashtable Zecca;
    //int kz=0;
    private Hashtable SistemiMonetari;
    //int ksm=0;
    private Hashtable Unita;
    //int ku=0;
    private Hashtable tipoMoneta;
    //int kt=0;
    private Hashtable Emissione;
   //int ke=0;
    //private Hashtable Moneta;
    //int km=0;
	
//	<<create>> mkImportatore()
    public Importatore() {}

    public Info importaEC(String filename){
    	//String filename = f.getPath();
		try {
			
			SAXParserFactory factory = SAXParserFactory.newInstance();
			SAXParser saxParser = factory.newSAXParser();
		
		DefaultHandler handler = new DefaultHandler() {
		         // Variabile per ogni tag
			//ENTI EMETTITORI
			boolean enti = false;
			boolean ente = false;
			boolean idEE = false;
			boolean nomeEE = false;
			boolean nomeOrigEE = false;
			boolean areaGeogEE = false;
			boolean dataIEE = false;
			boolean dataFEE = false;
			boolean noteEE = false;
			//*
			//TIPI MONETE
			boolean tipi = false;
			boolean tipo = false;
			boolean idT = false;
			boolean unitaT =false;
			boolean enteT = false;
			boolean parteInteraT = false;
			boolean numeratoreT = false;
			boolean denominatoreT = false;
			boolean descrizioneT = false;
			boolean spessoreT = false;
			boolean pesoT = false;
			boolean dimensioneT = false;
			boolean formaT = false;
			boolean bordoT = false;
			boolean materialeT = false;
			boolean notaT = false;
			//**
			//ZECCHE
			boolean zecche = false;
			boolean zecca = false;
			boolean idZ = false;
			boolean idEEZ = false;
			boolean siglaZ = false;
			boolean descrZ = false;
			//***
			//SISTEMI MONETARI
			boolean sistemi = false;
			boolean sistema = false;
			boolean idSM = false;
			boolean nomeSM = false;
			boolean nomeOrigSM = false;
			boolean idEESM = false;
			//****
			//UNITA'
			boolean leunita= false;
			boolean unita = false;
			boolean idU = false;
			boolean nomeU = false;
			boolean nomeOrigU = false;
			boolean fattMoltU = false;
			boolean idSMU = false;
			//*****
			//EMISSIONI
			boolean emissioni=false;
			boolean emissione = false;
			boolean idE = false;
			boolean tipoE =false;
			boolean zeccaE = false;
			boolean annoE = false;
			boolean noteE = false;
			//******
			
			EnteEmettitore ee;
			InfoEnteEmettitore iEE;
			Zecca z;
			InfoZecca iZ;
			SistemaMonetario sm;
			InfoSistemaMonetario iSM;
			Unita u;
			InfoUnita iU;
			Tipo tm;
			InfoTipoMoneta iTM;
			Emissione e;
			InfoEmissione iE;
		
			public void startElement(String uri, String localName,String qName, Attributes attributes) throws SAXException {
                                //ENTI EMETTITORI
				if (qName.equalsIgnoreCase("Enti")) {
					enti = true;
				}
				if (qName.equalsIgnoreCase("EnteEmettitore")) {
					ente = true;
				}
				if (qName.equalsIgnoreCase("id_EE")) {
					idEE = true;
				}
			  	if (qName.equalsIgnoreCase("nome_EE")) {
			  		nomeEE = true;
			  	}
			  	if (qName.equalsIgnoreCase("nomeOriginale_EE")) {
			  		nomeOrigEE = true;
			  	}
			  	if (qName.equalsIgnoreCase("areaGeografica_EE")) {
			  		areaGeogEE = true;
			  	}
			  	if (qName.equalsIgnoreCase("dataInizio_EE")) {
			  		dataIEE = true;
			  	}
			  	if (qName.equalsIgnoreCase("dataFine_EE")) {
			  		dataFEE = true;
			  	}
			  	if (qName.equalsIgnoreCase("note_EE")) {
			  		noteEE = true;
			  	}
			  	//*
			  	//TIPI MONETE
			  	if (qName.equalsIgnoreCase("Tipi")) {
			  		tipi = true;
			  	}
			  	if (qName.equalsIgnoreCase("Tipo")) {
			  		tipo = true;
			  	}
			  	if (qName.equalsIgnoreCase("id_T")) {
			  		idT = true;
			  	}
				if (qName.equalsIgnoreCase("unita_T")) {
					unitaT = true;
				}
				if (qName.equalsIgnoreCase("enteEmettitore_T")) {
					enteT = true;
				}
			  	if (qName.equalsIgnoreCase("parteIntera_T")) {
			  		parteInteraT = true;
			  	}
			  	if (qName.equalsIgnoreCase("numeratore_T")) {
			  		numeratoreT = true;
			  	}
			  	if (qName.equalsIgnoreCase("denominatore_T")) {
			  		denominatoreT = true;
			  	}
			  	if (qName.equalsIgnoreCase("descrizione_T")) {
			  		descrizioneT = true;
			  	}
			  	if (qName.equalsIgnoreCase("spessore_T")) {
			  		spessoreT = true;
			  	}
			  	if (qName.equalsIgnoreCase("peso_T")) {
			  		pesoT = true;
			  	}
			  	if (qName.equalsIgnoreCase("dimensione_T")) {
			  		dimensioneT = true;
			  	}
			  	if (qName.equalsIgnoreCase("forma_T")) {
			  		formaT = true;
			  	}
			  	if (qName.equalsIgnoreCase("bordo_T")) {
			  		bordoT = true;
			  	}
			  	if (qName.equalsIgnoreCase("materiale_T")) {
			  		materialeT = true;
			  	}
			  	if (qName.equalsIgnoreCase("nota_T")) {
			  		notaT = true;
			  	}
			  	//**
			  	//ZECCHE
			  	if (qName.equalsIgnoreCase("Zecche")) {
			  		zecche = true;
				}
				if (qName.equalsIgnoreCase("Zecca")) {
					zecca = true;
				}
				if (qName.equalsIgnoreCase("id_Z")) {
					idZ = true;
				}
			  	if (qName.equalsIgnoreCase("sigla_Z")) {
			  		siglaZ = true;
			  	}
			  	if (qName.equalsIgnoreCase("descrizione_Z")) {
			  		descrZ = true;
			  	}
			  	if (qName.equalsIgnoreCase("enteEmettitore_Z")) {
			  		idEEZ = true;
			  	}
			  	//***
			  	//SISTEMI MONETARI
			  	if (qName.equalsIgnoreCase("SistemiMonetari")) {
			  		sistemi = true;
				}
				if (qName.equalsIgnoreCase("SistemaMonetario")) {
					sistema = true;
				}
				if (qName.equalsIgnoreCase("id_SM")) {
					idSM = true;
				}
			  	if (qName.equalsIgnoreCase("enteEmettitore_SM")) {
			  		idEESM = true;
			  	}
			  	if (qName.equalsIgnoreCase("nome_SM")) {
			  		nomeSM = true;
			  	}
			  	if (qName.equalsIgnoreCase("nomeO_SM")) {
			  		nomeOrigSM = true;
			  	}
			  	//****
			  	//UNITA'
				if (qName.equalsIgnoreCase("UnitaS")) {
					leunita = true;
				}
			  	if (qName.equalsIgnoreCase("Unita")) {
			  		unita = true;
			  	}
			  	if (qName.equalsIgnoreCase("id_S")) {
			  		idU = true;
			  	}
			  	if (qName.equalsIgnoreCase("sistemaMonetario_S")) {
			  		idSMU = true;
			  	}
			  	if (qName.equalsIgnoreCase("nome_S")) {
			  		nomeU = true;
			  	}
			  	if (qName.equalsIgnoreCase("nomeOriginale_S")) {
			  		nomeOrigU = true;
			  	}
			  	if (qName.equalsIgnoreCase("fattoreMolteciplita_S")) {
			  		fattMoltU = true;
			  	}
			  	//*****
			  	//EMISSIONI
			  	if (qName.equalsIgnoreCase("Emissioni")) {
			  		emissioni = true;
				}
				if (qName.equalsIgnoreCase("Emissione")) {
					emissione = true;
				}
				if (qName.equalsIgnoreCase("id_E")){
					idE=true;
				}
				if (qName.equalsIgnoreCase("tipo_E")) {
					tipoE = true;
				}
			  	if (qName.equalsIgnoreCase("zecca_E")) {
			  		zeccaE = true;
			  	}
			  	if (qName.equalsIgnoreCase("anno_E")) {
			  		annoE = true;
			  	}
			  	if (qName.equalsIgnoreCase("note_E")) {
			  		noteE = true;
			  	}
			  	//******
			}
			
			public void characters(char ch[], int start, int length) throws SAXException {
				int parteInt=0;
				int num=0;
				int den=0;
				//ENTI EMETTITORI
				if (enti) {
					enteEmettitore =new Hashtable();
                                        tipoMoneta =new Hashtable();
                                        Zecca =new Hashtable();
                                        SistemiMonetari =new Hashtable();
                                        Unita =new Hashtable();
                                        Emissione =new Hashtable();
					enti = false;
				}
				if (ente) {
					ee =new EnteEmettitore();
					iEE=new InfoEnteEmettitore();
					ente = false;
				}
				if (idEE) {
					ee.setId(new Id(new String(ch, start, length)));
					idEE = false;
				}
				if (nomeEE) {
					iEE.setNome(new String(ch, start, length));
					nomeEE = false;
			    }
				if (nomeOrigEE) {
					iEE.setNomeOriginale(new String(ch, start, length));
					nomeOrigEE = false;
			    }
				if (areaGeogEE) {
					iEE.setAreaGeografica(new String(ch, start, length));
					areaGeogEE = false;
			    }
				if (dataIEE) {
					iEE.setDataInizio( Date.valueOf(new String(ch, start, length)));
					dataIEE = false;
			    }
				if (dataFEE) {
					iEE.setDataFine( Date.valueOf(new String(ch, start, length)));
					dataFEE = false;
			    }
				if (noteEE) {
					iEE.setNote(new String(ch, start, length));
					noteEE = false;
			    }
				//*
				//TIPI MONETE
				if (tipi) {
					//tipoMoneta =new Hashtable();
					tipi = false;
				}
				if (tipo) {
					tm =new Tipo();
					iTM=new InfoTipoMoneta();
					tipo = false;
				}
				if (idT) {
					tm.setId(new Id(new String(ch, start, length)));
					idT = false;
				}
				if (unitaT) {
					tm.setUnita(new Id(new String(ch, start, length)));
					unitaT = false;
			    }
				if (enteT) {
					tm.setEnteEmettitore(new Id(new String(ch, start, length)));
					enteT = false;
			    }
				if (parteInteraT) {
					parteInt=new Integer(new String(ch, start, length)).intValue();
					parteInteraT = false;
			    }
				if (numeratoreT) {
					num=new Integer(new String(ch, start, length)).intValue();
					numeratoreT = false;
			    }
				if (denominatoreT) {
					den=new Integer(new String(ch, start, length)).intValue();
					iTM.setVnom(new ValoreNominale(parteInt,num,den));
					denominatoreT = false;
			    }
				if (descrizioneT) {
					iTM.setDescrizione(new String(ch, start, length));
					descrizioneT = false;
			    }
				if (spessoreT) {
					iTM.setSpessore(new Float(new String(ch, start, length)).floatValue());
					spessoreT = false;
			    }
				if (pesoT) {
					iTM.setPeso(new Float(new String(ch, start, length)).floatValue());
					pesoT = false;
			    }
				if (dimensioneT) {
					iTM.setDimensione(new Float(new String(ch, start, length)).floatValue());
					dimensioneT = false;
			    }
				if (formaT) {
					iTM.setForma(Forma.valueOf(new String(ch, start, length)));
					formaT = false;
			    }
				
				if (bordoT) {
					iTM.setBordo(new String(ch, start, length));
					bordoT = false;
			    }
				if (materialeT) {
					iTM.setMateriale(new String(ch, start, length));
					materialeT = false;
			    }
				if (notaT) {
					iTM.setNota(new String(ch, start, length));
					notaT = false;
			    }
				//**
				//ZECCHE
				if (zecche) {
					//Zecca =new Hashtable();
					zecche = false;
				}
				if (zecca) {
					z =new Zecca();
					iZ=new InfoZecca();
					zecca = false;
				}
				if (idZ) {
					z.setId(new Id(new String(ch, start, length)));
					idZ = false;
				}
				if (idEEZ) {
					z.setEnteEmettitore(new Id(new String(ch, start, length)));
					idEEZ = false;
			    }
				if (siglaZ) {
					iZ.setSigla(new String(ch, start, length));
					siglaZ = false;
			    }
				if (descrZ) {
					iZ.setDescrizione(new String(ch, start, length));
					descrZ = false;
			    }
				//***
				//SISTEMI MONETARI
				if (sistemi) {
					//SistemiMonetari =new Hashtable();
					sistemi = false;
				}
				if (sistema) {
					sm =new SistemaMonetario();
					iSM=new InfoSistemaMonetario();
					sistema = false;
				}
				if (idSM) {
					sm.setId(new Id(new String(ch, start, length)));
					idSM = false;
				}
				if (idEESM) {
					sm.setEnteEmettitore(new Id(new String(ch, start, length)));
					idEESM = false;
			    }
				if (nomeSM) {
					iSM.setNome(new String(ch, start, length));
					nomeSM = false;
			    }
				if (nomeOrigSM) {
					iSM.setNomeOriginale(new String(ch, start, length));
					nomeOrigSM = false;
			    }
				//****
				//UNITA
				if (leunita) {
					//Unita =new Hashtable();
					leunita = false;
				}
				if (unita) {
					u =new Unita();
					iU=new InfoUnita();
					unita = false;
				}
				if (idU) {
					u.setId(new Id(new String(ch, start, length)));
					idU = false;
				}
				if (idSMU) {
					u.setSistemaMonetario(new Id(new String(ch, start, length)));
					idSMU = false;
			    }
				if (nomeU) {
					iU.setNome(new String(ch, start, length));
					nomeU = false;
			    }
				if (nomeOrigU) {
					iU.setNomeOriginale(new String(ch, start, length));
					nomeOrigU = false;
			    }
				if (fattMoltU) {
					iU.setFattoreMonteplicita(new Float(new String(ch, start, length)).floatValue());
					fattMoltU = false;
			    }
				//*****
				//EMISSIONI
				if (emissioni) {
					//Emissione =new Hashtable();
					emissioni = false;
				}
				if (emissione) {
					e =new Emissione();
					iE=new InfoEmissione();
					emissione = false;
				}
				if (idE) {
					e.setId(new Id(new String(ch, start, length)));
					idE = false;
				}
				if (tipoE) {
					e.setTipo(new Id(new String(ch, start, length)));
					tipoE = false;
			    }
				if (zeccaE) {
					e.setZecca(new Id(new String(ch, start, length)));
					zeccaE = false;
			    }
				if (annoE) {
					iE.setAnno(new Integer(new String(ch, start, length)).intValue());
					annoE = false;
			    }
				if (noteE) {
					iE.setNote(new String(ch, start, length));
					noteE = false;
			    }
				//******
			}
			
		    @SuppressWarnings("unchecked")
			public void endElement(String namespaceURI,String sName,String qName) throws SAXException
		    {
				//ENTI EMETTITORI
				if (qName.equalsIgnoreCase("Enti")) {
					i.setEnteEmettitoreH(enteEmettitore);
                                        
                                        i.setTipoH(tipoMoneta);
                                        i.setZeccaH(Zecca);
                                        i.setSistemaMonetarioH(SistemiMonetari);
                                        i.setUnitaH(Unita);
                                        i.setEmissioneH(Emissione);
				}
				if (qName.equalsIgnoreCase("EnteEmettitore")) {
					ee.setInfoEE(iEE);
					enteEmettitore.put(ee.getId().getId(), ee);
					
				}
			  	//*
			  	//TIPI MONETE
			  	if (qName.equalsIgnoreCase("Tipi")) {
			  		//i.setTipoH(tipoMoneta);
			  	}
			  	if (qName.equalsIgnoreCase("Tipo")) {
			  		tm.setInfoTipoMoneta(iTM);
			  		tipoMoneta.put(tm.getId().getId(), tm);
			  		
			  	}
			  	//**
			  	//ZECCHE
			  	if (qName.equalsIgnoreCase("Zecche")) {
			  		//i.setZeccaH(Zecca);
				}
				if (qName.equalsIgnoreCase("Zecca")) {
					z.setInfoZ(iZ);
					Zecca.put(z.getId().getId(), z);
					
				}
			  	//***
			  	//SISTEMI MONETARI
			  	if (qName.equalsIgnoreCase("SistemiMonetari")) {
			  		//i.setSistemaMonetarioH(SistemiMonetari);
				}
				if (qName.equalsIgnoreCase("SistemaMonetario")) {
					sm.setInfoSM(iSM);
					SistemiMonetari.put(sm.getId().getId(), sm);
					
				}
			  	//****
			  	//UNITA'
				if (qName.equalsIgnoreCase("UnitaS")) {
					//i.setUnitaH(Unita);
				}
			  	if (qName.equalsIgnoreCase("Unita")) {
			  		u.setInfoU(iU);
			  		Unita.put(u.getId().getId(), u);
			  		
			  	}
			  	//*****
			  	//EMISSIONI
			  	if (qName.equalsIgnoreCase("Emissioni")) {
			  		//i.setEmissioneH(Emissione);
				}
				if (qName.equalsIgnoreCase("Emissione")) {
					e.setInfoE(iE);
					Emissione.put(e.getId().getId(), e);
					
				}
			  	//******
		    }
			};

		  saxParser.parse(new File(filename), handler);
		
		} catch (Exception e) {
		  e.printStackTrace();
		}
                @SuppressWarnings("unused")
				EnteEmettitore rrr=(EnteEmettitore)i.getEnteEmettitoreH().get(19);
                
        return i;

    }

    public Info importaM(FilePath f){
		//String filename = f.getPath();
		return i;
      }
}
