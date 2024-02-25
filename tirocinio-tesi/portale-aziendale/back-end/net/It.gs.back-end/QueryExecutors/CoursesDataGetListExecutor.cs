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

    public class CoursesDataGetListExecutor : IGetListExecutor<CoursesData>, IAddExecutor<CoursesData>
    {
        public async Task<CoursesData> Add(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, CoursesData item)
        {
            //var sql = $"INSERT INTO {nameof(CoursesData)} VALUES (@{nameof(CoursesData.CoursesId)}, @{nameof(CoursesData.CoursesName)}, @{nameof(CoursesData.CoursesCapacity)}, @{nameof(CoursesData.CoursesType)}, @{nameof(CoursesData.CoursesDate)})";
                // INSERT INTO table_name (column1, column2, column3, ...)
                // VALUES (value1, value2, value3, ...);
            var sql = $"INSERT INTO CoursesData (CoursesName, CoursesCapacity, CoursesType, CoursesDate) VALUES (@{nameof(CoursesData.CoursesName)}, @{nameof(CoursesData.CoursesCapacity)}, @{nameof(CoursesData.CoursesType)}, @{nameof(CoursesData.CoursesDate)})";

            var r = await connection.ExecuteAsync(sql, item, transaction);
            if(r > 0) {
                return item;
            }
            else {
                throw new InvalidOperationException("BUUUMMMM!!!");
            }
        }

        public async Task<IEnumerable<CoursesData>> GetList(DatabaseSettings settings, IDbConnection connection, Maybe<CoreDynamicQueryPart> query)
        {
            var (countSql, sql, parameters) = query.EnsureOrderBy(nameof(CoursesData.CoursesId)).ComposeWithCount<DapperQueryParametersBuilder, DynamicParameters>($"SELECT * $FROM {nameof(CoursesData)}", nameof(CoursesData.CoursesId), settings);
            var result = await connection.QueryAsync<CoursesData>(sql: sql, param: parameters);
            var count = await connection.QuerySingleAsync<int>(sql: countSql, param: parameters);
            return result.Select(x => { x.Count = count; return x; });
        }
    }
}
