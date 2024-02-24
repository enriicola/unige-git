package easycoin.boundary;

import java.sql.Date;
import java.util.Enumeration;
import java.util.Hashtable;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
//import javax.swing.JDialog;
//import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JTextField;
import easycoin.executor.*;
import easycoin.store.*;
import easycoin.datatype.*;
//import easycoin.datatype.visualizzazione.Visualizzazione;
import javax.swing.JPanel;
import java.awt.Dimension;
import java.awt.Rectangle;
import java.awt.Color;

public class ModificareEE extends Base {

	private static final long serialVersionUID = -3564841949855299876L;

	//	Attributi derivati da associazioni
	private GestireEasyCatalogo GEC;  //  @jve:decl-index=0:
//	fine associazioni
	
	private Id EEdaModificare;  //  @jve:decl-index=0:
	private InfoEnteEmettitore ee;  //  @jve:decl-index=0:
	private Hashtable ze = new Hashtable();  //  @jve:decl-index=0:
	private Hashtable si = new Hashtable();  //  @jve:decl-index=0:
	private Hashtable un = new Hashtable();  //  @jve:decl-index=0:
	
	private JPanel jContentPane = null;
	private JLabel jL_Nome = null;
	private JTextField jT_Nome = null;
	private JLabel jL_NomeOriginale = null;
	private JTextField jT_NomeOriginale = null;
	private JLabel jL_AreaGeografica = null;
	private JTextField jT_AreaGeografica = null;
	private JLabel jL_DataInizio = null;
	private JTextField jT_AnnoInizio = null;
	private JLabel jL_DataFine = null;
	private JTextField jT_AnnoFine = null;
	private JButton jB_Conferma = null;
	private JButton jB_Annulla = null;
	private JPanel jP_Zecche = null;
	private JPanel jP_SistemiM = null;
	private JLabel jL_Sigla = null;
	private JTextField jT_Sigla = null;
	private JLabel jL_Descrizione = null;
	private JTextField jT_Descrizione = null;
	private JButton jB_InserisciZecca = null;
	private JLabel jL_NomeSist = null;
	private JTextField jT_NomeSist = null;
	private JLabel jL_NomeOrig = null;
	private JTextField jT_NomeOrig = null;
	private JButton jB_InserisciSist = null;
	private JPanel jP_Unita = null;
	private JLabel jLNomeUnita = null;
	private JTextField jT_NomeUnita = null;
	private JLabel jL_NomeOrigUnita = null;
	private JTextField jT_NomeOrigUnita = null;
	private JLabel jL_FattMolt = null;
	private JTextField jT_FattMolt = null;
	private JButton jB_InserisciUnita = null;
	private JComboBox jCB_Zecche = null;
	private JButton jB_ModZecche = null;
	private JButton jB_ModSistMon = null;
	private JComboBox jCB_Sistemi = null;
	private JComboBox jCB_Unita = null;
	private JButton jB_ModUnita = null;
	private JLabel jL_RelativaA = null;
	private Info InfoEEdaModificare;
	private String[] zecche;
	private String[] sistemi;
	private String[] unita;
	private JLabel jL_Note = null;
	private JTextField jT_Note = null;
	private InfoZecca iz;
	private InfoSistemaMonetario ism;
	private InfoUnita iu;

