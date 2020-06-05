using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aspire.Areas.Schedules.Models;
using Aspire.Areas.Schedules.Services;
using Aspire.Areas.Schedules.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Aspire.Areas.Schedules
{
  public class SchedulesApicontroller : Controller
  {
    private const string schedulesRoute = "/api/program/schedules";

    private readonly IAttendanceService _attendanceService;
    private readonly IScheduleService _scheduleService;

    public SchedulesApicontroller(IAttendanceService attendanceService, IScheduleService scheduleService)
    {
      _attendanceService = attendanceService;
      _scheduleService = scheduleService;
    }

		[HttpGet]
		[Route("/api/program/{programId}/schedule/list")]
		public async Task<ActionResult> GetSchedulesForProgram([FromRoute]int programId) 
		{
			return Ok(await _scheduleService.GetSchedulesByProgram(programId));
		}

    [Route(schedulesRoute)]
    [HttpPost]
    public async Task<ActionResult> CreateSchedule([FromBody]Schedule schedule)
    {
      await _scheduleService.CreateSchedule(schedule);

      return Ok(true);
    }

    [Route(schedulesRoute)]
    [HttpPut]
    public async Task<ActionResult> UpdateSchedule([FromBody]Schedule schedule)
    {
      await _scheduleService.UpdateSchedule(schedule);

      return Ok(true);
    }

    [Route(schedulesRoute + "/{scheduleId}")]
    [HttpGet]
    public async Task<ActionResult> GetSchedule([FromRoute]int scheduleId)
    {
      return Ok(await _scheduleService.GetSchedule(scheduleId));
    }

    [Route(schedulesRoute + "/{scheduleId}")]
    [HttpDelete]
    public async Task<ActionResult> DeleteSchedule(int scheduleId)
    {
      await _scheduleService.DeleteSchedule(scheduleId);

      return Ok(true);
    }

    [Route(schedulesRoute + "/meet-days/{programId}/options")]
    [HttpGet]
    public async Task<ActionResult> GetMeetDayOptionsForSchedule([FromRoute]int programId)
    {
      return Ok(await _scheduleService.GetScheduleMeetDayOptions(programId));
    }

    [Route(schedulesRoute + "/search")]
    [HttpGet]
    public async Task<ActionResult> SearchSchedules([FromQuery]int programId)
    {
      var searchCriteria = new SearchCriteria();

      searchCriteria.ProgramId = programId;

      return Ok(await _scheduleService.Search(searchCriteria));
    }

    [HttpGet]
    [Route(schedulesRoute + "/meet-days/{programId}")]
    public async Task<ActionResult> GetSchedulesByProgram([FromRoute] int programId)
    {
      return Ok(await _attendanceService.GetMeetDaysByProgram(programId));
    }

    [HttpGet]
    [Route(schedulesRoute + "/attendance/{programId}")]
    public async Task<ActionResult> GetStudentListForSchedule(int programId, DateTime meetDay)
    {
      return Ok(await _attendanceService.GetAttendanceList(programId, meetDay));
    }

    [HttpPost]
    [Route(schedulesRoute + "/attendance")]
    public async Task<ActionResult> SaveAttendance([FromBody]SaveAttendanceRequest request)
    {
      await _attendanceService.SaveAttendance(request);

      return Ok(true);
    }

    [HttpPut]
    [Route(schedulesRoute + "/meet-day/{scheduleId}")]
    public async Task<ActionResult> ModifyMeetDay([FromRoute]int scheduleId, [FromBody]MeetDayModificationRequest request)
    {
      await _scheduleService.ModifyMeetDay(scheduleId, request);

      return Ok(true);
    }
  }
}
