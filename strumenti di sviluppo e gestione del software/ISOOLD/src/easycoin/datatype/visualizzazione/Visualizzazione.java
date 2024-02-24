package easycoin.datatype.visualizzazione;

import easycoin.enumeration.*;
import easycoin.calculator.Visualizza;
import easycoin.datatype.*;
import javax.swing.ImageIcon;
import javax.swing.JScrollPane;
import java.awt.Dimension;
import javax.swing.JPanel;
import javax.swing.JButton;
import java.awt.Rectangle;

//www.java2s.com

@SuppressWarnings("serial")
public class Visualizzazione extends JScrollPane{
	
	public ImageIcon delico = null;
	public ImageIcon newico = null;
	public ImageIcon modico = null;
	private JPanel jP_Pannello = null;
	private JButton jB_Nuovo = null;
	private JButton jB_Modifica = null;
	private JButton jB_Elimina = null;
	protected Visualizza Vis;

	private Id id;
	/**
	 * This method initializes this
	 * 
	 */
	private void initialize() {
        this.setSize(new Dimension(954, 410));
        this.getViewport().add(getJP_Pannello());
		this.setVisible(true);
	}

	public TipoVis tipo(ModalitaVisualizzazione vis){
		if (vis.getFormato()==Formato.schede) {
			if (vis.getConcisione()==Concisione.completa){
				if(vis.getMostra()==OggettoDaMostrare.Enti_Emettitori)
					return TipoVis.EESchedaCompleto;
				else if(vis.getMostra()==OggettoDaMostrare.Emissioni)
						return TipoVis.ESchedaCompleto;
					else if(vis.getMostra()==OggettoDaMostrare.Tipi_Monete)
							return TipoVis.TMSchedaCompleto;
						else if(vis.getMostra()==OggettoDaMostrare.Monete)
							return TipoVis.MSchedaCompleto;
				}
			else if (vis.getConcisione()==Concisione.ridotta){
				if(vis.getMostra()==OggettoDaMostrare.Enti_Emettitori)
					return TipoVis.EESchedaRidotto;
				else if(vis.getMostra()==OggettoDaMostrare.Emissioni)
						return TipoVis.ESchedaRidotto;
					else if(vis.getMostra()==OggettoDaMostrare.Tipi_Monete)
							return TipoVis.TMSchedaRidotto;
						else if(vis.getMostra()==OggettoDaMostrare.Monete)
							return TipoVis.MSchedaRidotto;
			}
		}else if (vis.getFormato()==Formato.sezioni) {
			if (vis.getConcisione()==Concisione.completa){
				if(vis.getMostra()==OggettoDaMostrare.Enti_Emettitori)
					return TipoVis.EESezioneCompleto;
				else if(vis.getMostra()==OggettoDaMostrare.Emissioni)
						return TipoVis.ESezioneCompleto;
					else if(vis.getMostra()==OggettoDaMostrare.Tipi_Monete)
							return TipoVis.TMSezioneCompleto;
						else if(vis.getMostra()==OggettoDaMostrare.Monete)
							return TipoVis.MSezioneCompleto;
				}
			else if (vis.getConcisione()==Concisione.ridotta){
				if(vis.getMostra()==OggettoDaMostrare.Enti_Emettitori)
					return TipoVis.EESezioneRidotto;
				else if(vis.getMostra()==OggettoDaMostrare.Emissioni)
						return TipoVis.ESezioneRidotto;
					else if(vis.getMostra()==OggettoDaMostrare.Tipi_Monete)
							return TipoVis.TMSezioneRidotto;
						else if(vis.getMostra()==OggettoDaMostrare.Monete)
							return TipoVis.MSezioneRidotto;
			}
		}
		return null;	
	}
	
	//<<create>> niente()
	public Visualizzazione(Visualizza v){
		super();
		/*Creazione Icone*/
		newico = createImageIcon("images/nuovo.png");
		delico = createImageIcon("images/cancella.png");
		modico = createImageIcon("images/modifica.png");
		this.Vis = v;
		initialize();	
	}
	
	public Visualizzazione(Visualizza v,Id id){
		super();
		/*Creazione Icone*/
		newico = createImageIcon("images/nuovo.png");
		delico = createImageIcon("images/cancella.png");
		modico = createImageIcon("images/modifica.png");
		this.Vis = v;
		this.id=id;
		initialize();	
	}
	
	public Visualizzazione(){}

	/*Metodo per la creazione delle icone*/
 	protected static ImageIcon createImageIcon(String path) {
        java.net.URL imgURL = Visualizzazione.class.getResource(path);
        if (imgURL != null) {
            return new ImageIcon(imgURL);
        } else {
            System.err.println("Couldn't find file: " + path);
            return null;
        }
    }

	/**
	 * This method initializes jP_Pannello	
	 * 	
	 * @return javax.swing.JPanel	
	 */
	private JPanel getJP_Pannello() {
		if (jP_Pannello == null) {
			jP_Pannello = new JPanel();
			jP_Pannello.setLayout(null);
			jP_Pannello.setSize(new Dimension(760, 160));
			jP_Pannello.add(getJB_Nuovo(),null);
			jP_Pannello.add(getJB_Modifica(),null);
			jP_Pannello.add(getJB_Elimina(),null);
		}
		return jP_Pannello;
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
	        		if (Vis.getAEC().getGEC().getMv().getMostra().equals(OggettoDaMostrare.Enti_Emettitori)){
	        			Vis.getAEC().inserisciEnteEmettitore();
	        		} else if (Vis.getAEC().getGEC().getMv().getMostra().equals(OggettoDaMostrare.Emissioni)){
	        			Vis.getAEC().inserisciEmissione(id);
	        		} else if (Vis.getAEC().getGEC().getMv().getMostra().equals(OggettoDaMostrare.Tipi_Monete)){
	        			Vis.getAEC().inserisciTipoMoneta(id);
	        		}
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
			jB_Modifica.setEnabled(false);
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
			jB_Elimina.setEnabled(false);
		}
		return jB_Elimina;
	}
}
