% Enrico Pezzano 4825087
% Es2 autovalori

clc
disp("Enrico Pezzano 4825087");
disp("Es2 autovalori");

s = [1 1 1 1 1 1 3 10 4 5 6 8 5 6]; % servirà per creare il grafo con coppie di nodi (s,t)
t = [2 7 6 5 3 4 10 11 10 8 5 9 4 8]; % servirà per creare il grafo con coppie di nodi (s,t)
A = full(adjacency(graph(s,t))); % full() crea matrice completa da una sparsa
fprintf("A = "+newline); disp(A);

syms count;
V0 = zeros(1,11); % vettore di tutti zeri

for i = 1:length(A(:,1))
   count = 0;
   for j = 1:length(A(1,:))
       if A(i,j)==1
           count = count+1;
       end
   end
   V0(i) = count;
end

D = diag(V0);
fprintf("D = "+newline); disp(D);
G = A*inv(D); % come richiesto da consegna
fprintf("G = "+newline); disp(G);

[autovettori,autovalori] = eig(G); % autovalori => matrice diagonale "autovalori"
                                   % la matrice "autovettori" le cui
                                   % colonne sono i corrispondenti
                                   % autovettori (in modo che G*autovettori = autovettori*autovalori)
fprintf("autovalori = "+newline); disp(autovalori);
fprintf("autovettori = "+newline); disp(autovettori);
