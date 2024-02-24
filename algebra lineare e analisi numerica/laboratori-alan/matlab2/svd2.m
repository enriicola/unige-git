% Enrico Pezzano 4825087
% Es2 SVD

clc
disp("Enrico Pezzano 4825087");
disp("Es2 SVD"+newline);

n=0;
for i=1:4
    n = n+5;
    str = fprintf('Matrice di taglia nxn con n=%d', n);
    disp(" "+newline+str+newline);

    [ii,jj] = ndgrid(1:n);
    out = (ii == jj) - (ii < jj);
    disp("Valori singolari e condizionamento in norma 2");
    [U,S,V] = svd(out);
    Vector = diag(out);
    fprintf('%.0f, ', Vector);
    disp(" "+newline+cond(out,2));

    disp(" ");
    disp("Perturbazione in A(n,1) di -2^(2-n)...autovalori della matrice perturbata");
    out(n,1) = out(n,1)-2^(2-n);
    W = eig(out);
    disp(W);
end    