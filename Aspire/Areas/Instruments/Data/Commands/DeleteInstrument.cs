using System;
using System.Threading;
using System.Threading.Tasks;
using Aspire.Configuration;
using Dapper;
using MediatR;

namespace Aspire.Areas.Instruments.Data.Commands
{
    public class DeleteInstrument : IRequest
    {
        public int Id { get; }

        public DeleteInstrument(int id)
        {
            Id = id;
        }
    }

    public class DeleteInstrumentsHandler : IRequestHandler<DeleteInstrument>
    {
        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        public DeleteInstrumentsHandler(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<Unit> Handle(DeleteInstrument message, CancellationToken cancellationToken)
        {
            var sql = @"
                DELETE *
                FROM [dbo].[Instrument]
                WHERE [InstrumentId] = @Id;
            ";

            using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
            {
                await connection.ExecuteAsync(sql, new { Id = message.Id });
            }

            return Unit.Value;
        }
    }
}
