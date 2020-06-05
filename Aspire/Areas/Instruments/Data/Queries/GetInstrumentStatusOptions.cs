using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Aspire.Configuration;
using Dapper;
using MediatR;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Instruments.Data.Queries
{
    public class GetInstrumentStatusOptions : IRequest<IEnumerable<SelectListItem>> { }

    public class GetInstrumentStatusOptionsHandler : IRequestHandler<GetInstrumentStatusOptions, IEnumerable<SelectListItem>>
	{
		private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

		public GetInstrumentStatusOptionsHandler(IIocDbConnectionFactory iocDbConnectionFactory)
		{
			_iocDbConnectionFactory = iocDbConnectionFactory;
		}

        public async Task<IEnumerable<SelectListItem>> Handle(GetInstrumentStatusOptions message, CancellationToken cancellationToken)
		{
            var sql = @"
                SELECT [Status]
                FROM [dbo].[InstrumentStatus]
            ";

            using(var connection  = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return (await connection.QueryAsync<string>(sql))
                    .Select(status => new SelectListItem(status, status));
            }
		}
	}
}
