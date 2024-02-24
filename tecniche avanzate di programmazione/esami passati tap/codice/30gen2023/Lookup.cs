namespace _30gen2023
{
    public interface IIdentified { public int Key { get; } }

	public class Impl : IIdentified
	{

		private int _key;
		public int Key
		{
			get
			{
				Count++;
				return _key;
			}
			set { _key = value; } // value=valore di sist. che gli do mentre lo sto settando :)
		}

		public int Count { get; set; } = 0;

		public Impl(int Key)
		{
			this.Key = Key;
			this.Count = 0;
		}
	}

    public static class Extension
	{
		public static int? Lookup<T>(this IEnumerable<T?>? db, int what) where T : IIdentified
		{
			if (db == null) throw new ArgumentNullException(nameof(db));
			var pos = 0;
			foreach(var elem in db)
			{
				if(elem == null) throw new ArgumentNullException(nameof(elem));
				if (elem.Key == what)
					return pos;
				pos++;
            }
			return null;
		}
	}
}

