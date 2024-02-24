package easycoin.datatype.visualizzazione;

import java.util.Hashtable;

import easycoin.calculator.Visualizza;
import easycoin.datatype.Id;
import javax.swing.JPanel;
import java.awt.Dimension;
import javax.swing.JLabel;
import java.awt.Rectangle;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JTextField;
import javax.swing.JScrollPane;

@SuppressWarnings("serial")
public class EESezioneRidotto extends JPanel {

	protected Id idEE;  //  @jve:decl-index=0:
	protected String nome;
	protected String areaGeografica;
	protected Hashtable tipiMonete = null; //Sequence(TMSezioneRidotto)  //  @jve:decl-index=0:
	protected Visualizza Vis=null;
	//private JLabel jL_IdEE = null;
	private JLabel jL_Nome = null;
	private JTextField jT_Nome = null;
	private JLabel jL_AreaGeografica = null;
	private JTextField jT_AreaGeografica = null;
	private JScrollPane jSP_TipiMonete = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	private JButton jB_NuovoTM = null;
	private JButton jB_ModificaTM = null;
	private JButton jB_EliminaTM = null;
	protected ImageIcon delico = null;
	protected ImageIcon newico = null;
	protected ImageIcon modico = null;
	private JPanel jP_PannelloTipi = null;
	private JPanel auxT = null;
	
	public EESezioneRidotto(Visualizza v,Id idEE, String nome, String areaGeografica, Hashtable tipiMonete) {
		super();
		this.idEE = idEE;
		this.nome = nome;
		this.areaGeografica = areaGeografica;
		this.tipiMonete = tipiMonete;
		this.Vis=v;
		/*Creazione Icone*/
		newico = Visualizzazione.createImageIcon("images/nuovo.png");
		delico = Visualizzazione.createImageIcon("images/cancella.png");
		modico = Visualizzazione.createImageIcon("images/modifica.png");
	}
	
	

