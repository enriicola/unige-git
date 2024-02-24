import java.util.ArrayList;

public class Program {
    public static void main(String[] args) throws Exception {
        Console.WriteLine("Welcome to Galaxy News!");
        IterateThroughList();
        Console.ReadKey();
    }

    private static void IterateThroughList() {
        ArrayList<Galaxy> galaxies = new ArrayList<Galaxy>(); 
        galaxies.add(new Galaxy("Tadpole", 400, new GType('S')));
        galaxies.add(new Galaxy("Pinwheel",  25, new GType('S')));
        galaxies.add(new Galaxy("Cartwheel", 500, new GType('L')));
        galaxies.add(new Galaxy("Small Magellanic Cloud", .2, new GType('I')));
        galaxies.add(new Galaxy("Andromeda",  3, new GType('S')));
        galaxies.add(new Galaxy("Maffei 1",  11, new GType('S')));

        for (Galaxy g : galaxies) {
            // Console.WriteLine(g.Name + ", " + g.MegaLightYears + ",  " + g.GalaxyType.getGTypeName());
            // Console.WriteLine(g.Name + ", " + g.MegaLightYears + ",  " + g.GalaxyType); // originale
            // Console.WriteLine(g.Name + ", " + g.MegaLightYears + ",  " + ((GType) g.GalaxyType).getMyGType()); // corretta, ma non buona soluzione
            Console.WriteLine(g.Name + ", " + g.MegaLightYears + ",  " + g.GalaxyType.getMyGType()); // originale
        }

        // Expected Output:
            //  Tadpole  400,  Spiral
            //  Pinwheel  25,  Spiral
            //  Cartwheel, 500,  Lenticular
            //  Small Magellanic Cloud, .2,  Irregular
            //  Andromeda,  3,  Spiral
            //  Maffei 1,  11,  Elliptical

    }
}
