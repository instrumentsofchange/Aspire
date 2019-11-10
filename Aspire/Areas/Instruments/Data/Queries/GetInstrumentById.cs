using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Aspire.Areas.Instruments.Models;
using Aspire.Configuration;
using Dapper;
using MediatR;

namespace Aspire.Areas.Instruments.Data.Queries
{
    public class GetInstrumentById : IRequest<Instrument>
    {
        public int Id { get; }

        public GetInstrumentById(int id)
        {
            Id = id;
        }
    }

    public class GetInstrumentByIdHandler : IRequestHandler<GetInstrumentById, Instrument>
    {
        private const string _sproc = "[instruments].[sto_get_instrument_by_id]";

        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        public GetInstrumentByIdHandler(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<Instrument> Handle(GetInstrumentById message, CancellationToken cancellationToken)
        {
            using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return await connection.QuerySingleAsync<Instrument>(_sproc, message, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
