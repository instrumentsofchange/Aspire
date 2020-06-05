using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aspire.Areas.Students.Models;
using Aspire.Areas.Shared.Models;

namespace Aspire.Areas.Students.Services.Interfaces
{
  public interface IStudentService
  {
    Task SaveNewStudent(Student student);

		Task<IEnumerable<Student>> GetStudentsByProgram(int programId);

    Task<Student> GetStudentById(int studentId);

    Task<byte[]> GetAttendanceReport(AttendanceReportRequest request);

    Task<IEnumerable<SelectOption>> GetStudentOptions(int? programId, bool includeDefault);

  }
}