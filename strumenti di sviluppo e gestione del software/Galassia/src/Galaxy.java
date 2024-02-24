
public class Galaxy {

    public String Name;
    public double MegaLightYears;
    public GType GalaxyType; // il tipo era Object, cambiando tutti i tipi in GType in questa classe risolvo il problema alla radice
    
    public Galaxy(String name, double megaLightYears, GType galaxyType) {
        Name = name;
        MegaLightYears = megaLightYears;
        GalaxyType = galaxyType;
    }

    public String getName() {
        return Name;
    }
    public void setName(String name) {
        Name = name;
    }
    public double getMegaLightYears() {
        return MegaLightYears;
    }
    public void setMegaLightYears(double megaLightYears) {
        MegaLightYears = megaLightYears;
    }
    public Object getGalaxyType() {
        return GalaxyType;
    }
    public void setGalaxyType(GType galaxyType) {
        GalaxyType = galaxyType;
    }
}
