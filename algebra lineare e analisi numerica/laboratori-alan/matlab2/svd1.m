% Enrico Pezzano 4825087
% Es1 SVD

clc
disp("Enrico Pezzano 4825087");
disp("Es1 SVD"+newline);

d0 = 7;
d1 = 8;

m = 10*(d0+1)+d1;
A = [m,3];

% riempimento matrice A
for i=1:m
    for j=1:3
       if (j == 1)
           A(i,j) = 1;
       else
           A(i,j) = i/m;
       end
    end
end

A(:,3)= A(:,3).^2;

[U1,S1,V1] = svd(A);
Vector = diag(S1);
fprintf('Vettore risultante con A: '); fprintf('%.4f, ', Vector);
disp(newline);

[U2,S2,V2] = svd(A');
Vector = diag(S2);
fprintf('Vettore risultante con A trasposto: '); fprintf('%.4f, ', Vector);
disp(newline);

% studiamo il confronto tramite stampa dei valori
disp("Autovalori di AA'");
Vector = eig(A*A.');
fprintf('%.4f, ', Vector);
disp(newline);

disp("Autovalori di A'A");
Vector = eig(A.'*A);
fprintf('%.4f, ', Vector);
disp(newline);

disp("Immagine di A, confrontandola con U:");
Im1 = orth(A);
disp(Im1);

disp("Kern di A, confrontandolo con V':");
Ker1 = null(A);
disp(Ker1);

disp("Immagine di A', confrontandola con U:");
Im2 = orth(A');
disp(Im2);

disp("Kern di A', confrontandolo con V':");
Ker2 = null(A');
disp(Ker2);