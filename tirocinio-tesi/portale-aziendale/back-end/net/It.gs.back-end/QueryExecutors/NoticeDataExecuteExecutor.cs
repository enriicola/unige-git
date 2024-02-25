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

    public class NoticeDataExecuteExecutor : IExecuteWithTransactionExecutor<NoticeData>
    {
        public async Task<IExecuteResult> Execute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, IExecuteInfo info)
        {
            switch(info) {
                case SendNoticeToUsersExecuteInfo i: 
                    return await SendNoticeExecute(settings, connection, transaction, i);
                case DeleteNoticeDataExecuteInfo i:
                    return await DeleteNoticeDataExecute(settings, connection, transaction, i);
                case UpdateNoticeDataExecuteInfo i:
                    return await UpdateNoticeDataExecute(settings, connection, transaction, i);
                default:
                    throw new NotSupportedException($"Execute with transaction for type {info.GetType().FullName} not supported");
            }
        }

        //ADD
        private async Task<IExecuteResult> SendNoticeExecute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, SendNoticeToUsersExecuteInfo info) {
            foreach(var notice in info.Notices) {
                _ = await Add(settings, connection, transaction, notice);
            }

            return await IExecuteResult.From(true);
        }
        private async Task<NoticeData> Add(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, NoticeData item)
        {
            string formattedDate = DateTime.Now.ToString("dd MMMM yyyy");
            item.NoticeDateTime = formattedDate;

            //var sql = $"INSERT INTO {nameof(NoticeData)} VALUES (@{nameof(NoticeData.NoticeId)}, @{nameof(NoticeData.NoticeState)}, @{nameof(NoticeData.NoticeDateTime)}, @{nameof(NoticeData.NoticeTitle)}, @{nameof(NoticeData.NoticeObject)}, @{nameof(NoticeData.NoticeDesc)}, @{nameof(NoticeData.UserId)})";
            var sql = $"INSERT INTO {nameof(NoticeData)} " +
                $"({nameof(NoticeData.NoticeState)}, {nameof(NoticeData.NoticeDateTime)}, {nameof(NoticeData.NoticeTitle)}, {nameof(NoticeData.NoticeObject)}, {nameof(NoticeData.NoticeDesc)}, {nameof(NoticeData.UserId)}) " +
                $"VALUES (@{nameof(NoticeData.NoticeState)}, @{nameof(NoticeData.NoticeDateTime)}, @{nameof(NoticeData.NoticeTitle)}, @{nameof(NoticeData.NoticeObject)}, @{nameof(NoticeData.NoticeDesc)}, @{nameof(NoticeData.UserId)})";

            var r = await connection.ExecuteAsync(sql, item, transaction);
            return item;
        }

        //DELETE
        private async Task<IExecuteResult> DeleteNoticeDataExecute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, DeleteNoticeDataExecuteInfo info) {
            foreach(var notice in info.Notices) {
                _ = Remove(settings, connection, transaction, notice);
            }

            return await IExecuteResult.From(true);
        }
        private async Task<NoticeData> Remove(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, NoticeData item)
        {
            
            var sql = $"DELETE FROM NoticeData WHERE noticeId = @NoticeId";

            var affectedRows = await connection.ExecuteAsync(sql, new { NoticeId = item.NoticeId }, transaction);
            //if su affectedRows, se 1 ok, se 0 throw exception
            var r = await connection.ExecuteAsync(sql, item, transaction);
            return item;
        }
        
        //UPDATE
        private async Task<IExecuteResult> UpdateNoticeDataExecute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, UpdateNoticeDataExecuteInfo info) {
            foreach(var notice in info.Notices) {
                _ = await Update(settings, connection, transaction, notice);
            }

            return await IExecuteResult.From(true);
        }
        private async Task<NoticeData> Update(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, NoticeData item)
        {
            string formattedDate = DateTime.Now.ToString("dd MMMM yyyy");
            item.NoticeDateTime = formattedDate;

            var sql = 
                $"UPDATE {nameof(NoticeData)} " +
                $"SET " +
                $"{nameof(NoticeData.NoticeState)} = @{nameof(NoticeData.NoticeState)}, " +
                $"{nameof(NoticeData.NoticeDateTime)} = @{nameof(NoticeData.NoticeDateTime)}, " +
                $"{nameof(NoticeData.NoticeTitle)} = @{nameof(NoticeData.NoticeTitle)}, " +
                $"{nameof(NoticeData.NoticeObject)} = @{nameof(NoticeData.NoticeObject)}, " +
                $"{nameof(NoticeData.NoticeDesc)} = @{nameof(NoticeData.NoticeDesc)}, " +
                $"{nameof(NoticeData.UserId)} = @{nameof(NoticeData.UserId)} " +
                $"WHERE {nameof(NoticeData.NoticeId)} = @{nameof(NoticeData.NoticeId)}";

            /*var sql = $"UPDATE {nameof(NoticeData)} SET" +
                $"({nameof(NoticeData.NoticeState)}, {nameof(NoticeData.NoticeDateTime)}, {nameof(NoticeData.NoticeTitle)}, {nameof(NoticeData.NoticeObject)}, {nameof(NoticeData.NoticeDesc)}, {nameof(NoticeData.UserId)}) " +
                $"VALUES (@{nameof(NoticeData.NoticeState)}, @{nameof(NoticeData.NoticeDateTime)}, @{nameof(NoticeData.NoticeTitle)}, @{nameof(NoticeData.NoticeObject)}, @{nameof(NoticeData.NoticeDesc)}, @{nameof(NoticeData.UserId)})";
            */
            var r = await connection.ExecuteAsync(sql, item, transaction);
            return item;
        }
    }
}
