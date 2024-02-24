import AppAgenda.Amigo;
import AppAgenda.Endereco;
import Gerenciador.GerenciadorAmigos;
import javax.swing.JOptionPane;

public class AppAgendaAmigos {
    public static void main(String[] args) {
        int opcao = 0;

        // Executa o laço do programa
        do {
            opcao = Integer.parseInt(
                JOptionPane.showInputDialog(null, "Menu de Opções:\n1- Cadastrar amigo na agenda\n2- Buscar amigo pelo nome\n3- Aniversariante do mês\n4- Listar todos os nome\n5-Sair da agenda")
            );

            switch(opcao) {
                case 1:
                    Amigo amigo = new Amigo(
                        JOptionPane.showInputDialog("Nome:"), 
                        JOptionPane.showInputDialog("Telefone:"), 
                        JOptionPane.showInputDialog("Email:"), 
                        Integer.parseInt(JOptionPane.showInputDialog("Dia de Nascimento")),
                        Integer.parseInt(JOptionPane.showInputDialog("Mês de Nascimento")), 
                        Integer.parseInt(JOptionPane.showInputDialog("Ano de Nascimento")),
                        new Endereco(
                            JOptionPane.showInputDialog("Rua: "),
                            Integer.parseInt(JOptionPane.showInputDialog("Número: ")),
                            JOptionPane.showInputDialog("Complemento: "),
                            JOptionPane.showInputDialog("Cep: "),
                            JOptionPane.showInputDialog("Cidade: "),
                            JOptionPane.showInputDialog("Estado: "))
                    );
                    GerenciadorAmigos.adicionar(amigo);
                break;

                case 2:
                    String procurarAmigo = GerenciadorAmigos.buscarAmigoPeloNome(
                        JOptionPane.showInputDialog("Informe o nome: ")
                    );

                    if(procurarAmigo != null) {
                        JOptionPane.showMessageDialog(null, procurarAmigo);
                    } else {
                        JOptionPane.showMessageDialog(null, "Nenhum amigo encontrado");
                    }
                break;

                case 3:
                    String mesEscolhido = GerenciadorAmigos.aniversarianteDoMes(
                        Integer.parseInt(JOptionPane.showInputDialog("Escolha um mês:"))
                    );
                    JOptionPane.showMessageDialog(null, mesEscolhido);
                break;

                case 4:
                    JOptionPane.showMessageDialog(null, GerenciadorAmigos.listarTodosAmigos());
                break;
                
                case 5:
                    System.exit(0);
                break;

                default:
                    JOptionPane.showMessageDialog(null, "Opção Inválida!\nEscolha uma das funções válida no menu");
            }

        } while(opcao >= 1 && opcao <= 5);
    }
}

