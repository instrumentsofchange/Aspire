using System;
using System.Threading.Tasks;
using Aspire.Areas.Schedules.Models;
using Aspire.Areas.Schedules.Services;
using Microsoft.AspNetCore.Mvc;

namespace Aspire.Areas.Schedules
{
    public class SchedulesApicontroller : Controller
    {
        private const string schedulesRoute = "/api/schedules";

        private readonly IScheduleService _scheduleService;

        public SchedulesApicontroller(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
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
        public async Task<ActionResult> GetSchedule(int scheduleId)
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

        [Route(schedulesRoute + "/search")]
        [HttpGet]
        public async Task<ActionResult> SearchSchedules(string program)
        {
            var searchCriteria = new SearchCriteria();

            searchCriteria.Program = program;

            return Ok(await _scheduleService.Search(searchCriteria));
        }

        private void ThrowError()
        {
            string foo = null;
            foo.Equals("");
        }
    }
}
