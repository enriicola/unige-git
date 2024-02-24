package easycoin.boundary;

import java.awt.Dimension;
import java.awt.Rectangle;
import java.sql.Date;
import java.util.Hashtable;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import easycoin.executor.*;
import easycoin.store.Unita;
import easycoin.datatype.*;

//FATTO
public class InserireEE extends Base {

	private static final long serialVersionUID = -3072713284510747041L;

	//	Attributi derivati da associazioni
	private GestireEasyCatalogo GEC;
//	fine associazioni
	
	/*Servono per passare i dati nel operazione GEC.inserisciEE(e,z,s)*/
	private InfoEnteEmettitore ee;  //  @jve:decl-index=0:
	private Hashtable z = new Hashtable();  //  @jve:decl-index=0:
	private Hashtable s = new Hashtable();  //  @jve:decl-index=0:
	private Hashtable u = new Hashtable();  //  @jve:decl-index=0:
	private InfoZecca zz;
	private Unita uu;
	private InfoSistemaMonetario sm;
	private int ks=-1;
	private int ku=-1;
	private int kz=-1;
	
	/**/
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
	private JLabel jL_Note = null;
	private JTextField jT_Note = null;
	private JLabel jL_SistemaMUnita = null;
	private JLabel jL_Ks = null;
	private JLabel jL_NumZecche = null;
	private JLabel jL_NumSist = null;
	private JLabel jL_NumUnita = null;

	//	<<create>> mkInserireEE(GestireEasyCatalogo gec)
	public InserireEE(GestireEasyCatalogo gec){
		super();
		mystate=INSERIMENTO_EE_APERTO;
		this.GEC=gec;
		initialize();
		setVisible(true);
	}
	
	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
        this.setSize(new Dimension(570, 487));
        this.setTitle("EasyCoin - Inserire Ente Emettitore");
        this.setContentPane(getJContentPane());
			
	}
	
	public void insEE(InfoEnteEmettitore e,Hashtable z,Hashtable s,Hashtable u){
		switch(mystate){
		case INSERIMENTO_EE_APERTO:{
			mystate=ATTESA_CONFERMA_EE;
			this.ee=e;
			this.z=z;
			this.s=s;
			this.u=u;
			msg=new String("Procedere con l'operazione?");
			JOptionPane question = new JOptionPane(msg,JOptionPane.QUESTION_MESSAGE, JOptionPane.YES_NO_OPTION);
			question.setMessage(msg);
			JDialog dialog = question.createDialog(new JFrame(),"");
			dialog.pack();
			dialog.setVisible(true);
			int n = ((Integer)question.getValue()).intValue();
			if ( n == 0) {
				conferma();
				setVisible(false);
				break;
			}
			else {
				annulla();
				break;
				}
			}
		default:{}
		}
	}
	
