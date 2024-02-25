namespace It.gs.backend.QueryExecutors
{
    using CSharpFunctionalExtensions;
    using It.gs.backend.Model;
    using It.gs.Repository;
    using It.gs.Repository.Model;
    using It.gs.Repository.Settings;
    using System.Data;
    using Dapper;
    using It.gs.Repository.Dapper;
    using It.gs.backend.Utilities;

    public class BookingCoursesDataGetListExecutor : IGetListExecutor<BookingCoursesData>
    {
        public async Task<IEnumerable<BookingCoursesData>> GetList(DatabaseSettings settings, IDbConnection connection, Maybe<CoreDynamicQueryPart> query)
        {
            var (countSql, sql, parameters) = query.EnsureOrderBy(nameof(BookingCoursesData.BookingCoursesId)).ComposeWithCount<DapperQueryParametersBuilder, DynamicParameters>($"SELECT * $FROM {nameof(BookingCoursesData)}", nameof(BookingCoursesData.BookingCoursesId), settings);
            var result = await connection.QueryAsync<BookingCoursesData>(sql: sql, param: parameters);
            var count = await connection.QuerySingleAsync<int>(sql: countSql, param: parameters);
            return result.Select(x => { x.BookingCount = count; return x; });
        }
    }
}