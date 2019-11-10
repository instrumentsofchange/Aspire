using System.Data;

namespace Aspire.Configuration
{
    public interface IIocDbConnectionFactory
    {
        IDbConnection GetReadOnlyConnection();
        IDbConnection GetReadWriteConnection();
    }
}
