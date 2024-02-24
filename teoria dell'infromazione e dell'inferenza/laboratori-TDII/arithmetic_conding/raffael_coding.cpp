#include <iostream>
#include <iomanip>
#include <string>

struct {
  static std::pair<double,double> getProbabilidade( char c )
  {
    if (c >= 'A' && c <= '['){
      if(c!='['){
        std::cout << "Par de probabilidade do caracter: " << c << "[" <<(c - 'A') * .01 << " ,"<< (c - 'A') * .01 + .01 << "]\n\n";
      }
      return std::make_pair( (c - 'A') * .01, (c - 'A') * .01 + .01);
    }
    else if (c >= 'a' && c <= 'z'){
      std::cout << "Par de probabilidade do caracter: " << c << "[" <<(c - 'a') * .02 + 0.30 << " ,"<< (c - 'a') * .02 + .02 + 0.30 << "]\n\n";
      return std::make_pair( (c - 'a') * .02 + 0.30, (c - 'a') * .02 + .02 + 0.30);
    }
    else if (c >= '(' && c <= '<'){
      std::cout << "Par de probabilidade do caracter: " << c << "[" <<(c - '(') * .01 + 0.85 << " ,"<< (c - '(') * .01 + .01 + 0.85 << "]\n\n";
      return std::make_pair( (c - '(') * .01 + 0.85, (c - '(') * .01 + .01 + 0.85);
    }
    else{
      throw "Caracter fora de alcance";
    }
  }
  static char getSymbol( double d)
  {
    if ( d >= 0.0 && d < 0.27){
      if('A' + static_cast<int>(d*100)<91){
        char c = 'A' + static_cast<int>(d*100);
        std::cout << "Operacao para valor ASCII: 65{A} + (" << d << " X 100) = " << 'A' + static_cast<int>(d*100) <<" | ";
        std::cout << "Caracter: " << c << "\n";
      }
      return 'A' + static_cast<int>(d*100);
    }
    else if ( d >= 0.3 && d < 0.85){
      char c = 'a' + static_cast<int>((d-0.3)*50);
      std::cout << "Operacao para valor ASCII: 97{a} + ((" << d << "-0.03) X 50) = " << 'a' + static_cast<int>((d-0.3)*50) <<" | ";
      std::cout << "Caracter: " << c << "\n";
      return 'a' + static_cast<int>((d-0.3)*50);
    }
    else if ( d >= 0.85 && d < 1.06){
      char c = '(' + static_cast<int>((d-0.85)*100);
      std::cout << "Operacao para valor ASCII: 40{(} + ((" << d << "-0.85) X 100) = " << '(' + static_cast<int>((d-0.85)*100) <<" | ";
      std::cout << "Caracter: " << c << "\n";
      return '(' + static_cast<int>((d-0.85)*100);
    }
    else{
      std::cout << "SIMBOLO: " << d << "\n";
      throw "Caracter fora de alcance";
    }
  }
} model;

double compressao( std::string s)
{
  std::cout << "######### INICIO DA COMPRESSAO ##############" << "\n";
  double maior = 1.0;
  double menor = 0.0;
  for ( char c : s ) {
    double intervalo = maior - menor;
    //Condição para não imprimir calculo do caracter [ de parada
    if(c!='['){
        std::cout << "Limete inferior e superior atual: [" << maior << ", " << menor << "] | Intervalo: " << intervalo << " \n";
    }    
    std::pair<double,double> p = model.getProbabilidade(c);
    maior = menor + intervalo * p.second;
    menor = menor + intervalo * p.first; 
  }
  std::cout << "Fim da compressao: " << menor << " {menor} + (" << maior << " {maior} -"<< menor << " {menor})/2 = " << menor + (maior-menor)/2 <<"\n";
  std::cout << "############ FIM DA COMPRESSAO ##############" << "\n\n\n";
  return menor + (maior-menor)/2;
}

std::string descompressao(double menssagem)
{
  std::cout << "######### INICIO DA DESCOMPRESSAO ###########" << "\n";
  std::string resultado;
  double maior = 1.0;
  double menor = 0.0;
  for ( ; ; ) 
  {
    double intervalo = maior - menor;
    //Condição para não imprimir calculo do caracter [ de parada
    if((((menssagem - menor)/intervalo)<0.26)||(((menssagem - menor)/intervalo)>=0.27)){
        std::cout << "Limete inferior e superior atual: [" << menor << ", " << maior << "] | Intervalo: " << intervalo << " \n";
        std::cout << "Valor atual para Descompressao: (" << menssagem << "{palavra} - " << menor << "{menor}) / " << intervalo << "{intervalo} = " << (menssagem - menor)/intervalo <<"\n";
    }
    char c = model.getSymbol((menssagem - menor)/intervalo);
    resultado += c;
    if ( c == '[' ){
      std::cout << "############ FIM DA DESCOMPRESSAO ###########" << "\n";
      return resultado;
    }
    std::pair<double,double> p = model.getProbabilidade(c);
    maior = menor + intervalo * p.second;
    menor = menor + intervalo * p.first; 
    std::cout << "\n";
  }
}

int main(int, char **)
{
  std::string palavra;
  std::cout << "Palavra para compressao(ate 7 caracteres): ";
  std::cin >> palavra;
  while(palavra.size()>7){
    std::cout << "Voce digitou uma palavra com mais de 7 caracteres!" << "\n";
    std::cout << "Palavra para compressao(ate 7 caracteres): ";
    std::cin >> palavra;
  }
  std::cout << "Palavra inserida: " << palavra << "\n";
  double val = compressao(palavra+'[');
  std::cout << "Valor da Compressao: " 
            << std::setprecision(15)
            << val << "\n\n\n";
  std::string result = descompressao(val);
  result.erase(result.end()-1);
  std::cout << "Descompressao Resultado: " << result << "\n\n\n";
  return 0;
}