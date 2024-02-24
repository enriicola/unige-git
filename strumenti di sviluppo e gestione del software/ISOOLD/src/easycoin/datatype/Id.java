package easycoin.datatype;

//FATTO
public class Id {
	
    private int id;

	public String idToString(){
    	return new Integer(id).toString();
    }
    
    /** Creates a new instance of Id */
    // conn.createStatement().execute("INSERT INTO ENTEEMETTITORE VALUES("
    public Id(){}
    public Id(int id) {
        this.id = id;
    }
    
    public Id(String s){
    	this.id= new Integer(s).intValue();
    }
    
    public int getId(){
        return id;
    }
}
