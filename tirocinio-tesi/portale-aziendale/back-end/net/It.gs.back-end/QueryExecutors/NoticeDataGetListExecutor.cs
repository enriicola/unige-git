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

    public class NoticeDataGetListExecutor : IGetListExecutor<NoticeData>, IAddExecutor<NoticeData>
    {
        public async Task<NoticeData> Add(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, NoticeData item)
        {
            var sql = $"INSERT INTO {nameof(NoticeData)} VALUES (@{nameof(NoticeData.NoticeId)}, @{nameof(NoticeData.NoticeState)}, @{nameof(NoticeData.NoticeDateTime)}, @{nameof(NoticeData.NoticeTitle)}, @{nameof(NoticeData.NoticeObject)}, @{nameof(NoticeData.NoticeDesc)}, @{nameof(NoticeData.UserId)})";
            var r = await connection.ExecuteAsync(sql, item, transaction);
            if(r > 0) {
                return item;
            }
            else {
                throw new InvalidOperationException("BUUUMMMM!!!");
            }
        }

        public async Task<IEnumerable<NoticeData>> GetList(DatabaseSettings settings, IDbConnection connection, Maybe<CoreDynamicQueryPart> query)
        {
            var (countSql, sql, parameters) = query.EnsureOrderBy(nameof(NoticeData.NoticeId)).ComposeWithCount<DapperQueryParametersBuilder, DynamicParameters>($"SELECT * $FROM {nameof(NoticeData)}", nameof(NoticeData.NoticeId), settings);
            var result = await connection.QueryAsync<NoticeData>(sql: sql, param: parameters);
            var count = await connection.QuerySingleAsync<int>(sql: countSql, param: parameters);
            return result.Select(x => { x.Count = count; return x; });
        }

    }
}
