using System.Data;
using System.Data.SqlClient;

    //Data.SqlClient;

namespace Aspire.Configuration
{
    public class IocDbConnectionFactory : IIocDbConnectionFactory
    {
        private readonly string _readOnlyconnectionString;
        private readonly string _readWriteConnectionString;

        public IocDbConnectionFactory(string readOnlyConnectionString, string readWriteConnectionString)
        {
            _readOnlyconnectionString = readOnlyConnectionString;
            _readWriteConnectionString = readWriteConnectionString;
        }

        public IDbConnection GetReadOnlyConnection()
        {
            return new SqlConnection(_readOnlyconnectionString);
        }

        public IDbConnection GetReadWriteConnection()
        {
            return new SqlConnection(_readWriteConnectionString);
        }
    }
}
