using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Aspire.Configuration;
using Dapper;
using MediatR;

namespace Aspire.Areas.Instruments.Data.Queries
{
    public class GetMakes : IRequest<IEnumerable<string>> { }

    public class GetMakesHandler : IRequestHandler<GetMakes, IEnumerable<string>>
    {
        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        private const string _sql = @"
            SELECT [description]
            FROM [dbo].[Make]
        ";

        public GetMakesHandler(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<IEnumerable<string>> Handle(GetMakes message, CancellationToken cancellationToken)
        {
            using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return await connection.QueryAsync<string>(_sql);
            }
        }
    }
} 
