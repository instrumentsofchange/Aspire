using System.Threading;
using System.Threading.Tasks;
using Aspire.Areas.Instruments.Models;
using Aspire.Configuration;
using Dapper;
using MediatR;

namespace Aspire.Areas.Instruments.Data.Queries
{
  public class GetSearchFormOptions : IRequest<SearchFormOptions> { }

  public class GetSearchFormOptionsHandler : IRequestHandler<GetSearchFormOptions, SearchFormOptions>
  {
    private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

    public GetSearchFormOptionsHandler(IIocDbConnectionFactory iocDbConnectionFactory)
    {
      _iocDbConnectionFactory = iocDbConnectionFactory;
    }

    public async Task<SearchFormOptions> Handle(GetSearchFormOptions message, CancellationToken cancellationToken)
    {
      var sql = @"
                SELECT [Name]
                FROM [dbo].[Program]

                SELECT [Description]
                FROM [dbo].[Make]
            ";

      using (var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        using (var multi = await connection.QueryMultipleAsync(sql))
        {
          var programs = await multi.ReadAsync<string>();
          var makes = await multi.ReadAsync<string>();

          return new SearchFormOptions(programs, makes);
        }
      }
    }
  }
}