package easycoin.datatype.visualizzazione;

import java.awt.Dimension;
import java.awt.Rectangle;
import java.util.Hashtable;
import javax.swing.JButton;
import javax.swing.JLabel;
//import javax.swing.JPanel;
//import javax.swing.JScrollPane;
import javax.swing.JTextField;

import easycoin.calculator.Visualizza;
import easycoin.datatype.Id;

@SuppressWarnings("serial")
public class ESezioneCompleto extends ESezioneRidotto {

	protected String sigla;//sigla della zecca
	protected String descrizione;//descrizione della zecca
	private JLabel jL_Sigla = null;
	private JTextField jT_Sigla = null;
	private JLabel jL_Descrizione = null;
	private JTextField jT_Descrizione = null;
	//private JLabel jL_IdE = null;
	private JLabel jL_Anno = null;
	private JTextField jT_Anno = null;
	//private JScrollPane jSP_Monete = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	/*private JPanel jP_PannelloMonete = null;
	private JPanel auxM = null;
	private JButton jB_NuovoTM = null;
	private JButton jB_ModificaTM = null;
	private JButton jB_EliminaTM = null;*/

	public ESezioneCompleto(Visualizza v,Id idTM,Id idE, String anno, Hashtable monete, String sigla, String descrizione) {
		super(v,idTM,idE, anno, monete);
		this.sigla = sigla;
		this.descrizione = descrizione;
	}
	
	public ESezioneCompleto(Visualizza vis, Id idTM) {
		super(vis, idTM);
		// TODO Auto-generated constructor stub
	}


	public void initialize() {
		this.setLayout(null);
        this.setSize(new Dimension(760, 275));
        //this.add(jL_IdE, null);
        if (idE!=null){
			jL_Anno = new JLabel();
			jL_Anno.setBounds(new Rectangle(45, 15, 45, 20));
			jL_Anno.setText("Anno:");
			//jL_IdE = new JLabel();
			//jL_IdE.setBounds(new Rectangle(10, 10, 20, 20));
			//jL_IdE.setText(idE.idToString());
			jL_Descrizione = new JLabel();
	        jL_Descrizione.setBounds(new Rectangle(225, 45, 77, 20));
	        jL_Descrizione.setText("Descrizione:");
	        jL_Sigla = new JLabel();
	        jL_Sigla.setBounds(new Rectangle(45, 45, 45, 20));
	        jL_Sigla.setText("Sigla:");
	        this.add(jL_Anno, null);
	        this.add(getJT_Anno(), null);
	        //this.add(getJSP_Monete(), null);
	        this.add(jL_Sigla, null);
	        this.add(getJT_Sigla(), null);
	        this.add(jL_Descrizione, null);
	        this.add(getJT_Descrizione(), null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Emissione Sezione Completa"));
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
			jB_Modifica.setBounds(new Rectangle(690, 66, 30, 30));
			if (idE==null)
				jB_Modifica.setEnabled(false);
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
			if (idE==null)
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
	public String getDescrizione() {
		return descrizione;
	}

	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

	public String getSigla() {
		return sigla;
	}

	public void setSigla(String sigla) {
		this.sigla = sigla;
	}
	/**
	 * This method initializes jT_Anno	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Anno() {
		if (jT_Anno == null) {
			jT_Anno = new JTextField();
			jT_Anno.setBounds(new Rectangle(95, 15, 110, 20));
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
			jSP_Monete.setBounds(new Rectangle(15, 75, 650, 190));
			jSP_Monete.setBorder(javax.swing.BorderFactory.createTitledBorder("Monete"));
			jSP_Monete.getViewport().add(getJP_PannelloMonete());
			jSP_Monete.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		}
		return jSP_Monete;
	}
	
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
	}
	
	/**
	 * This method initializes jT_Sigla	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Sigla() {
		if (jT_Sigla == null) {
			jT_Sigla = new JTextField();
			jT_Sigla.setBounds(new Rectangle(95, 45, 110, 20));
			jT_Sigla.setEditable(false);
			jT_Sigla.setText(sigla);
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
			jT_Descrizione.setBounds(new Rectangle(306, 45, 240, 20));
			jT_Descrizione.setEditable(false);
			jT_Descrizione.setText(descrizione);
		}
		return jT_Descrizione;
	}
}  //  @jve:decl-index=0:visual-constraint="10,10"
