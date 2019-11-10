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
    public class SearchInstruments : IRequest<IEnumerable<Instrument>>
    {
        public string SerialNumber { get; }
        public string Make { get; }

        public SearchInstruments(string serialNumber, string make)
        {
            SerialNumber = serialNumber;
            Make = make;
        }
    }

    public class SearchInstrumentsHandler : IRequestHandler<SearchInstruments, IEnumerable<Instrument>>
    {
        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        private const string _sproc = "[instruments].[sto_search_instruments]";

        public SearchInstrumentsHandler(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<IEnumerable<Instrument>> Handle(SearchInstruments message, CancellationToken cancellationToken)
        {
            using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return await connection.QueryAsync<Instrument>(_sproc, message, commandType: CommandType.StoredProcedure);
            }
        }
    }
}