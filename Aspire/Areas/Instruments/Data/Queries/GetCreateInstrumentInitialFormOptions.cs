using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Aspire.Areas.Instruments.Models;
using Aspire.Configuration;
using Dapper;
using MediatR;

namespace Aspire.Areas.Instruments.Data.Queries
{
    public class GetCreateInstrumentInitialFormOptions : IRequest<CreateInstrumentInitialFormOptions> { }

    public class GetCreateInstrumentInitialFormOptionsHandler : IRequestHandler<GetCreateInstrumentInitialFormOptions, CreateInstrumentInitialFormOptions>
    {
        private const string _sproc = "[instruments].[sto_get_create_instrument]";

        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        public GetCreateInstrumentInitialFormOptionsHandler(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<CreateInstrumentInitialFormOptions> Handle(GetCreateInstrumentInitialFormOptions message, CancellationToken cancellationToken)
        {
            using (var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                using (var multi = await connection.QueryMultipleAsync(_sproc, commandType: CommandType.StoredProcedure))
                {
                    var instrumentTypes = await multi.ReadAsync<string>();
                    var makes = await multi.ReadAsync<string>();
                    var programs = await multi.ReadAsync<string>();

                    return new CreateInstrumentInitialFormOptions(instrumentTypes, makes, programs);
                }
            }
        }
    }
}


