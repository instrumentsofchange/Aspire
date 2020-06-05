using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aspire.Configuration;
using Aspire.Areas.Shared.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Aspire.Areas.Shared
{
  public class ProgramsApiController : Controller
  {
    private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

    public ProgramsApiController(IIocDbConnectionFactory iocDbConnectionFactory)
    {
      _iocDbConnectionFactory = iocDbConnectionFactory;
    }

    [HttpGet]
    [Route("/api/programs/options")]
    public async Task<ActionResult> GetProgramOptions()
    {
      var sql = @"
                SELECT 
                    [ProgramId] AS [Id],
                    [Name]
                FROM [dbo].[Program]
            ";

      using (var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        var programSelectList = new List<SelectListItem>()
        {
          SelectListHelpers.GetDefaultItem()
        };
        
				var programs = (await connection.QueryAsync<Models.Program>(sql))
            .Select(program => new SelectListItem(program.Name, program.Id.ToString()));

        programSelectList.AddRange(programs);

        return Ok(programSelectList);
      }
    }
  }
}