	public EESezioneRidotto(Visualizza vis) {
		Vis = vis;
		/*Creazione Icone*/
		newico = Visualizzazione.createImageIcon("images/nuovo.png");
		delico = Visualizzazione.createImageIcon("images/cancella.png");
		modico = Visualizzazione.createImageIcon("images/modifica.png");
	}



/**
	 * This method initializes this
	 * 
	 */
	public void initialize() {
        this.setLayout(null);
        this.setSize(new Dimension(954,530));
        if (idEE!=null){
	        jL_AreaGeografica = new JLabel();
	        jL_AreaGeografica.setBounds(new Rectangle(265, 60, 102, 20));
	        jL_AreaGeografica.setText("Area Geografica:");
	        jL_Nome = new JLabel();
	        jL_Nome.setBounds(new Rectangle(37, 60, 45, 20));
	        jL_Nome.setText("Nome:");
	        //jL_IdEE = new JLabel();
	        //jL_IdEE.setBounds(new Rectangle(6, 6, 20, 20));
	        //jL_IdEE.setText(idEE.idToString());
	        //this.add(jL_IdEE, null);
	        this.add(jL_Nome, null);
	        this.add(getJT_Nome(), null);
	        this.add(jL_AreaGeografica, null);
	        this.add(getJT_AreaGeografica(), null);
	        this.add(getJSP_TipiMonete(), null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Ente Emettitore Sezione Ridotta"));
	}

	/**
	 * This method initializes jB_Nuovo	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Nuovo() {
		if (jB_Nuovo == null) {
			jB_Nuovo = new JButton(newico);
			jB_Nuovo.setBounds(new Rectangle(860, 26, 30, 30));
			jB_Nuovo.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Nuovo Ente Emettitore");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().inserisciEnteEmettitore();
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
			if (idEE==null)
				jB_Modifica.setEnabled(false);
			jB_Modifica.setBounds(new Rectangle(860, 66, 30, 30));
			jB_Modifica.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Modifica Ente Emettitore");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().modificaEnteEmettitore(idEE);
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
			if (idEE==null)
				jB_Elimina.setEnabled(false);
			jB_Elimina.setBounds(new Rectangle(860, 106, 30, 30));
			jB_Elimina.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Elimina Ente Emettitore");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().eliminaEnteEmettitore(idEE);
	        	}
	        });
		}
		return jB_Elimina;
	}
	
	//	Metodi get e set
	public String getAreaGeografica() {
		return areaGeografica;
	}

	public void setAreaGeografica(String areaGeografica) {
		this.areaGeografica = areaGeografica;
	}

	public Id getIdEE() {
		return idEE;
	}

	public void setIdEE(Id idEE) {
		this.idEE = idEE;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Hashtable getTipiMonete() {
		return tipiMonete;
	}

	public void setTipiMonete(Hashtable tipiMonete) {
		this.tipiMonete = tipiMonete;
	}

	/**
	 * This method initializes jT_Nome	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Nome() {
		if (jT_Nome == null) {
			jT_Nome = new JTextField();
			jT_Nome.setBounds(new Rectangle(94, 60, 154, 20));
			jT_Nome.setEditable(false);
			jT_Nome.setText(nome);
		}
		return jT_Nome;
	}

	/**
	 * This method initializes jT_AreaGeografica	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_AreaGeografica() {
		if (jT_AreaGeografica == null) {
			jT_AreaGeografica = new JTextField();
			jT_AreaGeografica.setBounds(new Rectangle(380, 60, 186, 20));
			jT_AreaGeografica.setEditable(false);
			jT_AreaGeografica.setText(areaGeografica);
		}
		return jT_AreaGeografica;
	}

	/**
	 * This method initializes jSP_TipiMonete	
	 * 	
	 * @return javax.swing.JScrollPane	
	 */
	private JScrollPane getJSP_TipiMonete() {
		if (jSP_TipiMonete == null) {
			jSP_TipiMonete = new JScrollPane();
			jSP_TipiMonete.setBounds(new Rectangle(15, 140, 890, 390));
			jSP_TipiMonete.setBorder(javax.swing.BorderFactory.createTitledBorder("Tipi Monete"));
			jSP_TipiMonete.getViewport().add(getJP_PannelloTipi());
			jSP_TipiMonete.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		}
		return jSP_TipiMonete;
	}
	
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_PannelloTipi() {
		if (jP_PannelloTipi == null) {
			java.awt.GridBagConstraints gridBagConstraints;
			jP_PannelloTipi = new JPanel();
			jP_PannelloTipi.setLayout(new java.awt.GridBagLayout());
			for (int i=0;i<tipiMonete.size();i++){
				auxT=(JPanel)tipiMonete.get(new Integer(i));
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 890;
		        gridBagConstraints.ipady = auxT.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets((i*auxT.getHeight()), 10, 106, 21);
		        jP_PannelloTipi.add(auxT,gridBagConstraints);
			}
			if (tipiMonete.size()==0){
				JPanel p=getJP_PannelloVuoto();
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 890;
		        gridBagConstraints.ipady = p.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets(0, 10, 106, 21);
		        jP_PannelloTipi.add(p,gridBagConstraints);
			}
				
		}
		return jP_PannelloTipi;
	}
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_PannelloVuoto() {
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
	private JButton getJB_NuovoTM() {
		if (jB_NuovoTM == null) {
			jB_NuovoTM = new JButton(newico);
			jB_NuovoTM.setBounds(new Rectangle(800, 26, 30, 30));
			jB_NuovoTM.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Nuovo Tipo Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().inserisciTipoMoneta(idEE);
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
	private JButton getJB_ModificaTM() {
		if (jB_ModificaTM == null) {
			jB_ModificaTM = new JButton(modico);
			jB_ModificaTM.setBounds(new Rectangle(800, 66, 30, 30));
			jB_ModificaTM.setEnabled(false);
		}
		return jB_ModificaTM;
	}

	/**
	 * This method initializes jB_Elimina	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_EliminaTM() {
		if (jB_EliminaTM == null) {
			jB_EliminaTM = new JButton(delico);
			jB_EliminaTM.setBounds(new Rectangle(800, 106, 30, 30));
			jB_EliminaTM.setEnabled(false);
		}
		return jB_EliminaTM;
	}

}  //  @jve:decl-index=0:visual-constraint="-1,0"
