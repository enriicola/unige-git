package easycoin.calculator;

import com.lowagie.text.Font;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import easycoin.temporary_store.ParteSelezionata;
import java.awt.Color;
//import java.awt.Font;
import java.io.FileOutputStream;
import java.io.IOException;
import easycoin.store.*;
import java.util.Enumeration;

 public class EsportatorePDF extends Esportatore {
    
    /** Creates a new instance of EsportatorePDF */
    public EsportatorePDF() {
    }
    
    @SuppressWarnings("deprecation")
    public void  generaPdf(Info dati,String file){
         Document document = new Document();
        Info i=new Info();
        ParteSelezionata ps=new ParteSelezionata();
        ps.set(dati);       
        
		try {
			PdfWriter.getInstance(document,
					new FileOutputStream(file));
			document.open();
           for(Enumeration r = dati.getEnteEmettitoreH().elements(); r.hasMoreElements(); ){
            EnteEmettitore rr = (EnteEmettitore)r.nextElement();
            i=null;
            i=ps.infoCompletaEE(rr.getId());
         
                        
                   
                            document.add(new Paragraph(rr.getInfoEE().getNome()+"    "+(new Integer(rr.getInfoEE().getDataInizio().getYear())+1900)+" - "+(new Integer(rr.getInfoEE().getDataFine().getYear())+1900),FontFactory.getFont(FontFactory.TIMES_ROMAN,18, Font.BOLD, new Color(0, 0, 0))));
                            document.add(new Paragraph("   "));
                            document.add(new Paragraph("   "));
                
                            for(Enumeration e3 = i.getTipoH().elements(); e3.hasMoreElements(); ){
                                 Tipo c = (Tipo)e3.nextElement();
                                 
                                 if(c.getEnteEmettitore().getId()==rr.getId().getId()){
                                     Unita u=(Unita)i.getUnitaH().get(c.getUnita().getId());
                                     SistemaMonetario s=(SistemaMonetario)i.getSistemaMonetarioH().get(u.getSistemaMonetario().getId());
                       
                                     document.add(new Paragraph(s.getInfoSM().getNome()+"-"+c.getInfoTipoMoneta().getDescrizione(),FontFactory.getFont(FontFactory.TIMES_ROMAN,14, Font.BOLD, new Color(80, 80, 80))));
                                     document.add(new Paragraph("\t"+c.getInfoTipoMoneta().getMateriale()+" "+c.getInfoTipoMoneta().getDimensione()+"mm "+c.getInfoTipoMoneta().getPeso()+"gr - "+c.getInfoTipoMoneta().getForma().toString(),FontFactory.getFont(FontFactory.TIMES_ROMAN,12, Font.BOLD, new Color(100, 100 ,100))));
                              
                                        for(Enumeration e1 = i.getEmissioneH().elements(); e1.hasMoreElements(); ){
                                            Emissione a = (Emissione)e1.nextElement();
                                            if(c.getId().getId()==a.getTipo().getId()){
                                                Zecca z=(Zecca)i.getZeccaH().get(a.getZecca().getId());                                
                                                document.add(new Paragraph("\t\t"+a.getInfoE().getAnno()+"  "+z.getInfoZ().getSigla()+"  "+a.getInfoE().getNote(),FontFactory.getFont(FontFactory.COURIER,10, Font.BOLD, new Color(130, 130, 130))));
                                                 for(Enumeration e2 = i.getMonetaH().elements(); e2.hasMoreElements(); ){
                                                     Moneta m = (Moneta)e2.nextElement();
                                                    if(m.getEmissione().getId()==a.getId().getId()){
                                                         document.add(new Paragraph("\t\t\t"+m.getInfoM().getGrado().toString()+"  "+m.getInfoM().getStato().getNote().getClass().getSimpleName()+"   "+m.getInfoM().getValoreCommerciale(),FontFactory.getFont(FontFactory.COURIER,10, Font.BOLD, new Color(150, 150, 150))));
                                                     }
                                                 }
                                            }
                                        }
                                 }
                            }
           
                        
                                     
                                 
                                     document.add(new Paragraph("   ")); 
                                 
                                   
                          
                            }
                 
                                    
                       
                    
                       
           
            
		} catch (DocumentException de) {
			System.err.println(de.getMessage());
		} catch (IOException ioe) {
			System.err.println(ioe.getMessage());
		}

		document.close();
        
       
        
       
    }
    
    
    
     @SuppressWarnings("deprecation")
	public void  generaPdfEC(Info dati,String file){
        
        Document document = new Document();
        Info i=new Info();
        ParteSelezionata ps=new ParteSelezionata();
        ps.set(dati);       
        
		try {
			PdfWriter.getInstance(document,
					new FileOutputStream(file));
			document.open();
           for(Enumeration r = dati.getEnteEmettitoreH().elements(); r.hasMoreElements(); ){
            EnteEmettitore rr = (EnteEmettitore)r.nextElement();
            i=null;
            i=ps.infoCompletaEE(rr.getId());
         
                        
                   
                            document.add(new Paragraph(rr.getInfoEE().getNome()+"    "+(new Integer(rr.getInfoEE().getDataInizio().getYear())+1900)+" - "+(new Integer(rr.getInfoEE().getDataFine().getYear())+1900),FontFactory.getFont(FontFactory.TIMES_ROMAN,18, Font.BOLD, new Color(0, 0, 0))));
                            document.add(new Paragraph("   "));
                            document.add(new Paragraph("   "));
                
                            for(Enumeration e3 = i.getTipoH().elements(); e3.hasMoreElements(); ){
                                 Tipo c = (Tipo)e3.nextElement();
                                 
                                 if(c.getEnteEmettitore().getId()==rr.getId().getId()){
                                     Unita u=(Unita)i.getUnitaH().get(c.getUnita().getId());
                                     SistemaMonetario s=(SistemaMonetario)i.getSistemaMonetarioH().get(u.getSistemaMonetario().getId());
                       
                                     document.add(new Paragraph(s.getInfoSM().getNome()+"-"+c.getInfoTipoMoneta().getDescrizione(),FontFactory.getFont(FontFactory.TIMES_ROMAN,14, Font.BOLD, new Color(80, 80, 80))));
                                     document.add(new Paragraph("\t"+c.getInfoTipoMoneta().getMateriale()+" "+c.getInfoTipoMoneta().getDimensione()+"mm "+c.getInfoTipoMoneta().getPeso()+"gr - "+c.getInfoTipoMoneta().getForma().toString(),FontFactory.getFont(FontFactory.TIMES_ROMAN,12, Font.BOLD, new Color(100, 100 ,100))));
                              
                                        for(Enumeration e1 = i.getEmissioneH().elements(); e1.hasMoreElements(); ){
                                            Emissione a = (Emissione)e1.nextElement();
                                            if(c.getId().getId()==a.getTipo().getId()){
                                                Zecca z=(Zecca)i.getZeccaH().get(a.getZecca().getId());                                
                                                document.add(new Paragraph("\t\t"+a.getInfoE().getAnno()+"  "+z.getInfoZ().getSigla()+"  "+a.getInfoE().getNote(),FontFactory.getFont(FontFactory.COURIER,10, Font.BOLD, new Color(130, 130, 130))));
                                            }
                        
                                     
                                 }
                                     document.add(new Paragraph("   ")); 
                                 
                                   
                          
                            }
                 
                          }
           }
                      
                       
                    
                       
           
            
		} catch (DocumentException de) {
			System.err.println(de.getMessage());
		} catch (IOException ioe) {
			System.err.println(ioe.getMessage());
		}

		document.close();
        
       
    }
}
