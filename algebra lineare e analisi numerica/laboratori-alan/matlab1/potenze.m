% n = dimensione della matrice quadrata e del vetore
% a matrice <3
% y = vettore autovalori
% it_max = numero max di iterazioni
% tol = tolleranza dell'errore

function [y,lambda,it_num] = potenze(n,a,y,it_max,tol)
  debug = false;
  if (debug)
    fprintf(1,'\n');
    fprintf(1,'     IT      Lambda          Delta-Lambda    Delta-Y\n');
    fprintf(1,'\n');
  end
  y = y ( : );
  lambda = 0.0;
  y = y / norm (y);
  it_num = 0;
  y_old = y;
  ay = a * y;
  lambda = y' * ay;
  y = ay / norm(ay);
  if(lambda < 0.0)
    y = - y;
  end
  val_dif = 0.0;
  cos_y1y2 = y' * y_old;
  sin_y1y2 = sqrt((1.0 - cos_y1y2) * (1.0 + cos_y1y2));
  if(debug)
    fprintf (1,'  %5d  %14e  %14e  %14e\n',it_num,lambda,val_dif,sin_y1y2);
  end 
  for it_num = 1 : it_max
    lambda_old = lambda;
    y_old = y;
    ay = a * y;
    lambda = y' * ay;
    y = ay / norm (ay);
    if (lambda < 0.0)
      y = - y;
    end
    val_dif = abs (lambda - lambda_old);
    sin_y1y2 = 0;
    cos_y1y2 = y' * y_old;
    sin_y1y2 = sqrt((1.0 - cos_y1y2) * (1.0 + cos_y1y2));
    if (debug)
      fprintf (1,'  %5d  %14e  %14e  %14e\n',it_num,lambda,val_dif,sin_y1y2);
    end
    if (val_dif <= tol)
      break
    end 
  end
  y = ay / lambda;
  return
end
