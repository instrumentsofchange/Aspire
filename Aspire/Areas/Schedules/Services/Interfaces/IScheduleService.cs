using System.Collections.Generic;
using System.Threading.Tasks;
using Aspire.Areas.Schedules.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Schedules.Services
{
  public interface IScheduleService
  {
    Task CreateSchedule(Schedule schedule);
		
    Task UpdateSchedule(Schedule schedule);

    Task<Schedule> GetSchedule(int scheduleId);

    Task DeleteSchedule(int scheduleId);

    Task<IEnumerable<Schedule>> Search(SearchCriteria searchCriteria);

		Task<IEnumerable<Schedule>> GetSchedulesByProgram(int programId);

    Task<IEnumerable<SelectListItem>> GetScheduleMeetDayOptions(int programId);

    Task ModifyMeetDay(int scheduleId, MeetDayModificationRequest request);

  }
}
