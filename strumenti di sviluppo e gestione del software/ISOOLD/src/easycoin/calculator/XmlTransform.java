package easycoin.calculator;

import java.io.*;
import javax.xml.transform.*;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;


public class XmlTransform {
   TransformerFactory transformerFactory;
  
   public XmlTransform() {
      transformerFactory = TransformerFactory.newInstance();
   }
  
   public String transform(String xml, String xsl) throws TransformerException {
      //System.out.println("xml=" + xml);
      //System.out.println("xsl=" + xsl);
     
      ByteArrayOutputStream resultStream = new ByteArrayOutputStream();
      ByteArrayInputStream xmlStream = new ByteArrayInputStream(xml.getBytes());
      ByteArrayInputStream xslStream = new ByteArrayInputStream(xsl.getBytes());
     
      Transformer transformer = transformerFactory.newTransformer(new StreamSource(xslStream));
     
      transformer.transform(new StreamSource(xmlStream), new StreamResult(resultStream));
     
      return resultStream.toString();
   }
}
