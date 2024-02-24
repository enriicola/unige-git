using Moq;
namespace _18feb2022;
public class Tests
{
    [Test]
    public void Test1() {
        var m = new Mock<IAppointment>();
        m.Setup(x => x.PatientName).Returns("giorgio");
        m.Setup(x => x.ProposedTimes).Returns(new[] { new DateTime(2022, 5, 3).AddHours(11) });
        var apps = new List<IAppointment> { m.Object };
        var ms = new MedicalScheduler();
        Assert.That(ms.Schedule(apps), Is.EqualTo(new[] { new Tuple<string, bool>("giorgio", false) }));
    }
    [Test]
    public void Test2()
    {
        var m1 = new Mock<IAppointment>();
        m1.Setup(x => x.PatientName).Returns("ada");
        m1.Setup(x => x.ProposedTimes).Returns(new[] { new DateTime(2022, 7, 2).AddHours(18), new DateTime(2022, 4, 16).AddHours(10) });
        var ms = new MedicalScheduler(); // Create an instance of MedicalScheduler
        ms.FreeSlots = new List<DateTime> { new DateTime(2022, 8, 2).AddHours(8), new DateTime(2022, 4, 16).AddHours(11),
        new DateTime(2022, 4, 16).AddHours(10), new DateTime(2022, 5, 3).AddHours(10) };
        var apps = new List<IAppointment> { m1.Object };
        var expected = new DateTime(2022, 4, 16).AddHours(10);
        ms.Schedule(apps);
        m1.VerifySet(x => x.SelectedAppointmentTime = expected);
    }
    [Test]
    public void Test3() {
        var m1 = new Mock<IAppointment>();
        m1.Setup(x => x.PatientName).Returns("ugo");
        m1.Setup(x => x.ProposedTimes).Returns(new[] { new DateTime(2022, 3, 12).AddHours(15), new DateTime(2022, 3, 13).AddHours(15) });
        var m2 = new Mock<MedicalScheduler>();
        m2.Setup(x => x.FreeSlots).Returns(new List<DateTime> { new DateTime(2022, 8, 20).AddHours(18), new DateTime(2022, 6, 6).AddHours(16),
            new DateTime(2022, 3, 13).AddHours(15), new DateTime(2022, 3, 3).AddHours(15) });
        m2.Setup(x => x.Appointments).Returns(new Dictionary<DateTime, string>
        { { new DateTime(2022, 8, 13).AddHours(10), "franco" }, { new DateTime(2022, 6, 6).AddHours(15), "luca" }, { new DateTime(2022, 6, 6).AddHours(17), "paola" }, });
        var apps = new List<IAppointment> { m1.Object };
        var actual = m2.Object.Schedule(apps);
        m1.VerifySet(x => x.SelectedAppointmentTime = new DateTime(2022, 3, 13).AddHours(15));
        Assert.Multiple(() => {
            Assert.That(actual, Is.EqualTo(new[] { new Tuple<string, bool>("ugo", true) }));
            Assert.That(m2.Object.FreeSlots, Is.EqualTo(new List<DateTime>
            { new DateTime(2022, 8, 20).AddHours(18), new DateTime(2022, 6, 6).AddHours(16), new DateTime(2022, 3, 3).AddHours(15) }));
            Assert.That(m2.Object.Appointments, Is.EqualTo(new Dictionary<DateTime, string>
            { {new DateTime(2022, 8, 13).AddHours(10), "franco"}, {new DateTime(2022, 6, 6).AddHours(15), "luca"}, {new DateTime(2022, 6, 6).AddHours(17), "paola"}, 
            {new DateTime(2022, 3, 13).AddHours(15), "ugo"}, })); 
        });
    }
}