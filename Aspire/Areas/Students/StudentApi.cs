using System.Net.Mime;
using System;
using System.Threading.Tasks;
using Aspire.Areas.Students.Models;
using Aspire.Areas.Students.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Aspire.Areas.Students
{
  public class StudentApi : Controller
  {
    private const string StudentsApiUrl = "/api/student";

    private readonly IStudentService _studentService;

    public StudentApi(IStudentService studentService)
    {
      _studentService = studentService;
    }

    [HttpPost]
    [Route(StudentsApiUrl)]
    public async Task<ActionResult> StudentSignUp([FromBody]Student student)
    {
      await _studentService.SaveNewStudent(student);

      return Ok(true);
    }

    [HttpGet]
    [Route(StudentsApiUrl + "/list/{programId}")]
    public async Task<ActionResult> GetStudentsByProgram([FromRoute] int programId)
    {
			return Ok(await _studentService.GetStudentsByProgram(programId));
    }

		[HttpGet]
		[Route(StudentsApiUrl + "/contact-info/{studentId}")]
		public async Task<ActionResult> GetStudentContactInfo(int studentId)
		{
			return Ok(await _studentService.GetStudentById(studentId));
		}

    [HttpGet]
    [Route(StudentsApiUrl + "/attendance-report")]
    public async Task<ActionResult> GetProgramAttendanceReport(AttendanceReportRequest request)
    {
      return File(await _studentService.GetAttendanceReport(request), "application/octet-stream", "AttendanceReport.csv");
    }

    [HttpGet]
    [Route(StudentsApiUrl + "/options")]
    public async Task<ActionResult> GetStudentOptions([FromQuery]int? programId, [FromQuery]bool includeDefault = true)
    {
      return Ok(await _studentService.GetStudentOptions(programId, includeDefault));
    }
  }
}