using System;
namespace lab1
{
	public class Fraction
	{
        public int Num { get; }
        public int Den { get; }

        public Fraction()
		{
			Num = 0;
			Den = 1;
		}

        public Fraction(int num, int denom)
        {
            int a = num<0? num*-1 : num;
            int b = denom < 0 ? denom * -1 : denom;
            Num = (denom<0? num*-1 : num) / GCD(a,b);
            int pippo = (denom<0? denom * -1 : denom) / GCD(a, b);
            if (pippo != 0)
                Den = pippo;
            else
                throw new ArgumentException("denominator can not be 0 :c");
        }

        public static int GCD(int num1, int num2)
        {
            int Remainder;

            while (num2 != 0)
            {
                Remainder = num1 % num2;
                num1 = num2;
                num2 = Remainder;
            }

            return num1;
        }

        public static Fraction operator +(Fraction a, Fraction b)
        {
            var num = a.Num * b.Den + b.Num * a.Den;
            var denom = a.Den * b.Den;
            return new Fraction(num, denom);
        }

        public static Fraction operator -(Fraction a, Fraction b)
        {
            var num = a.Num * b.Den - b.Num * a.Den;
            var denom = a.Den * b.Den;
            return new Fraction(num, denom);
        }

        public static Fraction operator *(Fraction a, Fraction b)
        {
            var num = a.Num * b.Num;
            var denom = a.Den * b.Den;
            return new Fraction(num, denom);
        }

        public static Fraction operator /(Fraction a, Fraction b)
        {
            if (b.Num == 0)
                throw new ArgumentException("denominator can not be 0 :c");

            var num = a.Num*b.Den;
            var denom = a.Den * b.Num;
            return new Fraction(num, denom);
        }

        public override string ToString()
        {
            return Den != 1 ? $"{Num}/{Den}" : $"{Num}";
        }

        //EQUALS METHOD (equals, ==, != and GetHashCode because visual studio require that if i override the equals method)
        public override bool Equals(object obj)
        {
            Fraction other = obj as Fraction;
            if (0 == Num && 0 == other.Num)
                return true;
            return (Num == other.Num && Den == other.Den);
        }

        public override int GetHashCode()
        {
            return Num * Den;
        }

        public int ToInt()
        {
            if(Den != 1)
                throw new ArgumentException("Denominator must be 1 in this case!");
            return Num;
        }

        public static bool operator ==(Fraction f1, Fraction f2)
        {
            return f1.Equals(f2);
        }

        public static bool operator !=(Fraction f1, Fraction f2)
        {
            return !f1.Equals(f2);
        }

        public static implicit operator Fraction(int i) => new(i,1);
    }
}

