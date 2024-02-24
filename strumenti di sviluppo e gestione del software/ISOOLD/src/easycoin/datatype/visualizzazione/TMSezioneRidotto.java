package easycoin.datatype.visualizzazione;

import java.awt.Dimension;
import java.util.Hashtable;
import javax.swing.JPanel;

import easycoin.calculator.Visualizza;
import easycoin.datatype.Id;
import javax.swing.JLabel;
import java.awt.Rectangle;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JTextField;
import javax.swing.JScrollPane;

@SuppressWarnings("serial")
public class TMSezioneRidotto extends JPanel {

	protected Id idTM;  //  @jve:decl-index=0:
	protected String descrizione;
	protected Hashtable emissioni; //Sequence(ESezioneRidotto)  //  @jve:decl-index=0:
	protected Id idEE;
	protected Visualizza Vis;
	//private JLabel jL_IdTM = null;
	private JLabel jL_Descrizione = null;
	private JTextField jT_Descrizione = null;
	private JScrollPane jSP_Emissioni = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	protected ImageIcon delico = null;
	protected ImageIcon newico = null;
	protected ImageIcon modico = null;
	private JPanel jP_PannelloEmissioni = null;
	private JPanel auxE = null;
	private JButton jB_NuovoTM = null;
	private JButton jB_ModificaTM = null;
	private JButton jB_EliminaTM = null;
	
	public TMSezioneRidotto(Visualizza v,Id idEE,Id idTM, String descrizione, Hashtable emissioni) {
		super();
		this.idTM = idTM;
		this.descrizione = descrizione;
		this.emissioni = emissioni;
		this.Vis=v;
		this.idEE=idEE;
		/*Creazione Icone*/
		newico = Visualizzazione.createImageIcon("images/nuovo.png");
		delico = Visualizzazione.createImageIcon("images/cancella.png");
		modico = Visualizzazione.createImageIcon("images/modifica.png");
	}
	
	
	
	public TMSezioneRidotto(Visualizza vis,Id idEE) {
		this.idEE = idEE;
		Vis = vis;
		/*Creazione Icone*/
		newico = Visualizzazione.createImageIcon("images/nuovo.png");
		delico = Visualizzazione.createImageIcon("images/cancella.png");
		modico = Visualizzazione.createImageIcon("images/modifica.png");
	}



	public void initialize() {
        
        //jL_IdTM = new JLabel();
        //jL_IdTM.setBounds(new Rectangle(10, 10, 20, 20));
        //jL_IdTM.setText(idTM.idToString());
        this.setLayout(null);
        this.setSize(new Dimension(840, 360));
        //this.add(jL_IdTM, null);
        if (idTM!=null){
        	jL_Descrizione = new JLabel();
        	jL_Descrizione.setBounds(new Rectangle(62, 15, 119, 20));
        	jL_Descrizione.setText("Descrizione:");
        	this.add(jL_Descrizione, null);
        	this.add(getJT_Descrizione(), null);
        	this.add(getJSP_Emissioni(), null);
        	}
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Tipo Moneta Sezione Ridotta"));
	}
	/**
	 * This method initializes jB_Nuovo	
	 * 	
	 * @return javax.swing.JButton	
	 */
	private JButton getJB_Nuovo() {
		if (jB_Nuovo == null) {
			jB_Nuovo = new JButton(newico);
			jB_Nuovo.setBounds(new Rectangle(800, 26, 30, 30));
			jB_Nuovo.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Nuovo Tipo Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().inserisciTipoMoneta(idEE);
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
			jB_Modifica.setBounds(new Rectangle(800, 66, 30, 30));
			if (idTM==null)
				jB_Modifica.setEnabled(false);
			jB_Modifica.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Modifica Tipo Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		if (idTM!=null)
	        		Vis.getAEC().modificaTipoMoneta(idTM);
	        		
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
			jB_Elimina.setBounds(new Rectangle(800, 106, 30, 30));
			if (idTM==null)
				jB_Elimina.setEnabled(false);
			jB_Elimina.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Elimina Tipo Moneta");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		if (idTM!=null)
	        		Vis.getAEC().eliminaTipoMoneta(idTM);
	        		
	        	}
	        });
		}
		return jB_Elimina;
	}

	
//	Metodi get e set
	public String getDescrizione() {
		return descrizione;
	}

	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

	public Hashtable getEmissioni() {
		return emissioni;
	}

	public void setEmissioni(Hashtable emissioni) {
		this.emissioni = emissioni;
	}

	public Id getIdTM() {
		return idTM;
	}

	public void setIdTM(Id idTM) {
		this.idTM = idTM;
	}

	/**
	 * This method initializes jT_Descrizione	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Descrizione() {
		if (jT_Descrizione == null) {
			jT_Descrizione = new JTextField();
			jT_Descrizione.setBounds(new Rectangle(189, 15, 285, 20));
			jT_Descrizione.setEditable(false);
			jT_Descrizione.setText(descrizione);
		}
		return jT_Descrizione;
	}

	/**
	 * This method initializes jSP_Emissioni	
	 * 	
	 * @return javax.swing.JScrollPane	
	 */
	private JScrollPane getJSP_Emissioni() {
		if (jSP_Emissioni == null) {
			jSP_Emissioni = new JScrollPane();
			jSP_Emissioni.setBounds(new Rectangle(15, 45, 780, 290));
			jSP_Emissioni.setBorder(javax.swing.BorderFactory.createTitledBorder("Emissioni"));
			jSP_Emissioni.getViewport().add(getJP_PannelloEmissioni());
			jSP_Emissioni.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		}
		return jSP_Emissioni;
	}
	
	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_PannelloEmissioni() {
		if (jP_PannelloEmissioni == null) {
			java.awt.GridBagConstraints gridBagConstraints;
			jP_PannelloEmissioni = new JPanel();
			jP_PannelloEmissioni.setLayout(new java.awt.GridBagLayout());
			for (int i=0;i<emissioni.size();i++){
				auxE=(JPanel)emissioni.get(new Integer(i));
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 780;
		        gridBagConstraints.ipady = auxE.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets((i*auxE.getHeight()), 10, 106, 21);
		        jP_PannelloEmissioni.add(auxE,gridBagConstraints);
			}
			if (emissioni.size()==0){
				JPanel p=getJP_PannelloVuoto();
				gridBagConstraints = new java.awt.GridBagConstraints();
		        gridBagConstraints.gridx = 0;
		        gridBagConstraints.gridy = 0;
		        gridBagConstraints.ipadx = 760;
		        gridBagConstraints.ipady = p.getHeight();
		        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
		        gridBagConstraints.insets = new java.awt.Insets(0, 10, 106, 21);
		        jP_PannelloEmissioni.add(p,gridBagConstraints);
			}
		}
		return jP_PannelloEmissioni;
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
			jB_NuovoTM.setBounds(new Rectangle(690, 26, 30, 30));
			jB_NuovoTM.addActionListener(new java.awt.event.ActionListener() {
	        	public void actionPerformed(java.awt.event.ActionEvent e) {
	        		System.out.println("actionPerformed() Nuova Emissione");
	        		// TODO Auto-generated Event stub actionPerformed()
	        		Vis.getAEC().inserisciEmissione(idTM);
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
	private JButton getJB_EliminaTM() {
		if (jB_EliminaTM == null) {
			jB_EliminaTM = new JButton(delico);
			jB_EliminaTM.setBounds(new Rectangle(690, 106, 30, 30));
			jB_EliminaTM.setEnabled(false);
		}
		return jB_EliminaTM;
	}
	
}  //  @jve:decl-index=0:visual-constraint="10,10"
