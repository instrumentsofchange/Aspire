using System.Collections.Generic;
using System.Threading.Tasks;
using Aspire.Areas.Schedules.Models;

namespace Aspire.Areas.Schedules.Services
{
    public interface IScheduleService
    {
        Task CreateSchedule(Schedule schedule);
        Task UpdateSchedule(Schedule schedule);
        Task<Schedule> GetSchedule(int scheduleId);
        Task DeleteSchedule(int scheduleId);
        Task<IEnumerable<Schedule>> Search(SearchCriteria searchCriteria);
    }
}
