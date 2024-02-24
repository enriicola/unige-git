function [lambda, k] =  potenze_inverse(A,tol,nmax,x0,mu,n)
    q = x0/norm(x0);
    k = 0;
    lambda = q.'*A*q;
    flag = true;
    while(flag)
        [L,U,P] = lu(A-mu*eye(n), 'matrix');
        %x_old = q; %debug
        l_old = lambda;
        y = L\P*q;
        x = U\y;
        q = x/norm(x);
        lambda = q.'*A*q;
        k = k+1;
        flag = and((abs(lambda-l_old) >= tol*abs(lambda)),(k<=nmax));
    end
 end
 