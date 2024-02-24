package example;

/**
 * Hello world!
 *
 */
public class Book {
    String author;
    String title;
    
    public static void main( String[] args )
    {
        System.out.println( "Hello World!" );
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
