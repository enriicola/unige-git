package easycoin.datatype.visualizzazione;

import easycoin.calculator.Visualizza;
import easycoin.datatype.*;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JPanel;
import java.awt.Dimension;
import javax.swing.JLabel;
import java.awt.Rectangle;
import javax.swing.JTextField;

@SuppressWarnings("serial")
public class EESchedaRidotto extends JPanel{

	protected Id idEE;  //  @jve:decl-index=0:
	protected String nome;  //  @jve:decl-index=0:
	protected String areaGeografica;  //  @jve:decl-index=0:
	protected Visualizza Vis;
	//private JLabel jL_Id = null;
	private JLabel jL_EnteEmettitore = null;
	private JTextField jT_Nome = null;
	private JLabel jL_AreaGeografica = null;
	private JTextField jT_AreaGeografica = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	protected ImageIcon delico = null;
	protected ImageIcon newico = null;
	protected ImageIcon modico = null;
	
	public EESchedaRidotto(Visualizza v,Id idEE, String nome, String areaGeografica) {
		super();
		/*Creazione Icone*/
		newico = Visualizzazione.createImageIcon("images/nuovo.png");
		delico = Visualizzazione.createImageIcon("images/cancella.png");
		modico = Visualizzazione.createImageIcon("images/modifica.png");
		this.idEE = idEE;
		this.nome = nome;
		this.areaGeografica = areaGeografica;
		this.Vis=v;
	}

	public EESchedaRidotto(Visualizza vis) {
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
        //jL_Id = new JLabel();
        //jL_Id.setBounds(new Rectangle(10, 10, 20, 20));
        //jL_Id.setText(idEE.idToString());
        this.setLayout(null);
        this.setSize(new Dimension(760, 160));
        //this.add(jL_Id, null);
        if (idEE!=null){
	        jL_AreaGeografica = new JLabel();
	        jL_AreaGeografica.setBounds(new Rectangle(285, 31, 100, 20));
	        jL_AreaGeografica.setText("Area Geografica:");
	        jL_EnteEmettitore = new JLabel();
	        jL_EnteEmettitore.setBounds(new Rectangle(15, 31, 94, 20));
	        jL_EnteEmettitore.setText("Ente Emettitore:");
	        this.add(jL_EnteEmettitore, null);
	        this.add(getJT_Nome(), null);
	        this.add(jL_AreaGeografica, null);
	        this.add(getJT_AreaGeografica(), null);
        }
        this.add(getJB_Nuovo(), null);
        this.add(getJB_Modifica(), null);
        this.add(getJB_Elimina(), null);
        this.setBorder(javax.swing.BorderFactory.createTitledBorder("Ente Emettitore Scheda Ridotta"));
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
			jB_Modifica.setBounds(new Rectangle(690, 66, 30, 30));
			if (idEE==null)
				jB_Modifica.setEnabled(false);
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
			jB_Elimina.setBounds(new Rectangle(690, 106, 30, 30));
			if (idEE==null)
				jB_Elimina.setEnabled(false);
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

	/**
	 * This method initializes jT_Nome	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Nome() {
		if (jT_Nome == null) {
			jT_Nome = new JTextField();
			jT_Nome.setBounds(new Rectangle(113, 31, 143, 20));
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
			jT_AreaGeografica.setBounds(new Rectangle(396, 31, 173, 20));
			jT_AreaGeografica.setEditable(false);
			jT_AreaGeografica.setText(areaGeografica);
		}
		return jT_AreaGeografica;
	}
	
}  
