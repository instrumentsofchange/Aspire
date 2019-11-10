using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Aspire.Areas.Instruments.Models;
using Aspire.Configuration;
using Dapper;
using MediatR;

namespace Aspire.Areas.Instruments.Data.Commands
{
    public class SaveInstrument : IRequest<int>
    {
        public Instrument Instrument { get; }

        public SaveInstrument(Instrument instrument)
        {
            Instrument = instrument;
        }
    }

    public class SaveInstrumentHandler : IRequestHandler<SaveInstrument, int>
    {
        private const string _sproc = "[dbo].[sto_save_instrument]";

        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        public SaveInstrumentHandler(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<int> Handle(SaveInstrument message, CancellationToken cancellationToken)
        {
            using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
            {
                var instrument = message.Instrument;

                var sprocParameters = new
                {
                    InstrumentId = instrument.Id,
                    instrument.Make,
                    instrument.Model,
                    instrument.InstrumentType,
                    instrument.Program,
                    instrument.Student,
                    //UserId = null,
                    instrument.SerialNumber,
                    instrument.Notes
                };

                return await connection.QuerySingleAsync<int>(_sproc, sprocParameters, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
