package easycoin.datatype.visualizzazione;

import easycoin.datatype.*;

import javax.swing.JPanel;
import java.awt.Dimension;
import javax.swing.JLabel;
import java.awt.Rectangle;
import javax.swing.JTextField;

@SuppressWarnings("serial")
public class ZeccaVis extends JPanel {

	private Id idZ;
	private String sigla;
	private String descrizione;
	private JLabel jL_Id = null;
	private JLabel jL_Sigla = null;
	private JTextField jT_Sigla = null;
	private JLabel jL_Descrizione = null;
	private JTextField jT_Descrizione = null;
	
	public ZeccaVis(Id idZ, String sigla, String descrizione) {
		super();
		this.idZ = idZ;
		this.sigla = sigla;
		this.descrizione = descrizione;
		initialize();
	}

/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
        jL_Descrizione = new JLabel();
        jL_Descrizione.setBounds(new Rectangle(213, 10, 111, 20));
        jL_Descrizione.setText("Descrizione:");
        jL_Sigla = new JLabel();
        jL_Sigla.setBounds(new Rectangle(45, 10, 60, 20));
        jL_Sigla.setText("Sigla:");
        jL_Id = new JLabel();
        jL_Id.setText(idZ.idToString());
        jL_Id.setBounds(new Rectangle(10, 10, 20, 20));
        this.setLayout(null);
        this.setSize(new Dimension(555, 40));
        this.add(jL_Id, null);
        this.add(jL_Sigla, null);
        this.add(getJT_Sigla(), null);
        this.add(jL_Descrizione, null);
        this.add(getJT_Descrizione(), null);
			
	}

	//	Metodi get e set
	public String getDescrizione() {
		return descrizione;
	}

	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

	public Id getIdZ() {
		return idZ;
	}

	public void setIdZ(Id idZ) {
		this.idZ = idZ;
	}

	public String getSigla() {
		return sigla;
	}

	public void setSigla(String sigla) {
		this.sigla = sigla;
	}

	/**
	 * This method initializes jT_Sigla	
	 * 	
	 * @return javax.swing.JTextField	
	 */
	private JTextField getJT_Sigla() {
		if (jT_Sigla == null) {
			jT_Sigla = new JTextField();
			jT_Sigla.setBounds(new Rectangle(111, 10, 80, 20));
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
			jT_Descrizione.setBounds(new Rectangle(336, 10, 206, 20));
			jT_Descrizione.setEditable(false);
			jT_Descrizione.setText(descrizione);
		}
		return jT_Descrizione;
	}
	
}  //  @jve:decl-index=0:visual-constraint="10,10"
