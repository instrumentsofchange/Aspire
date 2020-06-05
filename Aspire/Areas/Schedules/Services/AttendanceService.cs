using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aspire.Areas.Schedules.Models;
using Aspire.Areas.Schedules.Services.Interfaces;
using Aspire.Configuration;
using Dapper;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Schedules.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        public AttendanceService(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<IEnumerable<SelectListItem>> GetMeetDaysByProgram(int programId)
        {
            var sql = @"
                SELECT DISTINCT(attendance.[MeetDay])
                FROM [dbo].[Attendance] attendance
                INNER JOIN [dbo].[Program] program ON program.[ProgramId] = @ProgramId
                WHERE attendance.[ProgramId] = program.[ProgramId]
            ";

            using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                var meetDays = await connection.QueryAsync<DateTime>(sql, new { ProgramId = programId });

                var result = new List<SelectListItem>();

                foreach(var meetDay in meetDays)
                {
                    result.Add(new SelectListItem(meetDay.ToShortDateString(), meetDay.ToString()));
                }

                return result;
            }
        }

        public async Task<IEnumerable<Student>> GetAttendanceList(int programId, DateTime meetDay)
        {
            var sql = @"
                SELECT
                    student.[StudentId] AS [Id],
                    student.[FirstName],
                    student.[LastName],
                    status.[Status]
                FROM [dbo].[Attendance] attendance
                INNER JOIN [dbo].[Student] student ON student.[StudentId] = attendance.[StudentId]
                INNER JOIN [dbo].[Program] program ON program.[ProgramId] = student.[ProgramId]
                INNER JOIN [dbo].[AttendanceStatus] status ON status.[AttendanceStatusId] = attendance.[StatusId]
                WHERE attendance.[MeetDay] = @MeetDay
                AND program.[ProgramId] = @ProgramId;
            ";

            using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return await connection.QueryAsync<Student>(sql, new { ProgramId = programId, MeetDay = meetDay });
            }
        }

        public async Task SaveAttendance(SaveAttendanceRequest request)
        {
            var sql = @"
                UPDATE attendance
                SET StatusId = attendanceStatus.[AttendanceStatusId]
                FROM [dbo].[Attendance] attendance
                INNER JOIN [dbo].[AttendanceStatus] attendanceStatus ON attendanceStatus.[Status] = @Status
                INNER JOIN [dbo].[Program] program ON program.[ProgramId] = @ProgramId 
                WHERE attendance.[StudentId] = @StudentId
                AND attendance.[MeetDay] = @MeetDay
                AND attendance.[ProgramId] = program.[ProgramId]
            ";

            using (var connection = _iocDbConnectionFactory.GetReadWriteConnection())
            {
                foreach(var student in request.Students)
                {
                    var foo = new {
                      Status = student.Status,
                      ProgramId = request.ProgramId,
                      StudentId = student.Id,
                      MeetDay = request.MeetDay.Date
                    };

                    await connection.ExecuteAsync(sql, new {
                        Status = student.Status,
                        ProgramId = request.ProgramId,
                        StudentId = student.Id,
                        MeetDay = request.MeetDay.Date
                    });
                }
            }
        }
    }
}