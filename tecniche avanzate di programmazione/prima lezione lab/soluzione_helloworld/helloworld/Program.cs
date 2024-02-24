// See https://aka.ms/new-console-template for more information
//Console.WriteLine("Hello, World!");

// https://stackoverflow.com/questions/23811413/is-there-a-shortcut-in-visualstudio-to-create-a-method

// https://learn.microsoft.com/vi-vn/visualstudio/sharepoint/how-to-add-a-parameter-to-a-method?view=vs-2019

public partial class Program{
    // test
    //public static void Main(string[] args)
    //{
    //    Console.WriteLine("Hello, World!");
    //}

    public static int Main(string[] args) // code snippet "sim"
    {

        return 0;
    }
}

class MyFirstClassTotallyUseless{
}

interface I1 //possiamo mettervi solo metodi (e quindi anche properties)
{
    bool A();

    int B { get; }
}

interface I2
{
    int G(int x);
}

class MySecondClass : MyFirstClassTotallyUseless,I2, I1 //figlia:mamma, non posso estendere a più di una classe
{
    int I1.B => throw new NotImplementedException();

    bool I1.A()
    {
        throw new NotImplementedException();
    }

    int I2.G(int x)
    {
        throw new NotImplementedException();
    }
}

class MyClass{

    public object MyProperty { get; set; } // scritto automaticamente con "prop" e TABTAB

    public MyClass(object myProperty, bool b, int x, bool b) // generato con CMD+.
    {
        MyProperty = myProperty;
        B = b;
        X = x;
        B = b;
    }



    private bool b;

    public int X { get; set; }

    public bool getB()
    {
        return b;
    }

    public bool B
    { //get { return b; } set { b = !value; }
        get => b; // non c'entra un tubo con le lambda
        set => b = !value;
    }

    public MyClass(bool b, int x)
    {
        B = b;
        x = x;

        // M(b, x); // visualstudio se ne accorge e propone di aggiungere un argomento al metodo M
    }

    public void M(int x, int y)
    {
        //var o = new MyFirstClassTotallyUseless();
        MyFirstClassTotallyUseless o = new MySecondClass();

        var a = 0;
        var b = 0.0;
    }

    public override bool Equals(object? obj)
    {
        return obj is MyClass @class &&
               EqualityComparer<object>.Default.Equals(MyProperty, @class.MyProperty) &&
               b == @class.b &&
               X == @class.X &&
               B == @class.B;
    }
}