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

    public class OfficesDataExecuteExecutor : IExecuteWithTransactionExecutor<OfficesData>
    {
        public async Task<IExecuteResult> Execute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, IExecuteInfo info)
        {
            switch(info) {
                case AddOfficesToDbExecuteInfo i: 
                    return await AddOfficesExecute(settings, connection, transaction, i);
                case DeleteOfficesDataExecuteInfo i:
                    return await DeleteOfficesDataExecute(settings, connection, transaction, i);
                case UpdateOfficesDataExecuteInfo i:
                    return await UpdateOfficesDataExecute(settings, connection, transaction, i);
                default:
                    throw new NotSupportedException($"Execute with transaction for type {info.GetType().FullName} not supported");
            }
        }

        //ADD
        private async Task<IExecuteResult> AddOfficesExecute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, AddOfficesToDbExecuteInfo info) {
            foreach(var office in info.Offices) {
                _ = await Add(settings, connection, transaction, office);
            }

            return await IExecuteResult.From(true);
        }
        private async Task<OfficesData> Add(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, OfficesData item)
        {
            Console.WriteLine("item: ",item);
            var sql = $"INSERT INTO {nameof(OfficesData)} " +
                $"({nameof(OfficesData.OfficesName)}, {nameof(OfficesData.OfficesCapacity)}, {nameof(OfficesData.OfficesType)}, {nameof(OfficesData.UserId)}) " +
                $"VALUES (@{nameof(OfficesData.OfficesName)}, @{nameof(OfficesData.OfficesCapacity)}, @{nameof(OfficesData.OfficesType)}, @{nameof(OfficesData.UserId)})";

            var r = await connection.ExecuteAsync(sql, item, transaction);
            return item;
        }

        //DELETE
        private async Task<IExecuteResult> DeleteOfficesDataExecute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, DeleteOfficesDataExecuteInfo info) {
            foreach(var office in info.Offices) {
                _ = Remove(settings, connection, transaction, office);
            }

            return await IExecuteResult.From(true);
        }
        private async Task<OfficesData> Remove(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, OfficesData item)
        {
            
            var sql = $"DELETE FROM OfficesData WHERE officesId = @OfficesId";

            var affectedRows = await connection.ExecuteAsync(sql, new { OfficesId = item.OfficesId }, transaction);
            //if su affectedRows, se 1 ok, se 0 throw exception
            var r = await connection.ExecuteAsync(sql, item, transaction);
            return item;
        }
        

        //UPDATE
        private async Task<IExecuteResult> UpdateOfficesDataExecute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, UpdateOfficesDataExecuteInfo info) {
            foreach(var office in info.Offices) {
                _ = await Update(settings, connection, transaction, office);
            }

            return await IExecuteResult.From(true);
        }
        private async Task<OfficesData> Update(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, OfficesData item)
        {
            var sql = 
                $"UPDATE {nameof(OfficesData)} " +
                $"SET " +
                $"{nameof(OfficesData.OfficesName)} = @{nameof(OfficesData.OfficesName)}, " +
                $"{nameof(OfficesData.OfficesCapacity)} = @{nameof(OfficesData.OfficesCapacity)}, " +
                $"{nameof(OfficesData.OfficesType)} = @{nameof(OfficesData.OfficesType)}, " +
                $"{nameof(OfficesData.UserId)} = @{nameof(OfficesData.UserId)} " +
                $"WHERE {nameof(OfficesData.OfficesId)} = @{nameof(OfficesData.OfficesId)}";

            var r = await connection.ExecuteAsync(sql, item, transaction);
            return item;
        }
        
    }
}
