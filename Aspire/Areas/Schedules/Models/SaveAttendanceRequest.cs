using System;
using System.Collections.Generic;

namespace Aspire.Areas.Schedules.Models
{
    public class SaveAttendanceRequest
    {
        public List<Student> Students { get; set; }
        public int ProgramId { get; set; }
        public DateTime MeetDay { get; set; }
    }
}