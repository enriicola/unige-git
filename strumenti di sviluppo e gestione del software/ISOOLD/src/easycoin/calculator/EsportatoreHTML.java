package easycoin.calculator;

import easycoin.store.EnteEmettitore;
import easycoin.store.*;
import easycoin.temporary_store.ParteSelezionata;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.Enumeration;

public class EsportatoreHTML extends Esportatore {
    
    public EsportatoreHTML() {
    }
    
    
                        
    

  @SuppressWarnings("deprecation")
public void generaHtmlM(Info dati,String fileinput){
        File file=new File(fileinput);
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
                    ps.println("<html><head><title>EasyCoin</title></head><body>");
                    
                    for(Enumeration r = dati.getEnteEmettitoreH().elements(); r.hasMoreElements(); ){
                            EnteEmettitore rr = (EnteEmettitore)r.nextElement();
                            i=null;
                            i=partes.infoCompletaEE(rr.getId());
         
                        
                   
                       
                            ps.println("<h3>" + rr.getInfoEE().getNome() + "    "+(rr.getInfoEE().getDataInizio().getYear())+1900+" - "+(rr.getInfoEE().getDataFine().getYear())+1900+"</h3>");
                 
                            for(Enumeration e3 = i.getTipoH().elements(); e3.hasMoreElements(); ){
                                 Tipo c = (Tipo)e3.nextElement();
                                 
                                 if(c.getEnteEmettitore().getId()==rr.getId().getId()){
                                     Unita u=(Unita)i.getUnitaH().get(c.getUnita().getId());
                                     SistemaMonetario s=(SistemaMonetario)i.getSistemaMonetarioH().get(u.getSistemaMonetario().getId());
                       
                                     ps.println("&nbsp;<h4>"+s.getInfoSM().getNome()+"-"+c.getInfoTipoMoneta().getDescrizione()+"</h4>"+"<h5>"+c.getInfoTipoMoneta().getMateriale()+" "+c.getInfoTipoMoneta().getDimensione()+"mm "+c.getInfoTipoMoneta().getPeso()+"gr - "+c.getInfoTipoMoneta().getForma().toString()+"</h5>");
                                     
                                        for(Enumeration e1 = i.getEmissioneH().elements(); e1.hasMoreElements(); ){
                                            Emissione a = (Emissione)e1.nextElement();
                                            if(c.getId().getId()==a.getTipo().getId()){
                                                Zecca z=(Zecca)i.getZeccaH().get(a.getZecca().getId());                                
                                                ps.println("&nbsp;&nbsp;"+a.getInfoE().getAnno()+"  "+z.getInfoZ().getSigla()+"  "+a.getInfoE().getNote()+"</br>");
                                                for(Enumeration e2 = i.getMonetaH().elements(); e2.hasMoreElements(); ){
                                                        Moneta m = (Moneta)e2.nextElement();
                                                        if(m.getEmissione().getId()==a.getId().getId()){
                                                        ps.println("&nbsp;&nbsp;&nbsp;"+m.getInfoM().getGrado().toString()+"  "+m.getInfoM().getStato().getNote().getClass().getSimpleName()+"   "+m.getInfoM().getValoreCommerciale()+"</br>");
                                                        }
                    }
                                            }
                        
                                     
                                 }
                                     ps.println("</br>");
                                 
                                   
                          
                            }
                 
                          }
           }
                    ps.println("</body></html>");
                    
        
                    
    }

    
    
    
    
    @SuppressWarnings("deprecation")
  public void generaHtml(Info dati,String fileinput){
        File file=new File(fileinput);
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
                    ps.println("<html><head><title>EasyCoin</title></head><body>");
                    
                    for(Enumeration r = dati.getEnteEmettitoreH().elements(); r.hasMoreElements(); ){
                            EnteEmettitore rr = (EnteEmettitore)r.nextElement();
                            i=null;
                            i=partes.infoCompletaEE(rr.getId());
         
                        
                   
                       
                            ps.println("<h3>"+rr.getInfoEE().getNome()+"    "+(new Integer(rr.getInfoEE().getDataInizio().getYear())+1900)+" - "+(new Integer(rr.getInfoEE().getDataFine().getYear())+1900)+"</h3>");
                 
                            for(Enumeration e3 = i.getTipoH().elements(); e3.hasMoreElements(); ){
                                 Tipo c = (Tipo)e3.nextElement();
                                 
                                 if(c.getEnteEmettitore().getId()==rr.getId().getId()){
                                     Unita u=(Unita)i.getUnitaH().get(c.getUnita().getId());
                                     SistemaMonetario s=(SistemaMonetario)i.getSistemaMonetarioH().get(u.getSistemaMonetario().getId());
                       
                                     ps.println("&nbsp;<h4>"+s.getInfoSM().getNome()+"-"+c.getInfoTipoMoneta().getDescrizione()+"</h4>"+"<h5>"+c.getInfoTipoMoneta().getMateriale()+" "+c.getInfoTipoMoneta().getDimensione()+"mm "+c.getInfoTipoMoneta().getPeso()+"gr - "+c.getInfoTipoMoneta().getForma().toString()+"</h5>");
                                     
                                        for(Enumeration e1 = i.getEmissioneH().elements(); e1.hasMoreElements(); ){
                                            Emissione a = (Emissione)e1.nextElement();
                                            if(c.getId().getId()==a.getTipo().getId()){
                                                Zecca z=(Zecca)i.getZeccaH().get(a.getZecca().getId());                                
                                                ps.println("&nbsp;&nbsp;"+a.getInfoE().getAnno()+"  "+z.getInfoZ().getSigla()+"  "+a.getInfoE().getNote()+"</br>");
                                            }
                        
                                     
                                 }
                                     ps.println("</br>");
                                 
                                   
                          
                            }
                 
                          }
           }
                    ps.println("</body></html>");
                    
        
                    
    }
}