//	Metodi get e set
	public GestireEasyCatalogo getGEC() {
		return GEC;
	}

	public void setGEC(GestireEasyCatalogo gec) {
		GEC = gec;
	}

	public InfoEnteEmettitore getE() {
		return ee;
	}

	public void setE(InfoEnteEmettitore e) {
		this.ee = e;
	}

	public Hashtable getS() {
		return s;
	}

	public void setS(Hashtable s) {
		this.s = s;
	}

	public Hashtable getZ() {
		return z;
	}

	public void setZ(Hashtable z) {
		this.z = z;
	}
	
	public Hashtable getU() {
		return u;
	}

	public void setU(Hashtable u) {
		this.u = u;
	}
	
	/**
	 * This method initializes jContentPane	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJContentPane() {
		if (jContentPane == null) {
			jL_Note = new JLabel();
			jL_Note.setBounds(new Rectangle(344, 54, 44, 20));
			jL_Note.setForeground(new java.awt.Color(255, 255, 255));
			jL_Note.setText("Note:");
			jL_DataFine = new JLabel();
			jL_DataFine.setBounds(new Rectangle(174, 86, 61, 20));
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
		}
		return jT_AreaGeografica;
	}

	/**
	 * This method initializes jT_AnnoInizio	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_AnnoInizio() {
		if (jT_AnnoInizio == null) {
			jT_AnnoInizio = new JTextField();
			jT_AnnoInizio.setBounds(new Rectangle(87, 86, 73, 20));
		}
		return jT_AnnoInizio;
	}

	/**
	 * This method initializes jT_AnnoFine	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_AnnoFine() {
		if (jT_AnnoFine == null) {
			jT_AnnoFine = new JTextField();
			jT_AnnoFine.setBounds(new Rectangle(239, 86, 73, 20));
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
					ee=new InfoEnteEmettitore();
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
					insEE(ee, z, s, u);
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
					System.out.println("actionPerformed() Annulla Inserimento");
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
			jL_NumZecche = new JLabel();
			jL_NumZecche.setBounds(new Rectangle(299, 20, 168, 20));
			jL_NumZecche.setText("Numero Zecche inserite : "+(kz+1));
			jL_NumZecche.setForeground(new java.awt.Color(255, 255, 255));
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
			jP_Zecche.add(jL_NumZecche, null);
			
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
			jL_NumSist = new JLabel();
			jL_NumSist.setBounds(new Rectangle(254, 20, 214, 20));
			jL_NumSist.setForeground(new java.awt.Color(255, 255, 255));
			jL_NumSist.setText("Numero Sistemi Monetari inseriti: "+(ks+1));
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
			jP_SistemiM.setBounds(new Rectangle(15, 207, 530, 197));
			jP_SistemiM.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Sistemi Monetari", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Tahoma", 0, 11), new java.awt.Color(255, 255, 255)));
			jP_SistemiM.add(jL_NomeSist, null);
			jP_SistemiM.add(getJT_NomeSist(), null);
			jP_SistemiM.add(jL_NomeOrig, null);
			jP_SistemiM.add(getJT_NomeOrig(), null);
			jP_SistemiM.add(getJB_InserisciSist(), null);
			jP_SistemiM.setBackground(new java.awt.Color(0, 0, 0));
			jP_SistemiM.add(getJP_Unita(), null);
			jP_SistemiM.add(jL_NumSist, null);
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
			jB_InserisciZecca.setText("Inserisci");
			jB_InserisciZecca.addActionListener(new java.awt.event.ActionListener() {
				@SuppressWarnings("unchecked")
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed() Inserisci Zecca"); 
					// TODO Auto-generated Event stub actionPerformed()
					zz=new InfoZecca();
					zz.setSigla(jT_Sigla.getText());
					zz.setDescrizione(jT_Descrizione.getText());
					kz++;
					z.put(kz, zz);
					jL_NumZecche.setText("Numero Zecche inserite : "+(kz+1));
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
			jB_InserisciSist.setText("Inserisci");
			jB_InserisciSist.addActionListener(new java.awt.event.ActionListener() {
				@SuppressWarnings("unchecked")
				public void actionPerformed(java.awt.event.ActionEvent e) {
					System.out.println("actionPerformed()Inserisci Sistema Monetario");
					// TODO Auto-generated Event stub actionPerformed()
					jB_InserisciUnita.setEnabled(true);
					sm=new InfoSistemaMonetario();
					sm.setNome(jT_NomeSist.getText());
					sm.setNomeOriginale(jT_NomeOrig.getText());
					ks++;
					jL_Ks.setText(jT_NomeSist.getText());
					s.put(ks, sm);
					jL_NumSist.setText("Numero Sistemi Monetari inseriti: "+(ks+1));
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
			jL_NumUnita = new JLabel();
			jL_NumUnita.setBounds(new Rectangle(335, 50, 166, 20));
			jL_NumUnita.setText("Numero Unità Inserite: "+(ku+1));
			jL_NumUnita.setForeground(new java.awt.Color(255, 255, 255));
			jL_Ks = new JLabel();
			jL_Ks.setBounds(new Rectangle(334, 20, 134, 20));
			jL_Ks.setForeground(new java.awt.Color(255, 255, 255));
			jL_Ks.setText("");
			jL_SistemaMUnita = new JLabel();
			jL_SistemaMUnita.setBounds(new Rectangle(231, 20, 99, 20));
			jL_SistemaMUnita.setForeground(new java.awt.Color(255, 255, 255));
			jL_SistemaMUnita.setText("Unità relativa a: ");
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
			jP_Unita.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Unità", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.DEFAULT_POSITION, new java.awt.Font("Tahoma", 0, 11), new java.awt.Color(255, 255, 255)));
			jP_Unita.setBounds(new Rectangle(8, 81, 511, 110));
			jP_Unita.add(jLNomeUnita, null);
			jP_Unita.add(getJT_NomeUnita(), null);
			jP_Unita.add(jL_NomeOrigUnita, null);
			jP_Unita.add(getJT_NomeOrigUnita(), null);
			jP_Unita.add(jL_FattMolt, null);
			jP_Unita.add(getJT_FattMolt(), null);
			jP_Unita.add(getJB_InserisciUnita(), null);
			jP_Unita.setBackground(new java.awt.Color(0, 0, 0));
			jP_Unita.add(jL_SistemaMUnita, null);
			if (ks<0) jP_Unita.setEnabled(false);
			jP_Unita.add(jL_Ks, null);
			jP_Unita.add(jL_NumUnita, null);
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
			jB_InserisciUnita.setText("Inserisci");
			jB_InserisciUnita.setEnabled(false);
			jB_InserisciUnita.addActionListener(new java.awt.event.ActionListener() {
				@SuppressWarnings("unchecked")
				public void actionPerformed(java.awt.event.ActionEvent e) {
					try{
					System.out.println("actionPerformed() Inserisci Unita");
					// TODO Auto-generated Event stub actionPerformed()
					uu=new Unita();
					uu.setSistemaMonetario(new Id(ks));
					InfoUnita uuu=new InfoUnita();
					uuu.setNome(jT_NomeUnita.getText());
					uuu.setNomeOriginale(jT_NomeOrigUnita.getText());
					uuu.setFattoreMonteplicita(new Float(jT_FattMolt.getText()).floatValue());
					uu.setInfoU(uuu);
					ku++;
					u.put(ku, uu);
					jL_NumUnita.setText("Numero Unità Inserite: "+(ku+1));
					}catch(java.lang.NumberFormatException ex){System.out.print("Il campo Fattore molteplicità deve essere un numero");}
				}
			});
		}
		return jB_InserisciUnita;
	}

	/**
	 * This method initializes jT_Note	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Note() {
		if (jT_Note == null) {
			jT_Note = new JTextField();
			jT_Note.setBounds(new Rectangle(394, 54, 153, 20));
		}
		return jT_Note;
	}
	
}  //  @jve:decl-index=0:visual-constraint="10,10" 