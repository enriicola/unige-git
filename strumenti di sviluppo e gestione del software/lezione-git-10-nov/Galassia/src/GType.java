
public class GType {

    public Object MyGType;
    private enum Type {Spiral, Elliptical, Irregular, Lenticular}

    public GType(char type) {
            switch(type)
            {
                case 'S':
                    MyGType = Type.Spiral;
                    break;
                case 'E':
                    MyGType = Type.Elliptical;
                    break;
                // case 'l':
                case 'I':
                    MyGType = Type.Irregular;
                    break;
                case 'L':
                    MyGType = Type.Lenticular;
                    break;
                default:
                    break;
            }
        }

    public Object getMyGType() {
        return MyGType;
    }

    public void setMyGType(Object myGType) {
        MyGType = myGType;
    }

    // sbagliato
    // public String getGTypeName() {
    //     return ""+MyGType;
    // }

    // sbagliato
    // @Override
    // public String toString() {
    //     // return "Cerchio [raggio=" + raggio + "]";
    //     return ToStringBuilder.reflectionToString(this);
    // }
}
