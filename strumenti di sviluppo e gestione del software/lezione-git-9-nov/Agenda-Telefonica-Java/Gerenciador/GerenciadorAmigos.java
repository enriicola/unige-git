package Gerenciador;
import AppAgenda.Amigo;
import java.util.ArrayList;

public class GerenciadorAmigos {
    // Agenda feita com ArrayList
    static ArrayList<Amigo> agenda = new ArrayList();
    // Método que add um novo contato a agenda
    public static void adicionar(Amigo contato) {
        agenda.add(contato);
    }

    public static String buscarAmigoPeloNome(String nome) {
        // Percorrer todo o ArrayList
        String saida = "";
        for(Amigo amigo : agenda) {
            if(amigo.getNome().equalsIgnoreCase(nome)) {
                return nome + "\n" + amigo.calcularDiasParaAniversariar(nome);
            } else {
                saida = "Nenhum amigo encontrado";
            }
        }
        return saida;
    }

    // Método que recebe um mês e retorna todos os aniversariantes
    public static String aniversarianteDoMes(int mes) {
        String saida = "";
        for(Amigo amigo : agenda) {
            if(mes == amigo.getMesNascimento()) {
                saida = amigo.getNome() + "\n";
                return saida; // Retorna todos os nomes encontrados
            }
        }
        return null;
    }

    // Método para imprimir a agenda por completo
    public static String listarTodosAmigos() {
        String saida = "";
        if(agenda.isEmpty()) {
            saida = "Nenhum amigo encontrado!";
        } else {
            for(Amigo amigo : agenda) {
                saida = saida + amigo.imprimir() + "\n";
            }
        }
        return saida;
    }
}
