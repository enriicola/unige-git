package easycoin.datatype.visualizzazione;

import easycoin.datatype.*;

import javax.swing.JPanel;
import java.awt.Dimension;
import javax.swing.JLabel;
import java.awt.Rectangle;
import javax.swing.JTextField;

@SuppressWarnings("serial")
public class SistemaMonetarioVis extends JPanel {

	private Id idSM;
	private String nome;
	private String nomeOriginale;
	//private JLabel jL_Id = null;
	private JLabel jL_Nome = null;
	private JTextField jT_Nome = null;
	private JTextField jT_NomeO = null;
	private JLabel jL_NomeO;
	public SistemaMonetarioVis(Id idSM, String nome, String nomeO) {
		super();
		this.idSM = idSM;
		this.nome = nome;
		this.nomeOriginale=nomeO;
		initialize();
	}

	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
        jL_NomeO = new JLabel();
        jL_NomeO.setBounds(new Rectangle(301, 10, 96, 20));
        jL_NomeO.setText("Nome Originale:");
        jL_Nome = new JLabel();
        jL_Nome.setBounds(new Rectangle(49, 10, 67, 20));
        jL_Nome.setText("Nome:");
        //jL_Id = new JLabel();
        //jL_Id.setText(idSM.idToString());
        //jL_Id.setBounds(new Rectangle(10, 10, 20, 20));
        this.setLayout(null);
        this.setSize(new Dimension(555, 40));
        //this.add(jL_Id, null);
        this.add(jL_Nome, null);
        this.add(getJT_Nome(), null);
        this.add(jL_NomeO, null);
        this.add(getJT_NomeO(), null);
     
			
	}

//	Metodi get e set
	public Id getIdSM() {
		return idSM;
	}

	public void setIdSM(Id idSM) {
		this.idSM = idSM;
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
			jT_Nome.setBounds(new Rectangle(123, 10, 158, 20));
			jT_Nome.setEditable(false);
			jT_Nome.setText(nome);
		}
		return jT_Nome;
	}

	/**
	 * This method initializes jT_NomeO	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_NomeO() {
		if (jT_NomeO == null) {
			jT_NomeO = new JTextField();
			jT_NomeO.setBounds(new Rectangle(400, 10, 140, 20));
			jT_NomeO.setEditable(false);
			jT_NomeO.setText(nomeOriginale);
		}
		return jT_NomeO;
	}
	
}
