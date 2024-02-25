namespace It.gs.backend.QueryExecutors
{
    using Dapper;
    using System.Data;

    public class DecimalTypeHandler : SqlMapper.TypeHandler<decimal>
    {
        public override void SetValue(IDbDataParameter parameter, decimal value)
        {
            parameter.Value = Convert.ToDecimal(value);
        }

        public override decimal Parse(object value)
        {
            return Convert.ToDecimal(value);
        }
    }
}
