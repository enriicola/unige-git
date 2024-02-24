% Enrico Pezzano 4825087
% Es1 autovalori

clc
disp("Enrico Pezzano 4825087");
disp("Es1 autovalori"+newline);

d0 = 7;
d1 = 8;
n = 10*(d1+1) + d0;

A = diag(ones(1,n-1),1) + eye(n); % blocco di Jordan n × n
E = zeros(n); % matrice con elementi tutti nulli escluso...
E(n,1) = 2^(-n); %...
B = A+E;

syms lambda;
SA = double(solve(det(A-lambda*eye(n))==0, lambda));
fprintf('SA = '); fprintf('%d', SA);
disp(newline);

SB = double(solve(det(B-lambda*eye(n))==0, lambda));
fprintf('SB = '); fprintf('%d, ', SB);
disp(newline);

VettoreA = eig(A); % eigenvalues...
fprintf('VettoreA = '); fprintf('%d', VettoreA);
disp(newline);

VettoreB = eig(B); % vettore di autovalori di B
fprintf('VettoreB = '); fprintf('%d', VettoreB);
disp(newline);

resultA = isequal(SA,VettoreA); % se sono uguali, 1=>resultA
fprintf('resultA = %d', resultA); disp(newline);

resultB = isequal(SB,VettoreB); % se sono uguali, 1=>resultB
fprintf('resultB = %d', resultB); disp(newline);

% norme richieste per l'esercizio
norma1 = norm(B-A)/norm(A);
fprintf('norma1 = %d', norma1); disp(newline);

norma2 = norm(VettoreB-VettoreA)/norm(VettoreA);
fprintf('norma2 = %d', norma2); disp(newline);

At = A'; % A trasposta
Bt = B'; % B trasposta

SA_trasposto = double(solve(det(At-lambda*eye(n))==0, lambda));
fprintf('SA_trasposto = '); fprintf('%d', SA_trasposto); disp(newline);

SB_trasposto = double(solve(det(Bt-lambda*eye(n))==0, lambda));
fprintf('SB_trasposto = '); fprintf('%d, ', SB_trasposto); disp(newline);

VAt = eig(At); % vettore di autovalori di A trasposta
VBt = eig(Bt); % vettore di autovalori di B trasposta

resultA = isequal(SA_trasposto,VAt);
resultB = isequal(SB_trasposto,VBt);

norma3 = norm(At-A)/norm(A);
fprintf('norma3 = %d', norma3); disp(newline);

norma4 = norm(VAt-VettoreA)/norm(VettoreA);
fprintf('norma4 = %d', norma4); disp(newline);

norma5 = norm(Bt-B)/norm(B);
fprintf('norma5 = %d', norma5); disp(newline);

norma6 = norm(VBt-VettoreB)/norm(VettoreB);
fprintf('norma6 = %d', norma6); disp(newline);