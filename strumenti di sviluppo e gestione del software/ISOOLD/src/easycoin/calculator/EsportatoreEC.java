package easycoin.calculator;

import easycoin.datatype.*;
import easycoin.store.EnteEmettitore;
import easycoin.store.*;
import easycoin.temporary_store.*;
import java.util.Enumeration;

public class EsportatoreEC extends Esportatore {
    
    public EsportatoreEC() {
    	//super();
    }
    
     public String generaXmlEC(Info dati){
        
        String xml="<?xml version='1.0' encoding='UTF-8' ?>\n";
        xml+="<EasyCoin>\n";
        xml+="\t<Enti>\n";
        
        Info i=new Info();
        ParteSelezionata ps=new ParteSelezionata();
        ps.set(dati);

      for(Enumeration r = dati.getEnteEmettitoreH().elements(); r.hasMoreElements(); ){
          EnteEmettitore rr = (EnteEmettitore)r.nextElement();
          i=null;
          i=ps.infoCompletaEE(rr.getId());
      
        // xml+="\t<Enti>\n";
         for(Enumeration e = i.getEnteEmettitoreH().elements(); e.hasMoreElements(); ){
           EnteEmettitore o = (EnteEmettitore)e.nextElement();
        
           
            xml+="\t\t<EnteEmettitore>\n";
            xml+="\t\t<id_EE>"+o.getId().getId()+"</id_EE>\n";
            xml+="\t\t<nome_EE>"+o.getInfoEE().getNome()+"</nome_EE>\n";
            xml+="\t\t<nomeOriginale_EE>"+o.getInfoEE().getNomeOriginale()+"</nomeOriginale_EE>\n";
            xml+="\t\t<areaGeografica_EE>"+o.getInfoEE().getAreaGeografica()+"</areaGeografica_EE>\n";
            xml+="\t\t<dataInizio_EE>"+o.getInfoEE().getDataInizio().toString()+"</dataInizio_EE>\n";
            xml+="\t\t<dataFine_EE>"+o.getInfoEE().getDataFine().toString()+"</dataFine_EE>\n";
            xml+="\t\t<note_EE>"+o.getInfoEE().getNote()+"</note_EE>\n";
            xml+="\t\t</EnteEmettitore>\n";
            }
          //    xml+="\t</Enti>\n"; 
            xml+="\t<Tipi>\n";
           for(Enumeration b = i.getTipoH().elements(); b.hasMoreElements(); ){
                Tipo c = (Tipo)b.nextElement();     
                    xml+="\t\t<Tipo>\n";
                    xml+="\t\t<id_T>"+c.getId().getId()+"</id_T>\n";
                    xml+="\t\t<unita_T>"+c.getUnita().getId()+"</unita_T>\n";
                    xml+="\t\t<enteEmettitore_T>"+c.getEnteEmettitore().getId()+"</enteEmettitore_T>\n";
                    xml+="\t\t<parteIntera_T>"+c.getInfoTipoMoneta().getVnom().getParteIntera()+"</parteIntera_T>\n";
                    xml+="\t\t<numeratore_T>"+c.getInfoTipoMoneta().getVnom().getNumeratore()+"</numeratore_T>\n";
                    xml+="\t\t<denominatore_T>"+c.getInfoTipoMoneta().getVnom().getDenominatore()+"</denominatore_T>\n";
                    xml+="\t\t<descrizione_T>"+c.getInfoTipoMoneta().getDescrizione()+"</descrizione_T>\n";
                    xml+="\t\t<spessore_T>"+c.getInfoTipoMoneta().getSpessore()+"</spessore_T>\n";
                    xml+="\t\t<peso_T>"+c.getInfoTipoMoneta().getPeso()+"</peso_T>\n";
                    xml+="\t\t<dimensione_T>"+c.getInfoTipoMoneta().getDimensione()+"</dimensione_T>\n";
                    xml+="\t\t<forma_T>"+c.getInfoTipoMoneta().getForma().toString()+"</forma_T>\n";
                    xml+="\t\t<bordo_T>"+c.getInfoTipoMoneta().getBordo()+"</bordo_T>\n";
                    xml+="\t\t<materiale_T>"+c.getInfoTipoMoneta().getMateriale()+"</materiale_T>\n";
                    xml+="\t\t<nota_T>"+c.getInfoTipoMoneta().getNota()+"</nota_T>\n";
                    xml+="\t\t</Tipo>\n";

            }
            xml+="\t</Tipi>\n";
            xml+="\t<Zecche>\n";
            for(Enumeration b = i.getZeccaH().elements(); b.hasMoreElements(); ){
                Zecca c = (Zecca)b.nextElement(); 
                 xml+="\t\t<Zecca>\n";
                 xml+="\t\t<id_Z>"+c.getId().getId()+"</id_Z>\n";
                 xml+="\t\t<sigla_Z>"+c.getInfoZ().getSigla()+"</sigla_Z>\n";
                 xml+="\t\t<descrizione_Z>"+c.getInfoZ().getDescrizione()+"</descrizione_Z>\n";
                 xml+="\t\t<enteEmettitore_Z>"+c.getEnteEmettitore().getId()+"</enteEmettitore_Z>\n";
                 xml+="\t\t</Zecca>\n";
             }
             xml+="\t</Zecche>\n";
             xml+="\t<Emissioni>\n";
              for(Enumeration b = i.getEmissioneH().elements(); b.hasMoreElements(); ){
                Emissione c = (Emissione)b.nextElement();             
                xml+="\t\t<Emissione>\n";
                xml+="\t\t<id_E>"+c.getId().getId()+"</id_E>\n";
                xml+="\t\t<tipo_E>"+c.getTipo().getId()+"</tipo_E>\n";
                xml+="\t\t<zecca_E>"+c.getZecca().getId()+"</zecca_E>\n";
                xml+="\t\t<anno_E>"+c.getInfoE().getAnno()+"</anno_E>\n";
                xml+="\t\t<note_E>"+c.getInfoE().getNote()+"</note_E>\n";
               xml+="\t\t</Emissione>\n";
              }
            xml+="\t</Emissioni>\n";
            /*
            xml+="\t<Monete>\n";
            for(Enumeration b = i.getMonetaH().elements(); b.hasMoreElements(); ){
                Moneta c = (Moneta)b.nextElement();
                String note="";
                xml+="\t\t<Moneta>\n";
                xml+="\t\t<id_M>"+c.getId().getId()+"</id_M>\n";
                xml+="\t\t<emissione_M>"+c.getEmissione().getId()+"</emissione_M>\n";
                xml+="\t\t<grado_M>"+c.getInfoM().getGrado().toString()+"</grado_M>\n";
                xml+="\t\t<presente_M>"+c.getInfoM().getStato().isPresente()+"</presente_M>\n";
                
                if(c.getInfoM().getStato().getNote() instanceof Cedibile){
                    xml+="\t\t<tipoClasseStatoM_M>"+"Cedibile"+"</tipoClasseStatoM_M>\n";
                    xml+="\t\t<note_M>"+""+"</note_M>\n";
             
                }else if(c.getInfoM().getStato().getNote() instanceof DestinataA){
                    DestinataA sm=null;
                    xml+="\t\t<tipoClasseStatoM_M>"+"DestinataA"+"</tipoClasseStatoM_M>\n";
                    sm=(DestinataA)c.getInfoM().getStato().getNote();
                    note=sm.getA();
                    xml+="\t\t<note_M>"+note+"</note_M>\n";
                }else if(c.getInfoM().getStato().getNote() instanceof Virtuale){
                    Virtuale sm=null;
                    xml+="<tipoClasseStatoM_M>"+"Virtuale"+"</tipoClasseStatoM_M>\n";
                    sm=(Virtuale)c.getInfoM().getStato().getNote();
                    note=sm.getNota();
                    xml+="\t\t<note_M>"+note+"</note_M>\n";
                }else if(c.getInfoM().getStato().getNote() instanceof InCollezione){
                    InCollezione sm=null;
                    xml+="<tipoClasseStatoM_M>"+"InCollezione"+"</tipoClasseStatoM_M>\n";
                    sm=(InCollezione)c.getInfoM().getStato().getNote();
                    note=sm.getLocazione();  
                    xml+="\t\t<note_M>"+note+"</note_M>\n";
                }                 
                xml+="\t\t<valoreCommerciale_M>"+c.getInfoM().getValoreCommerciale()+"</valoreCommerciale_M>\n";
                xml+="\t\t</Moneta>\n";
            }
            xml+="\t</Monete>\n";
             */
            xml+="\t<SistemiMonetari>\n";
            for(Enumeration b = i.getSistemaMonetarioH().elements(); b.hasMoreElements(); ){
                SistemaMonetario c = (SistemaMonetario)b.nextElement();
                xml+="\t\t<SistemaMonetario>\n";
                xml+="\t\t<id_SM>"+c.getId().getId()+"</id_SM>\n";
                xml+="\t\t<enteEmettitore_SM>"+c.getEnteEmettitore().getId()+"</enteEmettitore_SM>\n";
                xml+="\t\t<nome_SM>"+c.getInfoSM().getNome()+"</nome_SM>\n";
                xml+="\t\t<nomeO_SM>"+c.getInfoSM().getNomeOriginale()+"</nomeO_SM>\n";
                xml+="\t\t</SistemaMonetario>\n";
            }
            xml+="\t</SistemiMonetari>\n";
            xml+="\t<UnitaS>\n";
            for(Enumeration b = i.getUnitaH().elements(); b.hasMoreElements(); ){
                Unita c = (Unita)b.nextElement();
            xml+="\t\t<Unita>\n";
            xml+="\t\t<id_S>"+c.getId().getId()+"</id_S>\n";
            xml+="\t\t<sistemaMonetario_S>"+c.getSistemaMonetario().getId()+"</sistemaMonetario_S>\n";
            xml+="\t\t<nome_S>"+c.getInfoU().getNome()+"</nome_S>\n";
            xml+="\t\t<nomeOriginale_S>"+c.getInfoU().getNomeOriginale()+"</nomeOriginale_S>\n";
            xml+="\t\t<fattoreMolteciplita_S>"+c.getInfoU().getFattoreMonteplicita()+"</fattoreMolteciplita_S>\n";
            xml+="\t\t</Unita>\n";
            }
            xml+="\t</UnitaS>\n";
            
      }
      xml+="\t</Enti>\n"; 
      xml+="</EasyCoin>\n";
     return xml;
    }

