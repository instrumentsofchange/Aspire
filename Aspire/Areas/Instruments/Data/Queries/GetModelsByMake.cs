using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Aspire.Areas.Instruments.Models;
using Aspire.Configuration;
using Dapper;
using MediatR;

namespace Aspire.Areas.Instruments.Data.Queries
{
    public class GetModelsByMake : IRequest<IEnumerable<Model>>
    {
        public string Make { get; }

        public GetModelsByMake(string make)
        {
            Make = make;
        }
    }

    public class GetModelsByMakeHandler : IRequestHandler<GetModelsByMake, IEnumerable<Model>>
    {
        private const string sproc = "[programs].[sto_get_models_by_make]";

        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        public GetModelsByMakeHandler(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<IEnumerable<Model>> Handle(GetModelsByMake message, CancellationToken cancellationToken)
        {
            using (var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return await connection.QueryAsync<Model>(sproc, message, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
