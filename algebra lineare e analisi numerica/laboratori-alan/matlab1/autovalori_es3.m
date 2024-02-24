% Enrico Pezzano 4825087
% Es3 autovalori

% disp("pippo"); % debug
clc
disp("Enrico Pezzano 4825087");
disp("Es3 autovalori");

A = [1 -1 2; -2 0 5; 6 -3 6];
disp(newline+"A = ");
disp(A);

p = [1; 1; 1];

q = [3; 10; 4];

disp("Applico metodo delle potenze...test con (1, 1, 1) trasposto");
[y,lambda1,i]=potenze(3,A,p,1000,1e-10);
fprintf("y = "); fprintf('%d ', y);
disp(" ");
fprintf("lambda1 = "); fprintf('%d ', lambda1);
disp(" ");
fprintf("i = "); fprintf('%d ', i);

disp(newline+" ");
disp("Test con (3, 10, 4) trasposto");
[y,lambda2,i]=potenze(3,A,q,1000,1e-10);
fprintf("y = "); fprintf('%d ', y);
disp(" ");
fprintf("lambda2 = "); fprintf('%d ', lambda2);
disp(" ");
fprintf("i = "); fprintf('%d ', i);

disp(newline+" ");
disp("Applico metodo delle potenze inverse...primo test con p=4");
[lambda3,i]=potenze_inverse(A,1e-10,1000,p,4,3);
fprintf("y = "); fprintf('%d ', y);
disp(" ");
fprintf("lambda3 = "); fprintf('%d ', lambda3);
disp(" ");
fprintf("i = "); fprintf('%d ', i);

disp(newline+" ");
disp("Secondo test con p=4.5");
[lambda4,i]=potenze_inverse(A,1e-10,1000,q,4.5,3);
fprintf("y = "); fprintf('%d ', y);
disp(" ");
fprintf("lambda4 = "); fprintf('%d ', lambda4);
disp(" ");
fprintf("i = "); fprintf('%d ', i);