package AppAgenda;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Amigo {
    private String nome;
    private String telefone;
    private String email;
    private int diaNascimento;
    private int mesNascimento;
    private int anoNascimento;
    private Endereco endereco;

    public Amigo(String nome, String telefone, String email, int diaNascimento, int mesNascimento, int anoNascimento , Endereco endereco) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.anoNascimento = anoNascimento;
        this.mesNascimento = mesNascimento;
        this.anoNascimento = anoNascimento;
        this.endereco = endereco;
    }

    // Getters e Setters

    public Endereco getEndereco() {
        return this.endereco;
    }
    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public String getNome() {
        return this.nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return this.telefone;
    }
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return this.email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public int getDiaNascimento() {
        return this.diaNascimento;
    }
    public void setDiaNascimento(int diaNascimento) {
        this.diaNascimento = diaNascimento;
    }

    public int getMesNascimento() {
        return this.mesNascimento;
    }
    public void setMesNascimento(int mesNascimento) {
        this.mesNascimento = mesNascimento;
    }

    public int getAnoNascimento() {
        return this.anoNascimento;
    }
    public void setAnoNascimento(int anoNascimento) {
        this.anoNascimento = anoNascimento;
    }
    /* Fim dos getters e setters */

    /* Métodos */

    // Metodo que calcula quanto tempo falta para o aniversário
    public String calcularDiasParaAniversariar(String nome) {
        String mesNascimento2 = String.format("%02d", mesNascimento);
        String diaNascimento2 = String.format("%02d", diaNascimento);
        String nasceu = diaNascimento2 + "/" + mesNascimento2 + "/" + anoNascimento;
        
        // Pega a data atual
        LocalDate atual = LocalDate.now();
        // Formatação dos dados
        DateTimeFormatter formatada = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate aniversario = LocalDate.parse(nasceu, formatada);

        // Pega o dia atual e o dia do niver em relação ao inicio do ano
        int diasNascimento = aniversario.getDayOfYear();
        int diasAtual = atual.getDayOfYear(); 
        
        // Calcula o periodo entre os dias do aniversario com os dias atuais
        int dias = diasNascimento - diasAtual;
        if(dias > 0) {
            return "Faltam "+ dias+" para seu aniversário";
        } else {
            return "Passaram "+ dias *- 1 + " dias do seu aniversário";
        }
    }

    // Metodo que imprime os dados do amigo
    public String imprimir() {
        // Formata os meses para que fiquem com 2 digitos 
        String mesNascimento2 = String.format("%02d", mesNascimento);
        String diaNascimento2 = String.format("%02d", diaNascimento);

        String saida = 
            "Nome: " + nome +
            "\nE-mail: " + email +
            "\nTelefone: " + telefone +
            "\nAniversário: " + diaNascimento2 + "/" + mesNascimento2 + "/" + anoNascimento +
            "\n" + endereco.imprimir() + "\n";
        return saida;
    }

    /* Fim dos Métodos */
}
