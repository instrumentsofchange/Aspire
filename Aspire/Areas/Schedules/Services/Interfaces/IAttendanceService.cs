using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aspire.Areas.Schedules.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Schedules.Services.Interfaces
{
    public interface IAttendanceService
    {
        Task<IEnumerable<SelectListItem>> GetMeetDaysByProgram(int programId);
        Task<IEnumerable<Student>> GetAttendanceList(int programId, DateTime meetDay);
        Task SaveAttendance(SaveAttendanceRequest request);
    }
}
