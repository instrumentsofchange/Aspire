using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aspire.Areas.Schedules.Models;
using Aspire.Configuration;
using Dapper;

namespace Aspire.Areas.Schedules.Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        public ScheduleService(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task CreateSchedule(Schedule schedule)
        {
            var sql = @"
                DECLARE @ProgramId INT = (
                    SELECT [ProgramId]
                    FROM [dbo].[Program]
                    WHERE [Name] = @Program
                );

                INSERT INTO [dbo].[ProgramSchedule]
                (
                    [StartDate],
                    [EndDate],
                    [ProgramId],
                    [SpecialEvent],
                    [Description]
                )
                VALUES
                (
                    @StartDate,
                    @EndDate,
                    @ProgramId,
                    @SpecialEvent,
                    @Description
                )
            ";

            var queryParameters = new
            {
                schedule.StartDate,
                schedule.EndDate,
                schedule.Program,
                schedule.SpecialEvent,
                schedule.Description
            };

            using (var connection = _iocDbConnectionFactory.GetReadWriteConnection())
            {
                await connection.QueryAsync(sql, queryParameters);
            }
        }

        public async Task DeleteSchedule(int scheduleId)
        {
            var sql = @"
                DELETE [dbo].[ProgramSchedule]
                WHERE [ProgramScheduleId] = @ScheduleId;
            ";

            using (var connection = _iocDbConnectionFactory.GetReadWriteConnection())
            {
                await connection.QueryAsync(sql, new { ScheduleId = scheduleId });
            }
        }

        public async Task<Schedule> GetSchedule(int scheduleId)
        {
            var sql = @"
                SELECT 
                    programSchedule.[ProgramScheduleId] AS Id,
                    programSchedule.[StartDate],
                    programSchedule.[EndDate],
                    programSchedule.[Description],
                    programSchedule.[SpecialEvent],
                    program.[Name] AS Program
                FROM [dbo].[ProgramSchedule] programSchedule
                INNER JOIN [dbo].[Program] program ON program.[ProgramId] = programSchedule.[ProgramId]
                WHERE [ProgramScheduleId] = @ScheduleId;
            ";

            using (var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return await connection.QuerySingleAsync<Schedule>(sql, new { ScheduleId = scheduleId });
            }
        }

        public async Task UpdateSchedule(Schedule schedule)
        {
            var sql = @"
                UPDATE programSchedule
                SET 
                    programSchedule.[StartDate] = @StartDate,
                    programSchedule.[EndDate] = @EndDate,
                    programSchedule.[Description] = @Description,
                    programSchedule.[SpecialEvent] = @SpecialEvent,
                    programSchedule.[ProgramId] = program.[ProgramId]
                FROM [dbo].[ProgramSchedule] programSchedule
                INNER JOIN [dbo].[Program] program ON program.[Name] = @Program
                WHERE [ProgramScheduleId] = @Id;
            ";

            using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
            {
                await connection.ExecuteAsync(sql, schedule);
            }
        }

        public async Task<IEnumerable<Schedule>> Search(SearchCriteria searchCriteria)
        {
            var sql = @"
                SELECT 
                    programSchedule.[ProgramScheduleId] AS Id,
                    programSchedule.[StartDate],
                    programSchedule.[EndDate],
                    programSchedule.[Description],
                    programSchedule.[SpecialEvent],
                    program.[Name] AS Program
                FROM [dbo].[ProgramSchedule] programSchedule
                INNER JOIN [dbo].[Program] program ON 
                    program.[ProgramId] = programSchedule.[ProgramId]
                    AND (@Program = ''
                        OR @Program IS NULL
                        OR @Program IS NOT NULL AND program.[Name] = @Program);
            ";

            using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return await connection.QueryAsync<Schedule>(sql, searchCriteria);
            }
        }

    }
}