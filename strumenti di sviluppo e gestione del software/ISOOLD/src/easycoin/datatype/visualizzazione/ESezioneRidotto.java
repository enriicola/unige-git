package easycoin.datatype.visualizzazione;

import easycoin.calculator.Visualizza;
import easycoin.datatype.Id;
import java.awt.Dimension;
import java.util.Hashtable;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.JLabel;
import java.awt.Rectangle;
import javax.swing.JTextField;
//import javax.swing.JScrollPane;

@SuppressWarnings("serial")
public class ESezioneRidotto extends JPanel {

	protected Id idE;  //  @jve:decl-index=0:
	protected String anno;
	protected Hashtable monete; //Sequence(MSezioneRidotto)  //  @jve:decl-index=0:
	protected Id idTM;
	protected Visualizza Vis=null;
	//private JLabel jL_IdE = null;
	private JLabel jL_Anno = null;
	private JTextField jT_Anno = null;
	//private JScrollPane jSP_Monete = null;
	protected ImageIcon delico = null;
	protected ImageIcon newico = null;
	protected ImageIcon modico = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	/*private JPanel jP_PannelloMonete = null;
	private JPanel auxM = null;
	private JButton jB_NuovoTM = null;
	private JButton jB_ModificaTM = null;
	private JButton jB_EliminaTM = null;*/
	
	public ESezioneRidotto(Visualizza v,Id idTM,Id idE, String anno, Hashtable monete) {
		super();
		this.idE = idE;
		this.anno = anno;
		this.monete = monete;
		this.idTM=idTM;
		this.Vis=v;
		/*Creazione Icone*/
		newico = Visualizzazione.createImageIcon("images/nuovo.png");
		delico = Visualizzazione.createImageIcon("images/cancella.png");
		modico = Visualizzazione.createImageIcon("images/modifica.png");
	}


	
	public ESezioneRidotto(Visualizza vis,Id idTM) {
		this.idTM = idTM;
		Vis = vis;
		/*Creazione Icone*/
		newico = Visualizzazione.createImageIcon("images/nuovo.png");
		delico = Visualizzazione.createImageIcon("images/cancella.png");
		modico = Visualizzazione.createImageIcon("images/modifica.png");
	}



