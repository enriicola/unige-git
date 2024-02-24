package easycoin.calculator;

import easycoin.store.*;
import easycoin.temporary_store.ParteSelezionata;
import java.io.*;
import java.util.Enumeration;

public class EsportatoreTesto extends Esportatore {
    
    /** Creates a new instance of EsportatoreTesto */
    public EsportatoreTesto() {
    }
   

    
 



@SuppressWarnings("deprecation")
public void EsportaTxt(Info dati,String filep){
                File file=new File(filep);
                    FileOutputStream fos = null;
                    try {
                        fos = new FileOutputStream(file);
                    } catch (FileNotFoundException ex) {
                        ex.printStackTrace();
                    }
                    PrintStream ps=new PrintStream(fos);
                     
                    Info i=new Info();
                    ParteSelezionata partes=new ParteSelezionata();
                    partes.set(dati);
                    
                    for(Enumeration r = dati.getEnteEmettitoreH().elements(); r.hasMoreElements(); ){
                            EnteEmettitore rr = (EnteEmettitore)r.nextElement();
                            i=null;
                            i=partes.infoCompletaEE(rr.getId());
         
                        
                   
                       
                            ps.println(rr.getInfoEE().getNome()+"    "+(new Integer(rr.getInfoEE().getDataInizio().getYear())+1900)+" - "+(new Integer(rr.getInfoEE().getDataFine().getYear())+1900)+"\n\n");
                 
                            for(Enumeration e3 = i.getTipoH().elements(); e3.hasMoreElements(); ){
                                 Tipo c = (Tipo)e3.nextElement();
                                 
                                 if(c.getEnteEmettitore().getId()==rr.getId().getId()){
                                     Unita u=(Unita)i.getUnitaH().get(c.getUnita().getId());
                                     SistemaMonetario s=(SistemaMonetario)i.getSistemaMonetarioH().get(u.getSistemaMonetario().getId());
                       
                                     ps.println("\t"+s.getInfoSM().getNome()+"-"+c.getInfoTipoMoneta().getDescrizione());
                                     ps.println("\t"+c.getInfoTipoMoneta().getMateriale()+" "+c.getInfoTipoMoneta().getDimensione()+"mm "+c.getInfoTipoMoneta().getPeso()+"gr - "+c.getInfoTipoMoneta().getForma().toString());
                              
                                        for(Enumeration e1 = i.getEmissioneH().elements(); e1.hasMoreElements(); ){
                                            Emissione a = (Emissione)e1.nextElement();
                                            if(c.getId().getId()==a.getTipo().getId()){
                                                Zecca z=(Zecca)i.getZeccaH().get(a.getZecca().getId());                                
                                                ps.println("\t\t"+a.getInfoE().getAnno()+"  "+z.getInfoZ().getSigla()+"  "+a.getInfoE().getNote());
                                                 for(Enumeration e2 = i.getMonetaH().elements(); e2.hasMoreElements(); ){
                                                        Moneta m = (Moneta)e2.nextElement();
                                                        if(m.getEmissione().getId()==a.getId().getId()){
                                                        ps.println("\t\t\t"+m.getInfoM().getGrado().toString()+"  "+m.getInfoM().getStato().getNote().getClass().getSimpleName()+"   "+m.getInfoM().getValoreCommerciale());
                                                        }
    }
                                            }
                        
                                     
                                 }
                                     ps.println("\n");
                                 
                                   
                          
                            }
                 
                          }
           }
                        
        
}

@SuppressWarnings("deprecation")
public void EsportaTxTEC(Info dati,String filep){
    
                    File file=new File(filep);
                    FileOutputStream fos = null;
                    try {
                        fos = new FileOutputStream(file);
                    } catch (FileNotFoundException ex) {
                        ex.printStackTrace();
                    }
                    PrintStream ps=new PrintStream(fos);
                     
                    Info i=new Info();
                    ParteSelezionata partes=new ParteSelezionata();
                    partes.set(dati);
                    
                    for(Enumeration r = dati.getEnteEmettitoreH().elements(); r.hasMoreElements(); ){
                            EnteEmettitore rr = (EnteEmettitore)r.nextElement();
                            i=null;
                            i=partes.infoCompletaEE(rr.getId());
         
                        
                   
                       
                            ps.println(rr.getInfoEE().getNome()+"    "+(new Integer(rr.getInfoEE().getDataInizio().getYear())+1900)+" - "+(new Integer(rr.getInfoEE().getDataFine().getYear())+1900)+"\n\n");
                 
                            for(Enumeration e3 = i.getTipoH().elements(); e3.hasMoreElements(); ){
                                 Tipo c = (Tipo)e3.nextElement();
                                 
                                 if(c.getEnteEmettitore().getId()==rr.getId().getId()){
                                     Unita u=(Unita)i.getUnitaH().get(c.getUnita().getId());
                                     SistemaMonetario s=(SistemaMonetario)i.getSistemaMonetarioH().get(u.getSistemaMonetario().getId());
                       
                                     ps.println("\t"+s.getInfoSM().getNome()+"-"+c.getInfoTipoMoneta().getDescrizione());
                                     ps.println("\t"+c.getInfoTipoMoneta().getMateriale()+" "+c.getInfoTipoMoneta().getDimensione()+"mm "+c.getInfoTipoMoneta().getPeso()+"gr - "+c.getInfoTipoMoneta().getForma().toString());
                              
                                        for(Enumeration e1 = i.getEmissioneH().elements(); e1.hasMoreElements(); ){
                                            Emissione a = (Emissione)e1.nextElement();
                                            if(c.getId().getId()==a.getTipo().getId()){
                                                Zecca z=(Zecca)i.getZeccaH().get(a.getZecca().getId());                                
                                                ps.println("\t\t"+a.getInfoE().getAnno()+"  "+z.getInfoZ().getSigla()+"  "+a.getInfoE().getNote());
                                            }
                        
                                     
                                 }
                                     ps.println("\n");
                                 
                                   
                          
                            }
                 
                          }
           }
}
        
           
       

}
