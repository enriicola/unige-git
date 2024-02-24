package easycoin.datatype.visualizzazione;

import javax.swing.JPanel;

import easycoin.store.Unita;

import java.awt.Dimension;
import javax.swing.JLabel;
import java.awt.Rectangle;
import javax.swing.JTextField;

@SuppressWarnings("serial")
public class UnitaVis extends JPanel {

	Unita u;
	private JLabel jL_Id = null;
	private JLabel jL_Nome = null;
	private JTextField jT_Nome = null;
	private JLabel jL_NomeO = null;
	private JTextField jT_NomeO = null;
	private JLabel jLFattMolt = null;
	private JTextField jT_FattMolt = null;
	/**
	 * This method initializes 
	 * 
	 */
	public UnitaVis(Unita unita) {
		super();
		this.u=unita;
		initialize();
	}

	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
		jLFattMolt = new JLabel();
		jLFattMolt.setBounds(new Rectangle(37, 40, 116, 20));
		jLFattMolt.setText("Fattore Molteplicità:");
		jL_NomeO = new JLabel();
		jL_NomeO.setBounds(new Rectangle(242, 10, 99, 20));
		jL_NomeO.setText("Nome Originale:");
		jL_Nome = new JLabel();
		jL_Nome.setBounds(new Rectangle(37, 10, 41, 20));
		jL_Nome.setText("Nome:");
		jL_Id = new JLabel();
		jL_Id.setBounds(new Rectangle(10, 10, 20, 20));
		jL_Id.setText(u.getId().idToString());
		this.setLayout(null);
        this.setSize(new Dimension(555, 70));
        this.add(jL_Id, null);
        this.add(jL_Nome, null);
        this.add(getJT_Nome(), null);
        this.add(jL_NomeO, null);
        this.add(getJT_NomeO(), null);
        this.add(jLFattMolt, null);
        this.add(getJT_FattMolt(), null);
			
	}

	/**
	 * This method initializes jT_Nome	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Nome() {
		if (jT_Nome == null) {
			jT_Nome = new JTextField();
			jT_Nome.setBounds(new Rectangle(81, 10, 143, 20));
			jT_Nome.setEditable(false);
			jT_Nome.setText(u.getInfoU().getNome());
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
			jT_NomeO.setBounds(new Rectangle(344, 10, 200, 20));
			jT_NomeO.setEditable(false);
			jT_NomeO.setText(u.getInfoU().getNomeOriginale());
		}
		return jT_NomeO;
	}

	/**
	 * This method initializes jT_FattMolt	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_FattMolt() {
		if (jT_FattMolt == null) {
			jT_FattMolt = new JTextField();
			jT_FattMolt.setBounds(new Rectangle(157, 40, 172, 20));
			jT_FattMolt.setEditable(false);
			jT_FattMolt.setText(u.getInfoU().getFattoreMonteplicita()+"");
		}
		return jT_FattMolt;
	}

}  //  @jve:decl-index=0:visual-constraint="10,10"