	public void initialize() {
		
		//jL_IdE = new JLabel();
		//jL_IdE.setBounds(new Rectangle(10, 10, 20, 20));
		//jL_IdE.setText(idE.idToString());
		this.setLayout(null);
        this.setSize(new Dimension(760, 260));
        //this.add(jL_IdE, null);
        if (idE!=null){
	        jL_Anno = new JLabel();
			jL_Anno.setBounds(new Rectangle(52, 15, 45, 20));
			jL_Anno.setText("Anno:");
	        this.add(jL_Anno, null);
	        this.add(getJT_Anno(), null);
	        //this.add(getJSP_Monete(), null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Emissione Sezione Ridotta"));
	}

	/**
	 * This method initializes jB_Nuovo	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Nuovo() {
		if (jB_Nuovo == null) {
			jB_Nuovo = new JButton(newico);
			jB_Nuovo.setBounds(new Rectangle(690, 26, 30, 30));
			jB_Nuovo.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Nuova Emissione");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().inserisciEmissione(idTM);
	        	}
	        });
		}
		return jB_Nuovo;
	}

	/**
	 * This method initializes jB_Modifica	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Modifica() {
		if (jB_Modifica == null) {
			jB_Modifica = new JButton(modico);
			if(idE==null)
				jB_Modifica.setEnabled(false);
			jB_Modifica.setBounds(new Rectangle(690, 66, 30, 30));
			jB_Modifica.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Modifica Emissione");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().modificaEmissione(idE);
	        	}
	        });
		}
		return jB_Modifica;
	}

	/**
	 * This method initializes jB_Elimina	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Elimina() {
		if (jB_Elimina == null) {
			jB_Elimina = new JButton(delico);
			if(idE==null)
				jB_Elimina.setEnabled(false);
			jB_Elimina.setBounds(new Rectangle(690, 106, 30, 30));
			jB_Elimina.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Elimina Emissione");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().eliminaEmissione(idE);
	        	}
	        });
		}
		return jB_Elimina;
	}
	
//	Metodi get e set
	public String getAnno() {
		return anno;
	}

	public void setAnno(String anno) {
		this.anno = anno;
	}

	public Id getIdE() {
		return idE;
	}

	public void setIdE(Id idE) {
		this.idE = idE;
	}

	public Hashtable getMonete() {
		return monete;
	}

	public void setMonete(Hashtable monete) {
		this.monete = monete;
	}

	/**
	 * This method initializes jT_Anno	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Anno() {
		if (jT_Anno == null) {
			jT_Anno = new JTextField();
			jT_Anno.setBounds(new Rectangle(100, 15, 117, 20));
			jT_Anno.setEditable(false);
			jT_Anno.setText(anno);
		}
		return jT_Anno;
	}

	/**
	 * This method initializes jSP_Monete	
	 * 	
	 * @return javax.swing.JScrollPane	
	 */
	/*private JScrollPane getJSP_Monete() {
		if (jSP_Monete == null) {
			jSP_Monete = new JScrollPane();
			jSP_Monete.setBounds(new Rectangle(15, 45, 650, 190));
			jSP_Monete.setBorder(javax.swing.BorderFactory.createTitledBorder("Monete"));
			jSP_Monete.getViewport().add(getJP_PannelloMonete());
			jSP_Monete.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		}
		return jSP_Monete;
	}*/
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	/*private JPanel getJP_PannelloMonete() {
		if (jP_PannelloMonete == null) {
			java.awt.GridBagConstraints gridBagConstraints;
			jP_PannelloMonete = new JPanel();
			jP_PannelloMonete.setLayout(new java.awt.GridBagLayout());
			for (int i=0;i<monete.size();i++){
				auxM=(JPanel)monete.get(new Integer(i));
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 760;
		        gridBagConstraints.ipady = auxM.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets((i*auxM.getHeight()), 10, 106, 21);
		        jP_PannelloMonete.add(auxM,gridBagConstraints);
			}
			if (monete.size()==0){
				JPanel p=getJP_PannelloVuoto();
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 760;
		        gridBagConstraints.ipady = p.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets(0, 10, 106, 21);
		        jP_PannelloMonete.add(p,gridBagConstraints);
			}
		}
		return jP_PannelloMonete;
	}
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	/*private JPanel getJP_PannelloVuoto() {
			JPanel jP_PannelloVuoto = new JPanel();
			jP_PannelloVuoto.setLayout(null);
			jP_PannelloVuoto.setSize(new Dimension(760, 160));
			jP_PannelloVuoto.add(getJB_NuovoTM(),null);
			jP_PannelloVuoto.add(getJB_ModificaTM(),null);
			jP_PannelloVuoto.add(getJB_EliminaTM(),null);
		return jP_PannelloVuoto;
	}
 	
	/**
	 * This method initializes jB_Nuovo	
	 * 	
	 * @return javax.swing.JButton	
	 */
	/*private JButton getJB_NuovoTM() {
		if (jB_NuovoTM == null) {
			jB_NuovoTM = new JButton(newico);
			jB_NuovoTM.setBounds(new Rectangle(690, 26, 30, 30));
			jB_NuovoTM.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Nuovo Ente Emettitore");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAC().inserireMoneta(idE);
	        		}
	        });
		}
		return jB_NuovoTM;
	}

	/**
	 * This method initializes jB_Modifica	
	 * 	
	 * @return javax.swing.JButton	
	 */
	/*private JButton getJB_ModificaTM() {
		if (jB_ModificaTM == null) {
			jB_ModificaTM = new JButton(modico);
			jB_ModificaTM.setBounds(new Rectangle(690, 66, 30, 30));
			jB_ModificaTM.setEnabled(false);
		}
		return jB_ModificaTM;
	}

	/**
	 * This method initializes jB_Elimina	
	 * 	
	 * @return javax.swing.JButton	
	 */
	/*private JButton getJB_EliminaTM() {
		if (jB_EliminaTM == null) {
			jB_EliminaTM = new JButton(delico);
			jB_EliminaTM.setBounds(new Rectangle(690, 106, 30, 30));
			jB_EliminaTM.setEnabled(false);
		}
		return jB_EliminaTM;
	}*/
	
}  //  @jve:decl-index=0:visual-constraint="10,10"