      public String generaXml(Info dati){
        
        String xml="<?xml version='1.0' encoding='UTF-8' ?>\n";
        xml+="<EasyCoin>\n";
        xml+="\t<Enti>\n";
        
        Info i=new Info();
        ParteSelezionata ps=new ParteSelezionata();
        ps.set(dati);

      for(Enumeration r = dati.getEnteEmettitoreH().elements(); r.hasMoreElements(); ){
          EnteEmettitore rr = (EnteEmettitore)r.nextElement();
          i=null;
          i=ps.infoCompletaEE(rr.getId());
      
        // xml+="\t<Enti>\n";
         for(Enumeration e = i.getEnteEmettitoreH().elements(); e.hasMoreElements(); ){
           EnteEmettitore o = (EnteEmettitore)e.nextElement();
        
           
            xml+="\t\t<EnteEmettitore>\n";
            xml+="\t\t<id_EE>"+o.getId().getId()+"</id_EE>\n";
            xml+="\t\t<nome_EE>"+o.getInfoEE().getNome()+"</nome_EE>\n";
            xml+="\t\t<nomeOriginale_EE>"+o.getInfoEE().getNomeOriginale()+"</nomeOriginale_EE>\n";
            xml+="\t\t<areaGeografica_EE>"+o.getInfoEE().getAreaGeografica()+"</areaGeografica_EE>\n";
            xml+="\t\t<dataInizio_EE>"+o.getInfoEE().getDataInizio().toString()+"</dataInizio_EE>\n";
            xml+="\t\t<dataFine_EE>"+o.getInfoEE().getDataFine().toString()+"</dataFine_EE>\n";
            xml+="\t\t<note_EE>"+o.getInfoEE().getNote()+"</note_EE>\n";
            xml+="\t\t</EnteEmettitore>\n";
            }
          //    xml+="\t</Enti>\n"; 
            xml+="\t<Tipi>\n";
           for(Enumeration b = i.getTipoH().elements(); b.hasMoreElements(); ){
                Tipo c = (Tipo)b.nextElement();     
                    xml+="\t\t<Tipo>\n";
                    xml+="\t\t<id_T>"+c.getId().getId()+"</id_T>\n";
                    xml+="\t\t<unita_T>"+c.getUnita().getId()+"</unita_T>\n";
                    xml+="\t\t<enteEmettitore_T>"+c.getEnteEmettitore().getId()+"</enteEmettitore_T>\n";
                    xml+="\t\t<parteIntera_T>"+c.getInfoTipoMoneta().getVnom().getParteIntera()+"</parteIntera_T>\n";
                    xml+="\t\t<numeratore_T>"+c.getInfoTipoMoneta().getVnom().getNumeratore()+"</numeratore_T>\n";
                    xml+="\t\t<denominatore_T>"+c.getInfoTipoMoneta().getVnom().getDenominatore()+"</denominatore_T>\n";
                    xml+="\t\t<descrizione_T>"+c.getInfoTipoMoneta().getDescrizione()+"</descrizione_T>\n";
                    xml+="\t\t<spessore_T>"+c.getInfoTipoMoneta().getSpessore()+"</spessore_T>\n";
                    xml+="\t\t<peso_T>"+c.getInfoTipoMoneta().getPeso()+"</peso_T>\n";
                    xml+="\t\t<dimensione_T>"+c.getInfoTipoMoneta().getDimensione()+"</dimensione_T>\n";
                    xml+="\t\t<forma_T>"+c.getInfoTipoMoneta().getForma().toString()+"</forma_T>\n";
                    xml+="\t\t<bordo_T>"+c.getInfoTipoMoneta().getBordo()+"</bordo_T>\n";
                    xml+="\t\t<materiale_T>"+c.getInfoTipoMoneta().getMateriale()+"</materiale_T>\n";
                    xml+="\t\t<nota_T>"+c.getInfoTipoMoneta().getNota()+"</nota_T>\n";
                    xml+="\t\t</Tipo>\n";

            }
            xml+="\t</Tipi>\n";
            xml+="\t<Zecche>\n";
            for(Enumeration b = i.getZeccaH().elements(); b.hasMoreElements(); ){
                Zecca c = (Zecca)b.nextElement(); 
                 xml+="\t\t<Zecca>\n";
                 xml+="\t\t<id_Z>"+c.getId().getId()+"</id_Z>\n";
                 xml+="\t\t<sigla_Z>"+c.getInfoZ().getSigla()+"</sigla_Z>\n";
                 xml+="\t\t<descrizione_Z>"+c.getInfoZ().getDescrizione()+"</descrizione_Z>\n";
                 xml+="\t\t<enteEmettitore_Z>"+c.getEnteEmettitore().getId()+"</enteEmettitore_Z>\n";
                 xml+="\t\t</Zecca>\n";
             }
             xml+="\t</Zecche>\n";
             xml+="\t<Emissioni>\n";
              for(Enumeration b = i.getEmissioneH().elements(); b.hasMoreElements(); ){
                Emissione c = (Emissione)b.nextElement();             
                xml+="\t\t<Emissione>\n";
                xml+="\t\t<id_E>"+c.getId().getId()+"</id_E>\n";
                xml+="\t\t<tipo_E>"+c.getTipo().getId()+"</tipo_E>\n";
                xml+="\t\t<zecca_E>"+c.getZecca().getId()+"</zecca_E>\n";
                xml+="\t\t<anno_E>"+c.getInfoE().getAnno()+"</anno_E>\n";
                xml+="\t\t<note_E>"+c.getInfoE().getNote()+"</note_E>\n";
               xml+="\t\t</Emissione>\n";
              }
            xml+="\t</Emissioni>\n";
            xml+="\t<Monete>\n";
            for(Enumeration b = i.getMonetaH().elements(); b.hasMoreElements(); ){
                Moneta c = (Moneta)b.nextElement();
                String note="";
                xml+="\t\t<Moneta>\n";
                xml+="\t\t<id_M>"+c.getId().getId()+"</id_M>\n";
                xml+="\t\t<emissione_M>"+c.getEmissione().getId()+"</emissione_M>\n";
                xml+="\t\t<grado_M>"+c.getInfoM().getGrado().toString()+"</grado_M>\n";
                xml+="\t\t<presente_M>"+c.getInfoM().getStato().isPresente()+"</presente_M>\n";
                
                if(c.getInfoM().getStato().getNote() instanceof Cedibile){
                    xml+="\t\t<tipoClasseStatoM_M>"+"Cedibile"+"</tipoClasseStatoM_M>\n";
                    xml+="\t\t<note_M>"+""+"</note_M>\n";
                }else if(c.getInfoM().getStato().getNote() instanceof DestinataA){
                    DestinataA sm=null;
                    xml+="\t\t<tipoClasseStatoM_M>"+"DestinataA"+"</tipoClasseStatoM_M>\n";
                    sm=(DestinataA)c.getInfoM().getStato().getNote();
                    note=sm.getA();
                    xml+="\t\t<note_M>"+note+"</note_M>\n";
                }else if(c.getInfoM().getStato().getNote() instanceof Virtuale){
                    Virtuale sm=null;
                    xml+="<tipoClasseStatoM_M>"+"Virtuale"+"</tipoClasseStatoM_M>\n";
                    sm=(Virtuale)c.getInfoM().getStato().getNote();
                    note=sm.getNota();
                    xml+="\t\t<note_M>"+note+"</note_M>\n";
                }else if(c.getInfoM().getStato().getNote() instanceof InCollezione){
                    InCollezione sm=null;
                    xml+="<tipoClasseStatoM_M>"+"InCollezione"+"</tipoClasseStatoM_M>\n";
                    sm=(InCollezione)c.getInfoM().getStato().getNote();
                    note=sm.getLocazione();  
                    xml+="\t\t<note_M>"+note+"</note_M>\n";
                }                 
                xml+="\t\t<valoreCommerciale_M>"+c.getInfoM().getValoreCommerciale()+"</valoreCommerciale_M>\n";
                xml+="\t\t</Moneta>\n";
            }
            xml+="\t</Monete>\n";
            xml+="\t<SistemiMonetari>\n";
            for(Enumeration b = i.getSistemaMonetarioH().elements(); b.hasMoreElements(); ){
                SistemaMonetario c = (SistemaMonetario)b.nextElement();
                xml+="\t\t<SistemaMonetario>\n";
                xml+="\t\t<id_SM>"+c.getId().getId()+"</id_SM>\n";
                xml+="\t\t<enteEmettitore_SM>"+c.getEnteEmettitore().getId()+"</enteEmettitore_SM>\n";
                xml+="\t\t<nome_SM>"+c.getInfoSM().getNome()+"</nome_SM>\n";
                xml+="\t\t<nomeO_SM>"+c.getInfoSM().getNomeOriginale()+"</nomeO_SM>\n";
                xml+="\t\t</SistemaMonetario>\n";
            }
            xml+="\t</SistemiMonetari>\n";
            xml+="\t<UnitaS>\n";
            for(Enumeration b = i.getUnitaH().elements(); b.hasMoreElements(); ){
                Unita c = (Unita)b.nextElement();
            xml+="\t\t<Unita>\n";
            xml+="\t\t<id_S>"+c.getId().getId()+"</id_S>\n";
            xml+="\t\t<sistemaMonetario_S>"+c.getSistemaMonetario().getId()+"</sistemaMonetario_S>\n";
            xml+="\t\t<nome_S>"+c.getInfoU().getNome()+"</nome_S>\n";
            xml+="\t\t<nomeOriginale_S>"+c.getInfoU().getNomeOriginale()+"</nomeOriginale_S>\n";
            xml+="\t\t<fattoreMolteciplita_S>"+c.getInfoU().getFattoreMonteplicita()+"</fattoreMolteciplita_S>\n";
            xml+="\t\t</Unita>\n";
            }
            xml+="\t</UnitaS>\n";
            
      }
      xml+="\t</Enti>\n"; 
      xml+="</EasyCoin>\n";
     return xml;
    }
}
    

