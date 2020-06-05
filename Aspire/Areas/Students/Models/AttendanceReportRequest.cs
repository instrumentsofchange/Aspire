using System;
using Microsoft.AspNetCore.Mvc;

namespace Aspire.Areas.Students.Models
{
    public class AttendanceReportRequest
    {
        [FromQuery]
        public int ProgramId { get; set; }
        [FromQuery]
        public DateTime? StartDate { get; set; }
        [FromQuery]
        public DateTime? EndDate { get; set; }

        // public DateTime? Test => null;
    }
}