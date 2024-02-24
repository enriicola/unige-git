namespace Examples{

    public class Fruit:Vegetable { }

    class Pear : Fruit{

    }

    class Decana : Pear{

    }

    public class Vegetable{

    }

    public class Examples{
        public void Useless(){
            Pear p = new Pear();
            //var f = new Fruit();
            Fruit f = new Fruit();

            f = p; // ok

            ISet<Fruit> fSet = null;
            ISet<Pear> pSet = null;
            // se penso che gli insieme che ho definito siano covarianti, dovrei poter fare l'assegnazione...
            //fSet = pSet; //...e invece non si può, pensi male! -> no: ISet is countervariant
            pSet = fSet; // ok

            fSet.IsIn(f);
            fSet.IsIn(p);
            pSet.IsIn(p);
            // pSet.IsIn(f); // no: IsIn in ISet<Pear> cannot manage a generic fruit, only Pears!
        }

        public void EvenMoreUseless(){
            I1<int, Fruit, Vegetable, Fruit, bool, Pear> small = null;

            I1<int, Pear, Fruit /*andrebbe bene anche Pear :) */, Vegetable, bool, Fruit> large = null; ; // vedi la dichiarazione dell'interfaccia !!!

            large = small;
        }

    interface I1<T1, in TI1, in TI2, out TO1, T2, out TO2>{
        TO1 M1(TI2 x, T2 y); // va bene perchè il tipo di ritorno è out ed ho un out TO1

        T1 M2(TI1 z, T1 w); // stessa logica...
        TO2 M3(); // stessa logica...
    }

    interface ISet <in T> { // definizione di un generico
        bool IsIn(T elem);
    }
}