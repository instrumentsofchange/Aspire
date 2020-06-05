using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Aspire.Areas.Instruments.Models;
using Aspire.Configuration;
using Dapper;
using MediatR;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Instruments.Data.Queries
{
    public class GetStudentsByProgram : IRequest<IEnumerable<SelectListItem>>
    {
        public string Program { get; }

        public GetStudentsByProgram(string program)
        {
            Program = program;
        }
    }

    public class GetStudentsByProgramHandler : IRequestHandler<GetStudentsByProgram, IEnumerable<SelectListItem>>
    {
        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;
        
        public GetStudentsByProgramHandler(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<IEnumerable<SelectListItem>> Handle(GetStudentsByProgram message, CancellationToken cancellationToken) 
        {
            var sql = @"
                SELECT
                    student.[StudentId] AS Id,
                    student.[FirstName], 
                    student.[LastName]
                FROM [dbo].[Student] student
                INNER JOIN [dbo].[Program] program
                    ON program.[ProgramId] = student.[ProgramId]
                    AND program.[Name] = @Program
            ";

            using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return (await connection.QueryAsync<Student>(sql, message))
                    .Select(student => new SelectListItem($"{student.FirstName} {student.LastName}", $"{student.FirstName} {student.LastName}"));
            }
        }
    }
}