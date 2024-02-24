import java.util.HashSet;
import java.util.Set;

abstract class MovieFilter {
	abstract <T> T accept(MovieFilterVisitor<T> visitor);
}

class TitleContains extends MovieFilter {
	final private String _aString;

	public TitleContains(String aString) {
		this._aString = aString;
	}

	@Override
	public <T> T accept(MovieFilterVisitor<T> visitor) {
		return visitor.visit(this);
	}

	public String getString() {
		return _aString;
	} 
}

class HasGenre extends MovieFilter {
	final private String _genre;

	public HasGenre(String _genre) {
		this._genre = _genre;
	}

	@Override
	public <T> T accept(MovieFilterVisitor<T> visitor) {
		return visitor.visit(this);
	}

	public String getGenre() {
		return _genre;
	} 
}

abstract class CombinedFilter extends MovieFilter {
	final private MovieFilter [] _filters;

	protected CombinedFilter(MovieFilter... filters) {
		if (filters.length==0)
			throw new IllegalArgumentException("filters");
		this._filters = filters;
	}

	public MovieFilter [] getSubFilters() {
		return _filters;
	}
}

class And extends CombinedFilter {
	public And(MovieFilter... _filters) {
		super(_filters);
	}

	@Override
	public <T> T accept(MovieFilterVisitor<T> visitor) {
		return visitor.visit(this);
	}	
}

class Or extends CombinedFilter {
	public Or(MovieFilter... _filters) {
		super(_filters);
	}

	@Override
	public <T> T accept(MovieFilterVisitor<T> visitor) {
		return visitor.visit(this);
	}	
}

interface MovieFilterVisitor<T> {
	T visit(TitleContains titleContainsFilter);
	T visit(HasGenre hasGenreFilter);
	T visit(Or orFilter);
	T visit(And andFilter);
}

class ToString implements MovieFilterVisitor<String> {

	@Override
	public String visit(TitleContains titleContainsFilter) {
		return String.format("title contains <%s>", titleContainsFilter.getString());
	}

	@Override
	public String visit(HasGenre hasGenreFilter) {
		return String.format("has genre <%s>", hasGenreFilter.getGenre());
	}

	private String visitCombinedFilter(CombinedFilter combinedFilter, String op) {
		StringBuilder sb = new StringBuilder("(");
		boolean first = true;
		for(MovieFilter filter : combinedFilter.getSubFilters()) {
			if (first)
				first = false;
			else
				sb.append(" ").append(op).append(" ");
			sb.append(filter.accept(this));
		}
		sb.append(")");
		return sb.toString();
	}

	@Override
	public String visit(Or orFilter) {
		return visitCombinedFilter(orFilter, "or");
	}

	@Override
	public String visit(And andFilter) {
		return visitCombinedFilter(andFilter, "and");
	}	
}

class Eval implements MovieFilterVisitor<Boolean> {
	
	private final Movie _movie;
	
	public Eval(Movie movie) {
		this._movie = movie;
	}

	@Override
	public Boolean visit(TitleContains titleContainsFilter) {
		return this._movie.getTitle().contains(titleContainsFilter.getString());
	}

	@Override
	public Boolean visit(HasGenre hasGenreFilter) {
		for(String genre : this._movie.getGenres())
			if (genre.equals(hasGenreFilter.getGenre()))
				return Boolean.TRUE;
		return Boolean.FALSE;
	}

	@Override
	public Boolean visit(And andFilter) {
		for(MovieFilter filter : andFilter.getSubFilters())
			if (!filter.accept(this))
				return Boolean.FALSE;
		return Boolean.TRUE;
	}

	@Override
	public Boolean visit(Or orFilter) {
		for(MovieFilter filter : orFilter.getSubFilters())
			if (filter.accept(this))
				return Boolean.TRUE;
		return Boolean.FALSE;
	}
}

class Movie {
	private String _title;
	private String [] _genres;
	
	public Movie(String _title, String... _genres) {
		this._title = _title;
		this._genres = _genres;
	}

	public String getTitle() {
		return this._title;
	}

	public String[] getGenres() {
		return this._genres;
	}
	
	@Override 
	public String toString() {
		return this._title;
	}

	// ...
}

public class Movies {
	public static Set<Movie> filter(Set<Movie> movies, MovieFilter filter) {
		Set<Movie> result = new HashSet<Movie>();
		for(Movie movie : movies)
			if (filter.accept(new Eval(movie)))
				result.add(movie);
		return result;
	}
	
	private static void tryFilter(Set<Movie> movies, MovieFilter filter) {
		System.out.printf("%s -> %s\n", filter.accept(new ToString()), filter(movies, filter));
	}

	public static void main(String[] args) {
		Set<Movie> movies = new HashSet<Movie>();
		movies.add(new Movie("The Matrix", "Action", "SciFi"));
		movies.add(new Movie("The Matrix Reloaded", "Action", "SciFi"));
		movies.add(new Movie("Matrix Revolutions", "Action", "Adventure", "SciFi"));
		movies.add(new Movie("Raiders of the Lost Ark", "Action", "Adventure"));
		movies.add(new Movie("Ted", "Comedy", "Fantasy"));
		movies.add(new Movie("Back to the Future", "Comedy", "Adventure", "SciFi"));
		MovieFilter titleMatrix = new TitleContains("Matrix");
		MovieFilter adventure = new HasGenre("Adventure");
		MovieFilter sciFi = new HasGenre("SciFi");
		tryFilter(movies, titleMatrix);
		tryFilter(movies, new And(titleMatrix, adventure));
		tryFilter(movies, adventure);
		tryFilter(movies, sciFi);
		tryFilter(movies, new Or(adventure, sciFi));
		tryFilter(movies, new And(new TitleContains("ed"), new Or(adventure, sciFi)));
		tryFilter(movies, new Or(new TitleContains("ed"), new Or(adventure, sciFi)));
	}
}
