using SUT; //meglio non metterlo dentro il  namespace

namespace TestProject;

public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void PriceLowerThan100PriceAsGiven()
    {
        var receiver = new Customer();
        var itemCost = 42.42;
        var actual = receiver.ExpectedCost(itemCost);

        Assert.That(actual,Is.EqualTo(itemCost));
    }

    [Test]
    ///<summary>
    /// lo si può usare come documentazione se il nome del metodo di test diventa lunghissimo
    ///</summary>
    public void PriceHigherThan100Get3PercentDiscount()
    {
        var receiver = new Customer();
        var itemCost = 200.0;
        var actual = receiver.ExpectedCost(itemCost);
        // var expectedPrice = 194.0; //3% discount as price higher than 100 // BRUTTO ED ECCESSIVAMENTE RIDONDANTE, ALCUNI PERO' PREFERISCONO RISCRIVERSELO

        Assert.That(actual, Is.EqualTo(itemCost*.97));
    }

    [Test]
    public void PriceLowerThan100MoreThan10OrdersGet0dot5PercDiscount()
    {
        var receiver = new Customer();
        receiver.OrderNumber = 12;
        var itemCost = 42.42;
        var actual = receiver.ExpectedCost(itemCost);
        var expectedPrice = 42.2079s; //0.5% discount as customer has done more 10 orders

        Assert.That(actual, Is.EqualTo(expectedPrice));
    }

    [Test]
    public void PriceHigherThan100MoreThan10OrdersGet3dot5PercDiscount()
    {
        var receiver = new Customer();
        receiver.OrderNumber = 12;
        var itemCost = 200;
        var actual = receiver.ExpectedCost(itemCost);
        var expectedPrice = 197; //3.5% discount as customer has done more 10 orders and items cost more than 200

        Assert.That(actual, Is.EqualTo(expectedPrice).Within(0.00001));
    }
}