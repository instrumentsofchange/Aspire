using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aspire.Areas.Schedules.Models;
using Aspire.Configuration;
using Dapper;
using Microsoft.AspNetCore.Mvc.Rendering;

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
      await ValidateSchedule(schedule);

      // var meetDaysAsEnum = schedule.MeetDays.Select(meetDay => ConvertMeetDay(meetDay));

      // var meetDates = GetMeetDates(schedule.StartDate, schedule.EndDate, meetDaysAsEnum);

      var sql = @"
        INSERT INTO [dbo].[ProgramSchedule]
        (
          [StartDate],
          [EndDate],
          [ProgramId],
          [MeetDays],
          [SpecialEvent],
          [Description]
        )
        VALUES
        (
          @StartDate,
          @EndDate,
          @ProgramId,
          @MeetDays,
          @SpecialEvent,
          @Description
        )

        SELECT @@IDENTITY;
      ";

      var queryParameters = new
      {
        schedule.StartDate,
        schedule.EndDate,
        schedule.ProgramId,
        MeetDays = string.Join(", ", schedule.MeetDays),
        schedule.SpecialEvent,
        schedule.Description
      };

      using (var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        var scheduleId = await connection.QuerySingleAsync<int>(sql, queryParameters);

        await SaveDefaultAttendanceForSchedule(schedule.StartDate, schedule.EndDate, scheduleId, schedule.MeetDays);
        // await SaveDefaultAttendanceForNewSchedule(schedule.ProgramId, programScheduleId, meetDates);
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
          program.[ProgramId]
        FROM [dbo].[ProgramSchedule] programSchedule
        INNER JOIN [dbo].[Program] program ON program.[ProgramId] = programSchedule.[ProgramId]
        WHERE [ProgramScheduleId] = @ScheduleId;

        SELECT [MeetDays]
        FROM [dbo].[ProgramSchedule]
        WHERE [ProgramScheduleId] = @ScheduleId;
      ";

      using (var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        using (var multi = await connection.QueryMultipleAsync(sql, new { scheduleId }))
        {
          var schedule = await multi.ReadFirstAsync<Schedule>();
          var meetDays = await multi.ReadSingleAsync<string>();

          schedule.MeetDays = meetDays.Split(new string[] {", "}, StringSplitOptions.RemoveEmptyEntries);

          return schedule;
        }
      }
    }

    public async Task UpdateSchedule(Schedule schedule)
    {
      var savedSchedule = await GetSchedule(schedule.Id);

      if(savedSchedule.EndDate.CompareTo(schedule.EndDate) < 0) 
      {
        //savedSchedule.endDate is earlier than the new end date
          //This means we need to add days to the attendance table

        //Add 1 day to saved end date because we don't want to duplicate the already saved end date
        await SaveDefaultAttendanceForSchedule(savedSchedule.EndDate.AddDays(1), schedule.EndDate, savedSchedule.Id, savedSchedule.MeetDays);
      }
      else if(savedSchedule.EndDate.CompareTo(schedule.EndDate) > 0)
      {
        //savedSchedule.endDate is later than the new end date
          //This means we need to remove days from the attendance table
          await DeleteMeetDaysForSchedule(schedule.EndDate, schedule.Id);
      }
      else 
      {
        //This means the end dates are the same - do nothing 
      }


      var sql = @"
        UPDATE programSchedule
        SET 
          programSchedule.[StartDate] = @StartDate,
          programSchedule.[EndDate] = @EndDate,
          programSchedule.[Description] = @Description,
          programSchedule.[MeetDays] = @MeetDays,
          programSchedule.[SpecialEvent] = @SpecialEvent,
          programSchedule.[ProgramId] = program.[ProgramId]
        FROM [dbo].[ProgramSchedule] programSchedule
        INNER JOIN [dbo].[Program] program ON program.[ProgramId] = @ProgramId
        WHERE [ProgramScheduleId] = @Id;
      ";

      var updateParams = new
      {
        schedule.Id,
        schedule.StartDate,
        schedule.EndDate,
        schedule.ProgramId,
        MeetDays = string.Join(", ", schedule.MeetDays),
        schedule.SpecialEvent,
        schedule.Description
      };

      using (var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        var affectedRows = await connection.ExecuteAsync(sql, updateParams);

        if(affectedRows == 0)
        {
          throw new Exception("An unknown error occured.");
        }
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
                    AND (@ProgramId = 0
                        OR @ProgramId > 0 AND program.[ProgramId] = @ProgramId);
            ";

      using (var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        return await connection.QueryAsync<Schedule>(sql, searchCriteria);
      }
    }

    public async Task<IEnumerable<Schedule>> GetSchedulesByProgram(int programId) 
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
          AND program.[ProgramId] = @ProgramId;
        ";

      using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        return await connection.QueryAsync<Schedule>(sql, new { programId });
      }
    }

    public async Task<IEnumerable<SelectListItem>> GetScheduleMeetDayOptions(int programId)
    {
      var sql = @"
        SELECT DISTINCT([MeetDay])
        FROM [dbo].[Attendance] attendance
        INNER JOIN [dbo].[ProgramSchedule] programSchedule ON programSchedule.[ProgramScheduleId] = attendance.[ProgramScheduleId]
        WHERE programSchedule.[ProgramId] = @ProgramId
        AND programSchedule.[StartDate] <= GETDATE()
        AND programSchedule.[EndDate] >= GETDATE();
      ";

      using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        var meetDays = await connection.QueryAsync<DateTime>(sql, new { programId });
      
        return meetDays.Select(
          meetDay => new SelectListItem(meetDay.ToShortDateString(), meetDay.ToShortDateString()));
      }
    }

    public async Task ModifyMeetDay(int scheduleId, MeetDayModificationRequest request) 
    {
      if(request.RescheduleMeetDay) 
      {
        var savedSchedule = await GetSchedule(scheduleId);

        if(request.NewMeetDate.CompareTo(savedSchedule.EndDate) > 0)
        {
          throw new ValidationException($"The New Meet Date cannot fall after the Schedules End Date of {savedSchedule.EndDate.ToShortDateString()}");
        }

        using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
        {
          var rescheduleMeetDayCheckSql = @"
            SELECT COUNT(*)
            FROM [dbo].[Attendance]
            WHERE [ProgramScheduleId] = @ScheduleId
            AND [MeetDay] = @NewMeetDate;
          ";

          var hasMeetDayOnRescheduledDate = await connection.QueryFirstOrDefaultAsync<int>(rescheduleMeetDayCheckSql, new { scheduleId, request.NewMeetDate }) > 0;

          if(hasMeetDayOnRescheduledDate)
          {
            throw new Exception($"The Program already has a scheduled meet day on {request.NewMeetDate.ToShortDateString()}.");
          }
        }
      }

      var deleteSql = @"
        DELETE 
        FROM [dbo].[Attendance]
        WHERE [ProgramScheduleId] = @ScheduleId
        AND MeetDay = @MeetDay;
      ";
      var modifySql = @"
        UPDATE [dbo].[Attendance]
        SET [MeetDay] = @NewMeetDay
        WHERE [ProgramScheduleId] = @ScheduleId
        AND [MeetDay] = @MeetDay;
      ";

      using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        var affectedRows = await connection.ExecuteAsync(
          request.CancelMeetDay ? deleteSql : modifySql,
           new 
           {
             ScheduleId = scheduleId,
             MeetDay = request.MeetDate,
             NewMeetday = request.NewMeetDate
           });

        if(affectedRows == 0) 
        {
          throw new Exception("An unknown error occured.");
        }
      }
    }

    private async Task ValidateSchedule(Schedule schedule) 
    {
      var schedulesForProgram = await GetSchedulesByProgram(schedule.ProgramId);

      foreach(var savedSchedule in schedulesForProgram)
      {
        if(schedule.StartDate >= savedSchedule.StartDate && schedule.StartDate <= savedSchedule.EndDate)
        {
          //start date falls during a saved schedule for this program
          throw new ValidationException($"The Start Date {schedule.StartDate.ToShortDateString()} falls during a previously saved schedule.");
        }

        if(schedule.EndDate <= savedSchedule.EndDate && schedule.EndDate >= savedSchedule.EndDate)
        {
          //End date falls during a saved schedule for this program
          throw new ValidationException($"The End Date {schedule.EndDate.ToShortDateString()} falls during a previously saved schedule.");
        }
      }
    
      if(schedule.MeetDays.Count() < 1)
      {
        throw new ValidationException("At least one Meet Day is required.");
      }
    }

    private async Task SaveDefaultAttendanceForNewSchedule(int programId, int programScheduleId, IEnumerable<DateTime> meetDays)
    {
      var sql = @"
        DECLARE @StatusId INT = (
          SELECT [AttendanceStatusId]
          FROM [dbo].[AttendanceStatus]
          WHERE [Status] = 'Present'
        );

        INSERT INTO [dbo].[Attendance]
        (
          [ProgramId],
          [ProgramScheduleId],
          [StudentId],
          [StatusId],
          [MeetDay],
          [DateUpdate]
        )
        SELECT 
          @ProgramId,
          @ProgramScheduleId,
          [StudentId],
          @StatusId,
          @MeetDay,
          GETDATE()
        FROM [dbo].[Student]
        WHERE [ProgramId] = @ProgramId;
      ";

      using (var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        foreach (var meetDay in meetDays)
        {
          await connection.ExecuteAsync(sql, new { programId, meetDay, programScheduleId });
        }
      }
    }

    private async Task SaveDefaultAttendanceForSchedule(DateTime startDate, DateTime endDate, int scheduleId, IEnumerable<string> meetDays)
    {
      var sql = @"
        DECLARE @ProgramId INT = (
          SELECT [ProgramId]
          FROM [dbo].[ProgramSchedule]
          WHERE [ProgramScheduleId] = @ScheduleId
        );

        DECLARE @StatusId INT = (
          SELECT [AttendanceStatusId]
          FROM [dbo].[AttendanceStatus]
          WHERE [Status] = 'Present'
        );

        INSERT INTO [dbo].[Attendance]
        (
          [ProgramId],
          [ProgramScheduleId],
          [StudentId],
          [StatusId],
          [MeetDay],
          [DateUpdate]
        )
        SELECT 
          @ProgramId,
          @ScheduleId,
          [StudentId],
          @StatusId,
          @MeetDay,
          GETDATE()
        FROM [dbo].[Student]
        WHERE [ProgramId] = @ProgramId;
      ";

      using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        foreach(var meetDay in GetMeetDates(startDate, endDate, meetDays.Select(meetDay => ConvertMeetDay(meetDay))))
        {
          await connection.ExecuteAsync(sql, new { scheduleId, meetDay });
        }
      }
    }

    private async Task DeleteMeetDaysForSchedule(DateTime newEndDate, int scheduleId)
    {
      var sql = @"
        DELETE 
        FROM [dbo].[Attendance]
        WHERE [ProgramScheduleId] = @ScheduleId
        AND [MeetDay] > @NewEndDate
      ";

      using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        await connection.ExecuteAsync(sql, new { scheduleId, newEndDate });
      }
    }

    private DayOfWeek ConvertMeetDay(string meetDay) 
    {
      DayOfWeek dayOfWeek;

      switch (meetDay)
      {
        case "Sunday":
          dayOfWeek = DayOfWeek.Sunday;
          break;

        case "Monday":
          dayOfWeek = DayOfWeek.Monday;
          break;

        case "Tuesday":
          dayOfWeek = DayOfWeek.Tuesday;
          break;

        case "Wednesday":
          dayOfWeek = DayOfWeek.Wednesday;
          break;

        case "Thursday":
          dayOfWeek = DayOfWeek.Thursday;
          break;

        case "Friday":
          dayOfWeek = DayOfWeek.Friday;
          break;

        case "Satuday":
          dayOfWeek = DayOfWeek.Saturday;
          break;

        default:
          throw new Exception("Meet Day not recognized.");
      }

      return dayOfWeek;
    }
  
    private IEnumerable<DateTime> GetMeetDates(DateTime start, DateTime end, IEnumerable<DayOfWeek> meetDays)
    {
      var meetDates = new List<DateTime>();

      for (var dt = start; dt <= end; dt = dt.AddDays(1))
      {
        foreach (DayOfWeek dayOfWeek in meetDays)
        {
          if (dt.DayOfWeek == dayOfWeek)
          {
            meetDates.Add(dt);
          }
        }
      }

      return meetDates;
    }
  }
}