	private Hashtable z = new Hashtable();  //  @jve:decl-index=0:
	private Hashtable s = new Hashtable();  //  @jve:decl-index=0:
	private Hashtable u = new Hashtable();  //  @jve:decl-index=0:
	private InfoZecca zz;
	private Unita uu;
	private InfoSistemaMonetario sm;
	
	
	//	<<create>> mkModificareEE(GestireEasyCatalogo gec,Id idE)
	public ModificareEE(GestireEasyCatalogo gec,Id idE){
		super();
		mystate=ATTESA_MODIFICA_EC;
		this.GEC=gec;
		this.EEdaModificare=idE;
		GEC.modEE(this,EEdaModificare);
	}
	
	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
        this.setContentPane(getJContentPane());
		this.setTitle("EasyCoin - Modificare Ente Emettitore");
		this.setSize(new Dimension(570, 487));
		this.setVisible(true);
	}

	public void showEC(/*Visualizzazione*/Info ec){
		switch(mystate){
		case ATTESA_MODIFICA_EC:{
			mystate=ATTESA_CONFERMA_MOD_EE;
			/*Visualizza nell'interfaccia ec*/
			InfoEEdaModificare=ec;
			int k=0;
			zecche=new String[ec.getZeccaH().size()];
			for (Enumeration z = ec.getZeccaH().elements(); z.hasMoreElements();){
				Zecca uni=(Zecca)z.nextElement();
	    		zecche[k]=uni.getId().idToString();
	    		k++;
	    	}
			k=0;
			sistemi=new String[ec.getSistemaMonetarioH().size()];
			for (Enumeration u = ec.getSistemaMonetarioH().elements(); u.hasMoreElements();){
				SistemaMonetario s=(SistemaMonetario)u.nextElement();
	    		sistemi[k]=s.getId().idToString();
	    		k++;
	    	}
			k=0;
			unita=new String[ec.getUnitaH().size()];
			for (Enumeration u = ec.getUnitaH().elements(); u.hasMoreElements();){
				Unita uni=(Unita)u.nextElement();
				unita[k]=uni.getId().idToString();
				k++;
	    	}
			iz=((Zecca)InfoEEdaModificare.getZeccaH().get(new Integer(zecche[0]))).getInfoZ();
			ism=((SistemaMonetario)InfoEEdaModificare.getSistemaMonetarioH().get(new Integer(sistemi[0]))).getInfoSM();
			iu=((Unita)InfoEEdaModificare.getUnitaH().get(new Integer(unita[0]))).getInfoU();
			initialize();
			msg=new String("Procedere con l'operazione?");
			JOptionPane question = new JOptionPane(msg,JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
			question.setMessage(msg);
			JDialog dialog = question.createDialog(new JFrame(),"");
			dialog.pack();
			dialog.setVisible(true);
			int n = ((Integer)question.getValue()).intValue();
			if ( n == 0){ conferma(); break;}
			else {annulla();			
			break;}}
		default:{}
		}
	}
	
	@SuppressWarnings("unchecked")
	public void modificaEE(InfoEnteEmettitore e,Hashtable z,Hashtable s,Hashtable u){
		switch(mystate){
		case ATTESA_DATI_EE:{
			mystate=MODIFICA_EC;
			ee=e;
			ze= GEC.getSEL().dammiZecche(EEdaModificare);
			for (Enumeration jz=z.elements();jz.hasMoreElements();){
				Zecca zecca=(Zecca)jz.nextElement();
				Zecca aux=(Zecca)ze.get(zecca.getId().getId());
				aux=zecca;
				ze.put(zecca.getId().getId(), aux);
			}
			
			si=GEC.getSEL().dammiSistemaMonetario(EEdaModificare);
			for (Enumeration jz=s.elements();jz.hasMoreElements();){
				SistemaMonetario sistema=(SistemaMonetario)jz.nextElement();
				SistemaMonetario aux2=(SistemaMonetario)si.get(sistema.getId().getId());
				aux2=sistema;
				si.put(sistema.getId().getId(), aux2);
				for (Enumeration ju=GEC.getSEL().dammiUnita(sistema.getId()).elements();ju.hasMoreElements();){
					Unita aux3=(Unita)ju.nextElement();
					un.put(aux3.getId().getId(), aux3);
				}
			}
			for (Enumeration juu=u.elements();juu.hasMoreElements();){
				Unita unita=(Unita)juu.nextElement();
				Unita aux4=(Unita)un.get(unita.getId().getId());
				aux4=unita;
				un.put(unita.getId().getId(),aux4);
			}
			setVisible(false);
			GEC.modificaEE(this, ee, ze, si, un, EEdaModificare);
			break;} 
		default:{}
		}
	}
//	Metodi get e set

	public Id getEEdaModificare() {
		return EEdaModificare;
	}

	public void setEEdaModificare(Id edaModificare) {
		EEdaModificare = edaModificare;
	}

	public GestireEasyCatalogo getGEC() {
		return GEC;
	}

	public void setGEC(GestireEasyCatalogo gec) {
		GEC = gec;
	}

	
	/**
	 * This method initializes jContentPane	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJContentPane() {
		if (jContentPane == null) {
			jL_Note = new JLabel();
			jL_Note.setBounds(new Rectangle(341, 54, 43, 20));
			jL_Note.setText("Note:");
			jL_Note.setForeground(new java.awt.Color(255, 255, 255));
			jL_DataFine = new JLabel();
			jL_DataFine.setBounds(new Rectangle(286, 86, 61, 20));
			jL_DataFine.setText("Data Fine:");
			jL_DataFine.setForeground(new java.awt.Color(255, 255, 255));
			jL_DataInizio = new JLabel();
			jL_DataInizio.setBounds(new Rectangle(15, 86, 68, 20));
			jL_DataInizio.setText("Data Inizio:");
			jL_DataInizio.setForeground(new java.awt.Color(255, 255, 255));
			jL_AreaGeografica = new JLabel();
			jL_AreaGeografica.setBounds(new Rectangle(15, 54, 100, 20));
			jL_AreaGeografica.setText("Area Geografica:");
			jL_AreaGeografica.setForeground(new java.awt.Color(255, 255, 255));
			jL_NomeOriginale = new JLabel();
			jL_NomeOriginale.setBounds(new Rectangle(248, 17, 141, 20));
			jL_NomeOriginale.setText("Nome in lingua originale:");
			jL_NomeOriginale.setForeground(new java.awt.Color(255, 255, 255));
			jL_Nome = new JLabel();
			jL_Nome.setBounds(new Rectangle(15, 17, 40, 20));
			jL_Nome.setText("Nome:");
			jL_Nome.setForeground(new java.awt.Color(255, 255, 255));
			jContentPane = new JPanel();
			jContentPane.setLayout(null);
			jContentPane.setBackground(new java.awt.Color(0, 0, 0));
			jContentPane.add(jL_Nome, null);
			jContentPane.add(getJT_Nome(), null);
			jContentPane.add(jL_NomeOriginale, null);
			jContentPane.add(getJT_NomeOriginale(), null);
			jContentPane.add(jL_AreaGeografica, null);
			jContentPane.add(getJT_AreaGeografica(), null);
			jContentPane.add(jL_DataInizio, null);
			jContentPane.add(getJT_AnnoInizio(), null);
			jContentPane.add(jL_DataFine, null);
			jContentPane.add(getJT_AnnoFine(), null);
			jContentPane.add(getJB_Conferma(), null);
			jContentPane.add(getJB_Annulla(), null);
			jContentPane.add(getJP_Zecche(), null);
			jContentPane.add(getJP_SistemiM(), null);
			jContentPane.add(getJP_Unita(), null);
			jContentPane.add(jL_Note, null);
			jContentPane.add(getJT_Note(), null);
		}
		return jContentPane;
	}

	/**
	 * This method initializes jT_Nome	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Nome() {
		if (jT_Nome == null) {
			jT_Nome = new JTextField();
			jT_Nome.setBounds(new Rectangle(64, 17, 152, 20));
			jT_Nome.setText(((EnteEmettitore)InfoEEdaModificare.getEnteEmettitoreH().get(EEdaModificare.getId())).getInfoEE().getNome());
		}
		return jT_Nome;
	}

	/**
	 * This method initializes jT_NomeOriginale	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_NomeOriginale() {
		if (jT_NomeOriginale == null) {
			jT_NomeOriginale = new JTextField();
			jT_NomeOriginale.setBounds(new Rectangle(392, 17, 155, 20));
			jT_NomeOriginale.setText(((EnteEmettitore)InfoEEdaModificare.getEnteEmettitoreH().get(EEdaModificare.getId())).getInfoEE().getNomeOriginale());
		}
		return jT_NomeOriginale;
	}

	/**
	 * This method initializes jT_AreaGeografica	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_AreaGeografica() {
		if (jT_AreaGeografica == null) {
			jT_AreaGeografica = new JTextField();
			jT_AreaGeografica.setBounds(new Rectangle(122, 54, 210, 20));
			jT_AreaGeografica.setText(((EnteEmettitore)InfoEEdaModificare.getEnteEmettitoreH().get(EEdaModificare.getId())).getInfoEE().getAreaGeografica());
		}
		return jT_AreaGeografica;
	}

	/**
	 * This method initializes jT_AnnoInizio	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	@SuppressWarnings("deprecation")
	private JTextField getJT_AnnoInizio() {
		if (jT_AnnoInizio == null) {
			jT_AnnoInizio = new JTextField();
			jT_AnnoInizio.setBounds(new Rectangle(87, 86, 54, 20));
			jT_AnnoInizio.setText((((EnteEmettitore)InfoEEdaModificare.getEnteEmettitoreH().get(EEdaModificare.getId())).getInfoEE().getDataInizio().getYear()+1900)+"");
		}
		return jT_AnnoInizio;
	}

	/**
	 * This method initializes jT_AnnoFine	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	@SuppressWarnings("deprecation")
	private JTextField getJT_AnnoFine() {
		if (jT_AnnoFine == null) {
			jT_AnnoFine = new JTextField();
			jT_AnnoFine.setBounds(new Rectangle(355, 86, 54, 20));
			jT_AnnoFine.setText((((EnteEmettitore)InfoEEdaModificare.getEnteEmettitoreH().get(EEdaModificare.getId())).getInfoEE().getDataFine().getYear()+1900)+"");
		}
		return jT_AnnoFine;
	}

	/**
	 * This method initializes jB_Conferma	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Conferma() {
		if (jB_Conferma == null) {
			jB_Conferma = new JButton();
			jB_Conferma.setBounds(new Rectangle(329, 420, 97, 24));
			jB_Conferma.setText("Conferma");
			jB_Conferma.addActionListener(new java.awt.event.ActionListener() {
				@SuppressWarnings("deprecation")
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()"); 
					// TODO Auto-generated Event stub actionPerformed()
					try{
						InfoEnteEmettitore ee=new InfoEnteEmettitore();
						ee.setNome(jT_Nome.getText());
						ee.setAreaGeografica(jT_AreaGeografica.getText());
						ee.setNomeOriginale(jT_NomeOriginale.getText());
						ee.setNote(jT_Note.getText());
						int anno= new Integer(jT_AnnoInizio.getText()).intValue();
						anno=anno-1900;
						Date datei = new Date(anno,1,1);
						ee.setDataInizio(datei);
						anno=new Integer(jT_AnnoFine.getText()).intValue();
						anno=anno-1900;
						Date datef = new Date(anno,1,1);
						ee.setDataFine(datef);
						modificaEE(ee, z, s, u);
						} catch (java.lang.NumberFormatException ex){
							System.out.println("Il formato dell'anno non è corretto");
							msg=new String("Il formato dell'anno non è corretto");
							JOptionPane error = new JOptionPane(msg,JOptionPane.ERROR_MESSAGE, JOptionPane.OK_OPTION);
							error.setMessage(msg);
							JDialog dialog = error.createDialog(new JFrame(),"");
							dialog.pack();
							dialog.setVisible(true);
							}
				}
			});
		}
		return jB_Conferma;
	}

	/**
	 * This method initializes jB_Annulla	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Annulla() {
		if (jB_Annulla == null) {
			jB_Annulla = new JButton();
			jB_Annulla.setBounds(new Rectangle(439, 420, 97, 24));
			jB_Annulla.setText("Annulla");
			jB_Annulla.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()"); 
					// TODO Auto-generated Event stub actionPerformed()
					mystate = CATALOGO_APERTO;
					setVisible(false);
					GEC.getAEC().setVisible(true);
					GEC.ko();
				}
			});
		}
		return jB_Annulla;
	}

	/**
	 * This method initializes jP_Zecche	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Zecche() {
		if (jP_Zecche == null) {
			jL_Descrizione = new JLabel();
			jL_Descrizione.setBounds(new Rectangle(15, 50, 79, 20));
			jL_Descrizione.setText("Descrizione:");
			jL_Descrizione.setForeground(new java.awt.Color(255, 255, 255));
			jL_Sigla = new JLabel();
			jL_Sigla.setBounds(new Rectangle(15, 20, 43, 20));
			jL_Sigla.setForeground(new java.awt.Color(255, 255, 255));
			jL_Sigla.setText("Sigla:");
			jP_Zecche = new JPanel();
			jP_Zecche.setLayout(null);
			jP_Zecche.setBounds(new Rectangle(15, 116, 530, 81));
			jP_Zecche.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Zecche", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Arial", 0, 11), new java.awt.Color(255, 255, 255)));
			jP_Zecche.add(jL_Sigla, null);
			jP_Zecche.add(getJT_Sigla(), null);
			jP_Zecche.add(jL_Descrizione, null);
			jP_Zecche.add(getJT_Descrizione(), null);
			jP_Zecche.add(getJB_InserisciZecca(), null);
			jP_Zecche.setBackground(new java.awt.Color(0, 0, 0));
			jP_Zecche.add(getJCB_Zecche(), null);
			jP_Zecche.add(getJB_ModZecche(), null);
			
		}
		return jP_Zecche;
	}

	/**
	 * This method initializes jP_SistemiM	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_SistemiM() {
		if (jP_SistemiM == null) {
			jL_NomeOrig = new JLabel();
			jL_NomeOrig.setBounds(new Rectangle(15, 50, 97, 20));
			jL_NomeOrig.setText("Nome Originale:");
			jL_NomeOrig.setForeground(new java.awt.Color(255, 255, 255));
			jL_NomeSist = new JLabel();
			jL_NomeSist.setBounds(new Rectangle(15, 20, 42, 20));
			jL_NomeSist.setForeground(new java.awt.Color(255, 255, 255));
			jL_NomeSist.setText("Nome:");
			jP_SistemiM = new JPanel();
			jP_SistemiM.setLayout(null);
			jP_SistemiM.setBounds(new Rectangle(15, 207, 530, 81));
			jP_SistemiM.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Sistemi Monetari", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Tahoma", 0, 11), new java.awt.Color(255, 255, 255)));
			jP_SistemiM.add(jL_NomeSist, null);
			jP_SistemiM.add(getJT_NomeSist(), null);
			jP_SistemiM.add(jL_NomeOrig, null);
			jP_SistemiM.add(getJT_NomeOrig(), null);
			jP_SistemiM.add(getJB_InserisciSist(), null);
			jP_SistemiM.setBackground(new java.awt.Color(0, 0, 0));
			jP_SistemiM.add(getJB_ModSistMon(), null);
			jP_SistemiM.add(getJCB_Sistemi(), null);
		}
		return jP_SistemiM;
	}

	/**
	 * This method initializes jT_Sigla	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Sigla() {
		if (jT_Sigla == null) {
			jT_Sigla = new JTextField();
			jT_Sigla.setBounds(new Rectangle(61, 20, 115, 20));
			jT_Sigla.setText(iz.getSigla());
		}
		return jT_Sigla;
	}

	/**
	 * This method initializes jT_Descrizione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Descrizione() {
		if (jT_Descrizione == null) {
			jT_Descrizione = new JTextField();
			jT_Descrizione.setBounds(new Rectangle(100, 50, 225, 20));
			jT_Descrizione.setText(iz.getDescrizione());
		}
		return jT_Descrizione;
	}

	/**
	 * This method initializes jB_InserisciZecca	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_InserisciZecca() {
		if (jB_InserisciZecca == null) {
			jB_InserisciZecca = new JButton();
			jB_InserisciZecca.setBounds(new Rectangle(370, 47, 97, 24));
			jB_InserisciZecca.setText("Aggiungi");
			jB_InserisciZecca.addActionListener(new java.awt.event.ActionListener() {
				@SuppressWarnings("unchecked")
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()"); 
					// TODO Auto-generated Event stub actionPerformed()
				}
			});
		}
		return jB_InserisciZecca;
	}
	/**
	 * This method initializes jT_NomeSist	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_NomeSist() {
		if (jT_NomeSist == null) {
			jT_NomeSist = new JTextField();
			jT_NomeSist.setBounds(new Rectangle(60, 20, 135, 20));
			jT_NomeSist.setText(ism.getNome());
		}
		return jT_NomeSist;
	}

	/**
	 * This method initializes jT_NomeOrig	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_NomeOrig() {
		if (jT_NomeOrig == null) {
			jT_NomeOrig = new JTextField();
			jT_NomeOrig.setBounds(new Rectangle(116, 50, 210, 20));
			jT_NomeOrig.setText(ism.getNomeOriginale());
		}
		return jT_NomeOrig;
	}

	/**
	 * This method initializes jB_InserisciSist	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_InserisciSist() {
		if (jB_InserisciSist == null) {
			jB_InserisciSist = new JButton();
			jB_InserisciSist.setBounds(new Rectangle(370, 47, 97, 24));
			jB_InserisciSist.setText("Aggiungi");
			jB_InserisciSist.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()"); // TODO Auto-generated Event stub actionPerformed()
				}
			});
		}
		return jB_InserisciSist;
	}

	/**
	 * This method initializes jP_Unita	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Unita() {
		if (jP_Unita == null) {
			jL_FattMolt = new JLabel();
			jL_FattMolt.setBounds(new Rectangle(15, 80, 122, 20));
			jL_FattMolt.setText("Fattore Molteplicità:");
			jL_FattMolt.setForeground(new java.awt.Color(255, 255, 255));
			jL_NomeOrigUnita = new JLabel();
			jL_NomeOrigUnita.setBounds(new Rectangle(15, 50, 97, 20));
			jL_NomeOrigUnita.setText("Nome Originale:");
			jL_NomeOrigUnita.setForeground(new java.awt.Color(255, 255, 255));
			jLNomeUnita = new JLabel();
			jLNomeUnita.setBounds(new Rectangle(15, 20, 41, 20));
			jLNomeUnita.setText("Nome:");
			jLNomeUnita.setForeground(new java.awt.Color(255, 255, 255));
			jP_Unita = new JPanel();
			jP_Unita.setLayout(null);
			jP_Unita.setBounds(new Rectangle(15, 298, 530, 111));
			jP_Unita.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Unità", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Tahoma", 0, 11), new java.awt.Color(255, 255, 255)));
			jP_Unita.add(jLNomeUnita, null);
			jP_Unita.add(getJT_NomeUnita(), null);
			jP_Unita.add(jL_NomeOrigUnita, null);
			jP_Unita.add(getJT_NomeOrigUnita(), null);
			jP_Unita.add(jL_FattMolt, null);
			jP_Unita.add(getJT_FattMolt(), null);
			jP_Unita.add(getJB_InserisciUnita(), null);
			jP_Unita.setBackground(new java.awt.Color(0, 0, 0));
			jP_Unita.add(getJCB_Unita(), null);
			jP_Unita.add(getJB_ModUnita(), null);
			jL_RelativaA = new JLabel();
			jL_RelativaA.setBounds(new Rectangle(370, 20, 152, 22));
			jL_RelativaA.setText("Relativa a Sistema: "+((Unita)InfoEEdaModificare.getUnitaH().get(new Integer((String)jCB_Unita.getSelectedItem()).intValue())).getSistemaMonetario().idToString());
			jL_RelativaA.setForeground(new java.awt.Color(255, 255, 255));
			jP_Unita.add(jL_RelativaA, null);
		}
		return jP_Unita;
	}

	/**
	 * This method initializes jT_NomeUnita	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_NomeUnita() {
		if (jT_NomeUnita == null) {
			jT_NomeUnita = new JTextField();
			jT_NomeUnita.setBounds(new Rectangle(60, 20, 134, 20));
			jT_NomeUnita.setText(iu.getNome());
		}
		return jT_NomeUnita;
	}

	/**
	 * This method initializes jT_NomeOrigUnita	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_NomeOrigUnita() {
		if (jT_NomeOrigUnita == null) {
			jT_NomeOrigUnita = new JTextField();
			jT_NomeOrigUnita.setBounds(new Rectangle(116, 50, 210, 20));
			jT_NomeOrigUnita.setText(iu.getNomeOriginale());
		}
		return jT_NomeOrigUnita;
	}

	/**
	 * This method initializes jT_FattMolt	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_FattMolt() {
		if (jT_FattMolt == null) {
			jT_FattMolt = new JTextField();
			jT_FattMolt.setBounds(new Rectangle(141, 80, 185, 20));
			jT_FattMolt.setText(iu.getFattoreMonteplicita()+"");
		}
		return jT_FattMolt;
	}

	/**
	 * This method initializes jB_InserisciUnita	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_InserisciUnita() {
		if (jB_InserisciUnita == null) {
			jB_InserisciUnita = new JButton();
			jB_InserisciUnita.setBounds(new Rectangle(370, 77, 97, 24));
			jB_InserisciUnita.setText("Aggiungi");
			jB_InserisciUnita.addActionListener(new java.awt.event.ActionListener() {
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()"); // TODO Auto-generated Event stub actionPerformed()
				}
			});
		}
		return jB_InserisciUnita;
	}

	/**
	 * This method initializes jCB_Zecche	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Zecche() {
		if (jCB_Zecche == null) {
			jCB_Zecche = new JComboBox(zecche);
			jCB_Zecche.setBounds(new Rectangle(204, 20, 121, 20));
			jCB_Zecche.setForeground(new java.awt.Color(255, 255, 255));
			jCB_Zecche.setBackground(new java.awt.Color(0, 0, 0));
			jCB_Zecche.addItemListener(new java.awt.event.ItemListener() {
				public void itemStateChanged(java.awt.event.ItemEvent e) {
					System.out.println("itemStateChanged()"); 
					// TODO Auto-generated Event stub itemStateChanged()
					iz=((Zecca)InfoEEdaModificare.getZeccaH().get(new Integer((String)jCB_Zecche.getSelectedItem()))).getInfoZ();
					jT_Sigla.setText(iz.getSigla());
					jT_Descrizione.setText(iz.getDescrizione());
				}
			});
		}
		return jCB_Zecche;
	}

	/**
	 * This method initializes jB_ModZecche	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_ModZecche() {
		if (jB_ModZecche == null) {
			jB_ModZecche = new JButton();
			jB_ModZecche.setBounds(new Rectangle(370, 17, 97, 24));
			jB_ModZecche.setText("Modifica");
			jB_ModZecche.addActionListener(new java.awt.event.ActionListener() {
				@SuppressWarnings("unchecked")
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()");
					// TODO Auto-generated Event stub actionPerformed()
					zz=new InfoZecca();
					zz.setSigla(jT_Sigla.getText());
					zz.setDescrizione(jT_Descrizione.getText());
					Zecca aux=new Zecca();
					aux.setEnteEmettitore(EEdaModificare);
					aux.setId(((Zecca)InfoEEdaModificare.getZeccaH().get(new Integer((String)jCB_Zecche.getSelectedItem()))).getId());
					aux.setInfoZ(zz);
					z.put(new Integer((String)jCB_Zecche.getSelectedItem()).intValue(), aux);
				}
			});
		}
		return jB_ModZecche;
	}

	/**
	 * This method initializes jB_ModSistMon	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_ModSistMon() {
		if (jB_ModSistMon == null) {
			jB_ModSistMon = new JButton();
			jB_ModSistMon.setBounds(new Rectangle(370, 17, 97, 24));
			jB_ModSistMon.setText("Modifica");
			jB_ModSistMon.addActionListener(new java.awt.event.ActionListener() {
				@SuppressWarnings("unchecked")
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()"); 
					// TODO Auto-generated Event stub actionPerformed()
					sm=new InfoSistemaMonetario();
					sm.setNome(jT_NomeSist.getText());
					sm.setNomeOriginale(jT_NomeOrig.getText());
					SistemaMonetario aux=new SistemaMonetario();
					aux.setEnteEmettitore(EEdaModificare);
					aux.setId(((SistemaMonetario)InfoEEdaModificare.getSistemaMonetarioH().get(new Integer((String)jCB_Sistemi.getSelectedItem()))).getId());
					aux.setInfoSM(sm);
					s.put(new Integer((String)jCB_Sistemi.getSelectedItem()).intValue(), aux);
				}
			});
		}
		return jB_ModSistMon;
	}

	/**
	 * This method initializes jCB_Sistemi	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Sistemi() {
		if (jCB_Sistemi == null) {
			jCB_Sistemi = new JComboBox(sistemi);
			jCB_Sistemi.setBounds(new Rectangle(204, 20, 120, 20));
			jCB_Sistemi.setForeground(new Color(255, 255, 255));
			jCB_Sistemi.setBackground(new Color(0, 0, 0));
			jCB_Sistemi.addItemListener(new java.awt.event.ItemListener() {
				public void itemStateChanged(java.awt.event.ItemEvent e) {
					System.out.println("itemStateChanged()"); 
					// TODO Auto-generated Event stub itemStateChanged()
					ism=((SistemaMonetario)InfoEEdaModificare.getSistemaMonetarioH().get(new Integer((String)jCB_Sistemi.getSelectedItem()))).getInfoSM();
					jT_NomeSist.setText(ism.getNome());
					jT_NomeOrig.setText(ism.getNomeOriginale());
				}
			});
		}
		return jCB_Sistemi;
	}

	/**
	 * This method initializes jCB_Unita	
	 * 	
	 * @return javax.swing.JComboBox	
	 */
	private JComboBox getJCB_Unita() {
		if (jCB_Unita == null) {
			jCB_Unita = new JComboBox(unita);
			jCB_Unita.setBounds(new Rectangle(204, 20, 121, 20));
			jCB_Unita.setForeground(new Color(255, 255, 255));
			jCB_Unita.setBackground(new Color(0, 0, 0));
			jCB_Unita.addItemListener(new java.awt.event.ItemListener() {
				public void itemStateChanged(java.awt.event.ItemEvent e) {
					System.out.println("itemStateChanged()");
					// TODO Auto-generated Event stub itemStateChanged()
					iu=((Unita)InfoEEdaModificare.getUnitaH().get(new Integer((String)jCB_Unita.getSelectedItem()).intValue())).getInfoU();
					jT_NomeUnita.setText(iu.getNome());
					jT_NomeOrigUnita.setText(iu.getNomeOriginale());
					jT_FattMolt.setText(iu.getFattoreMonteplicita()+"");
					jL_RelativaA.setText("Relativa a Sistema: "+((Unita)InfoEEdaModificare.getUnitaH().get(new Integer((String)jCB_Unita.getSelectedItem()).intValue())).getSistemaMonetario().idToString());
				}
			});
		}
		return jCB_Unita;
	}

	/**
	 * This method initializes jB_ModUnita	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_ModUnita() {
		if (jB_ModUnita == null) {
			jB_ModUnita = new JButton();
			jB_ModUnita.setBounds(new Rectangle(370, 47, 97, 24));
			jB_ModUnita.setText("Modifica");
			jB_ModUnita.addActionListener(new java.awt.event.ActionListener() {
				@SuppressWarnings("unchecked")
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()");
					// TODO Auto-generated Event stub actionPerformed()
					InfoUnita un=new InfoUnita();
					un.setNome(jT_NomeUnita.getText());
					un.setNomeOriginale(jT_NomeOrigUnita.getText());
					un.setFattoreMonteplicita(new Float(jT_FattMolt.getText()).floatValue());
					uu=new Unita();
					uu.setInfoU(un);
					uu.setSistemaMonetario(((Unita)InfoEEdaModificare.getUnitaH().get(new Integer((String)jCB_Unita.getSelectedItem()).intValue())).getSistemaMonetario());
					uu.setId(((Unita)InfoEEdaModificare.getUnitaH().get(new Integer((String)jCB_Unita.getSelectedItem()).intValue())).getId());
					u.put(uu.getId().getId(), uu);
				}
			});
		}
		return jB_ModUnita;
	}

	/**
	 * This method initializes jT_Note	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Note() {
		if (jT_Note == null) {
			jT_Note = new JTextField();
			jT_Note.setBounds(new Rectangle(392, 54, 155, 20));
			jT_Note.setText(((EnteEmettitore)InfoEEdaModificare.getEnteEmettitoreH().get(EEdaModificare.getId())).getInfoEE().getNote());
		}
		return jT_Note;
	}
	
}  //  @jve:decl-index=0:visual-constraint="10,10"
