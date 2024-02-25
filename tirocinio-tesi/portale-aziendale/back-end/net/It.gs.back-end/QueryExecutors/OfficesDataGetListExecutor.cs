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

    public class OfficesDataGetListExecutor : IGetListExecutor<OfficesData>, IAddExecutor<OfficesData>
    {
        public async Task<OfficesData> Add(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, OfficesData item)
        {
            var sql = $"INSERT INTO {nameof(OfficesData)} VALUES (@{nameof(OfficesData.OfficesId)}, @{nameof(OfficesData.OfficesName)}, @{nameof(OfficesData.OfficesCapacity)}, @{nameof(OfficesData.OfficesType)}, @{nameof(OfficesData.UserId)})";
            var r = await connection.ExecuteAsync(sql, item, transaction);
            if(r > 0) {
                return item;
            }
            else {
                throw new InvalidOperationException("BUUUMMMM!!!");
            }
        }

        public async Task<IEnumerable<OfficesData>> GetList(DatabaseSettings settings, IDbConnection connection, Maybe<CoreDynamicQueryPart> query)
        {
            var (countSql, sql, parameters) = query.EnsureOrderBy(nameof(OfficesData.OfficesId)).ComposeWithCount<DapperQueryParametersBuilder, DynamicParameters>($"SELECT * $FROM {nameof(OfficesData)}", nameof(OfficesData.OfficesId), settings);
            var result = await connection.QueryAsync<OfficesData>(sql: sql, param: parameters);
            var count = await connection.QuerySingleAsync<int>(sql: countSql, param: parameters);
            return result.Select(x => { x.Count = count; return x; });
        }
    }
}
