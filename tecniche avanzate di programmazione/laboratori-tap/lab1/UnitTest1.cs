using System;

namespace lab1;

public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Test1()
    {
        var num = 5;
        var denom = 7;
        var f = new Fraction(num, denom);

        Assert.Multiple(() => {Assert.That(f.Num, Is.EqualTo(5));
                               Assert.That(f.Den, Is.EqualTo(7));
        });
    }

    [Test]
    public void TestPositiveDenominator()
    {
        var num = 5;
        var denom = -7;
        var f = new Fraction(num, denom);
        var expectedNum = -5;
        var expectedDen = 7;

        Assert.Multiple(() => {
            Assert.That(f.Num, Is.EqualTo(expectedNum));
            Assert.That(f.Den, Is.EqualTo(expectedDen));
        });
    }

    [Test]
    public void TestNormalization()
    {
        var num = 30;
        var denom = 42;
        var f = new Fraction(num, denom);
        var expectedNum = 5;
        var expectedDen = 7;

        Assert.Multiple(() => {
            Assert.That(f.Num, Is.EqualTo(expectedNum));
            Assert.That(f.Den, Is.EqualTo(expectedDen));
        });
    }

    [Test]
    [TestCase(-5,6,-5,6)]
    [TestCase(90,-525, -6, 35)]
    [TestCase(30,42,5,7)]
    public void TestNormalizationParameters(int x,int y,int expectedX,int expectedY)
    {
        var f = new Fraction(x, y);

        Assert.Multiple(() => {
            Assert.That(f.Num, Is.EqualTo(expectedX));
            Assert.That(f.Den, Is.EqualTo(expectedY));
        });
    }

    [Test]
    public void TestDenNotZero()
    {
        var num = 30;
        var denom = 0;
        Assert.That(() => new Fraction(num, denom), Throws.TypeOf<ArgumentException>());
    }


    [Test]
    public void TestOpSum()
    {
        var num = 1;
        var denom = 2;
        var f1 = new Fraction(num, denom);
        var f2 = new Fraction(2, 5);
        var actual = f1 + f2;
        var res = new Fraction(9, 10);
        Assert.That(actual,Is.EqualTo(res));
    }

    [Test]
    public void TestOpSub()
    {
        var num = 10;
        var denom = 5;
        var f1 = new Fraction(num, denom);
        var f2 = new Fraction(5, 5);
        var actual = f1 - f2;
        var res = new Fraction(5, 5);
        Assert.That(actual, Is.EqualTo(res));
    }

    [Test]
    public void TestOpMul()
    {
        var num = 42;
        var denom = 1;
        var f1 = new Fraction(num, denom);
        var f2 = new Fraction(0, 1);
        var actual = f1 * f2;
        var res = new Fraction(0, 1);
        Assert.That(actual, Is.EqualTo(res));
    }

    [Test]
    public void TestOpDiv()
    {
        var num = 10;
        var denom = 1;
        var f1 = new Fraction(num, denom);
        var f2 = new Fraction(44, 22);
        var actual = f1 / f2;
        var res = new Fraction(5, 1);
        Assert.That(actual, Is.EqualTo(res));
    }

    [Test]
    public void TestPippo()
    {
        var f1 = new Fraction(0, 1);
        var f2 = new Fraction(0, 22);
        Assert.That(f1, Is.EqualTo(f2));
    }

    [Test]
    public void TestToString()
    {
        var f1 = new Fraction(42, 1);
        Assert.That(f1.ToString(), Is.EqualTo("42"));
    }

    [Test]
    public void TestImplicitConversion()
    {
        var f1 = new Fraction(42,1);
        Fraction f2 = 42;
        Assert.AreEqual(f1, f2);
    }

    [Test]
    public void TestImplicitConversion2()
    {
        var f1 = new Fraction(0, 1);
        Fraction f2 = 0;
        Assert.AreEqual(f1, f2);
    }

    [Test]
    public void TestEsplicitConversion()
    {
        var f1 = new Fraction(42, 1);
        Assert.That(f1.ToInt(), Is.EqualTo(42));
    }

    [Test]
    public void TestEsplicitConversionException()
    {
        var f1 = new Fraction(42, 11);
        Assert.That(() => f1.ToInt(), Throws.TypeOf<ArgumentException>());
    }
}