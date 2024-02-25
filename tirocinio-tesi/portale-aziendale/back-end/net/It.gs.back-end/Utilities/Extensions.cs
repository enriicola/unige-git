namespace It.gs.backend.Utilities
{
    using CSharpFunctionalExtensions;
    using It.gs.Repository.Model;

    public static class Extensions
    {
        public static IEnumerable<int> Enumerate(this int n, bool zeroIndexed = false) 
        {
            for(int idx = 0; idx < n; idx++) 
            {
                yield return idx + 1;
            }
        }

        private static FilterValueKind GetKindFrom<T>() where T : struct =>
            typeof(T).Equals(typeof(int)) ? FilterValueKind.Integer :
            typeof(T).Equals(typeof(double)) ? FilterValueKind.Float :
            typeof(T).Equals(typeof(float)) ? FilterValueKind.Float :
            typeof(T).Equals(typeof(DateTime)) ? FilterValueKind.Date :
            FilterValueKind.String;

        public static Maybe<CoreDynamicQueryPart> RenameFilters(this Maybe<CoreDynamicQueryPart> @this, params (string From, string To)[] columns) =>
            @this.HasValue && @this.Value.Filtering.HasValue && @this.Value.Filtering.Value.Any() ?
            new CoreDynamicQueryPart
            {
                Filtering = @this.Value.Filtering.Value.Select(f =>
                                columns.Any(p => p.From.Equals(f.Column, StringComparison.InvariantCultureIgnoreCase)) ?
                                new Filter
                                {
                                    Column = columns.First(pair => pair.From.Equals(f.Column, StringComparison.InvariantCultureIgnoreCase)).To,
                                    Kind = f.Kind,
                                    Predicate = f.Predicate,
                                    Prefix = f.Prefix,
                                    Value = f.Value

                                } : f).ToArray(),
                Paging = @this.Value.Paging,
                Ordering = @this.Value.Ordering
            } :
            @this;

        public static Maybe<CoreDynamicQueryPart> RenameOrdering(this Maybe<CoreDynamicQueryPart> @this, params (string From, string To)[] columns) =>
            @this.HasValue && @this.Value.Ordering.HasValue && @this.Value.Ordering.Value.Any() ?
            new CoreDynamicQueryPart
            {
                Ordering = @this.Value.Ordering.Value.Select(o =>
                                columns.Any(p => p.From.Equals(o.Column, StringComparison.InvariantCultureIgnoreCase)) ?
                                new Ordering
                                {
                                    Column = columns.First(pair => pair.From.Equals(o.Column, StringComparison.InvariantCultureIgnoreCase)).To,
                                    ColumnPrefix = o.ColumnPrefix,
                                    Descending = o.Descending,
                                } : o).ToArray(),
                Paging = @this.Value.Paging,
                Filtering = @this.Value.Filtering
            } :
            @this;

        public static (Maybe<Filter[]> Filters, Maybe<CoreDynamicQueryPart> Dqp) ExtractFilters(this Maybe<CoreDynamicQueryPart> @this, params string[] columns) =>
            @this.HasValue && @this.Value.Filtering.HasValue && @this.Value.Filtering.Value.Any() ?
            (@this.Value.Filtering.Value.Where(f => columns.Any(column => f.Column.Equals(column, StringComparison.InvariantCultureIgnoreCase))).ToArray(),
            new CoreDynamicQueryPart
            {
                Ordering = @this.Value.Ordering,
                Paging = @this.Value.Paging,
                Filtering = @this.Value.Filtering.Value.Where(f => !columns.Any(column => f.Column.Equals(column, StringComparison.InvariantCultureIgnoreCase))).ToArray()
            }) :
            (Maybe<Filter[]>.None, @this);

        public static Maybe<CoreDynamicQueryPart> AddOrReplaceEqualFilter<T>(this Maybe<CoreDynamicQueryPart> @this, string column, T value, string prefix = "") where T : struct =>
            @this.AddOrReplaceFilter(new Filter
            {
                Column = column,
                Kind = Enum.GetName(GetKindFrom<T>()),
                Predicate = FilterPredicates.EQUALS,
                Value = Convert.ToString(value),
                Prefix = prefix
            });

        public static Maybe<CoreDynamicQueryPart> EnsureOrderBy(this Maybe<CoreDynamicQueryPart> @this, string column, bool descending = false, string prefix = "") =>
            new CoreDynamicQueryPart
            {
                Ordering = @this.HasValue && @this.Value.Ordering.HasValue && @this.Value.Ordering.Value.Any() ? @this.Value.Ordering : new Ordering[] { new Ordering { Column = column, Descending = descending, ColumnPrefix = prefix } },
                Paging = @this.HasValue ? @this.Value.Paging : Maybe<Page>.None,
                Filtering = @this.HasValue ? @this.Value.Filtering : Maybe<Filter[]>.None
            };

        public static Maybe<CoreDynamicQueryPart> AddOrReplaceFilter(this Maybe<CoreDynamicQueryPart> @this, Filter newFilter) =>
            new CoreDynamicQueryPart
            {
                Ordering = @this.HasValue && @this.Value.Ordering.HasValue ? @this.Value.Ordering : Maybe<Ordering[]>.None,
                Paging = @this.HasValue && @this.Value.Paging.HasValue ? @this.Value.Paging : Maybe<Page>.None,
                Filtering = @this.HasValue && @this.Value.Filtering.HasValue && @this.Value.Filtering.Value.Any() ?
                    Maybe<Filter[]>.From(
                        @this.Value.Filtering.Value.Any(f => f.Column.Equals(newFilter.Column, StringComparison.InvariantCultureIgnoreCase)) ?
                        @this.Value.Filtering.Value.Select(f => f.Column.Equals(newFilter.Column, StringComparison.InvariantCultureIgnoreCase) ? newFilter : f).ToArray() :
                        @this.Value.Filtering.Value.Concat(new List<Filter> { newFilter }).ToArray()) :
                    Maybe<Filter[]>.From(new Filter[] { newFilter }),
            };
    }
}
