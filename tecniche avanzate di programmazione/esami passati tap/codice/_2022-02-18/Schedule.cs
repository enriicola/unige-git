namespace _18feb2022;
public interface IAppointment
{
    public string PatientName { get; }
    public IEnumerable<DateTime> ProposedTimes { get; }
    public DateTime? SelectedAppointmentTime { get; set; }
}
public class MedicalScheduler
{
    public virtual Dictionary<DateTime, string> Appointments { get; } = new();
    public virtual List<DateTime> FreeSlots { get; set; } = new();
    public IEnumerable<Tuple<string, bool>> Schedule(IEnumerable<IAppointment> requests)
    {
        var res = new List<Tuple<string, bool>>();
        foreach (var r in requests) {
            foreach (var t in r.ProposedTimes) {
                if (FreeSlots.Contains(t)) {
                    FreeSlots.Remove(t);
                    r.SelectedAppointmentTime = t;
                    Appointments.Add(t, r.PatientName);
                    res.Add(new Tuple<string, bool>(r.PatientName, true));
                }
            }
            if (!res.Contains(new Tuple<string, bool>(r.PatientName, true)))
                res.Add(new Tuple<string, bool>(r.PatientName, false));
        }
        return res;
    }
}