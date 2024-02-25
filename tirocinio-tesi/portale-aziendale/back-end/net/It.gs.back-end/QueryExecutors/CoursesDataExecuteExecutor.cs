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

    public class CoursesDataExecuteExecutor : IExecuteWithTransactionExecutor<CoursesData>
    {
        public async Task<IExecuteResult> Execute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, IExecuteInfo info)
        {
            switch(info) {
                case AddCoursesToDbExecuteInfo i: 
                    return await AddCoursesExecute(settings, connection, transaction, i);
                case DeleteCoursesDataExecuteInfo i:
                    return await DeleteCoursesDataExecute(settings, connection, transaction, i);
                case UpdateCoursesDataExecuteInfo i:
                    return await UpdateCoursesDataExecute(settings, connection, transaction, i);
                default:
                    throw new NotSupportedException($"Execute with transaction for type {info.GetType().FullName} not supported");
            }
        }

        //ADD
        private async Task<IExecuteResult> AddCoursesExecute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, AddCoursesToDbExecuteInfo info) {
            foreach(var Course in info.Courses) {
                _ = await Add(settings, connection, transaction, Course);
            }

            return await IExecuteResult.From(true);
        }
        private async Task<CoursesData> Add(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, CoursesData item)
        {
            Console.WriteLine("item: ",item);
            var sql = $"INSERT INTO CoursesData (CoursesName, CoursesCapacity, CoursesType, CoursesDate) VALUES (@{nameof(CoursesData.CoursesName)}, @{nameof(CoursesData.CoursesCapacity)}, @{nameof(CoursesData.CoursesType)}, @{nameof(CoursesData.CoursesDate)})";

            var r = await connection.ExecuteAsync(sql, item, transaction);
            return item;
        }

        //DELETE
        private async Task<IExecuteResult> DeleteCoursesDataExecute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, DeleteCoursesDataExecuteInfo info) {
            foreach(var Course in info.Courses) {
                _ = Remove(settings, connection, transaction, Course);
            }

            return await IExecuteResult.From(true);
        }
        private async Task<CoursesData> Remove(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, CoursesData item)
        {
            
            var sql = $"DELETE FROM CoursesData WHERE CoursesId = @CoursesId";

            var affectedRows = await connection.ExecuteAsync(sql, new { CoursesId = item.CoursesId }, transaction);
            //if su affectedRows, se 1 ok, se 0 throw exception
            var r = await connection.ExecuteAsync(sql, item, transaction);
            return item;
        }
        

        //UPDATE
        private async Task<IExecuteResult> UpdateCoursesDataExecute(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, UpdateCoursesDataExecuteInfo info) {
            foreach(var Course in info.Courses) {
                _ = await Update(settings, connection, transaction, Course);
            }

            return await IExecuteResult.From(true);
        }
        private async Task<CoursesData> Update(DatabaseSettings settings, IDbConnection connection, IDbTransaction transaction, CoursesData item)
        {
            var sql = 
                $"UPDATE {nameof(CoursesData)} " +
                $"SET " +
                $"{nameof(CoursesData.CoursesName)} = @{nameof(CoursesData.CoursesName)}, " +
                $"{nameof(CoursesData.CoursesCapacity)} = @{nameof(CoursesData.CoursesCapacity)}, " +
                $"{nameof(CoursesData.CoursesType)} = @{nameof(CoursesData.CoursesType)}, " +
                $"{nameof(CoursesData.CoursesId)} = @{nameof(CoursesData.CoursesId)}, " +
                $"{nameof(CoursesData.CoursesDate)} = @{nameof(CoursesData.CoursesDate)} " +
                $"WHERE {nameof(CoursesData.CoursesId)} = @{nameof(CoursesData.CoursesId)}";

            var r = await connection.ExecuteAsync(sql, item, transaction);
            return item;
        }
        
    }
}
