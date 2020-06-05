using System.Text;
using System.Linq;
using System.Globalization;
using System.IO;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aspire.Areas.Shared;
using Aspire.Areas.Shared.Models;
using Aspire.Areas.Students.Models;
using Aspire.Areas.Students.Services.Interfaces;
using Aspire.Configuration;
using CsvHelper;
using Dapper;
using MediatR;
using MimeKit.Text;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Students.Services
{
  public class StudentService : IStudentService
  {
    private readonly IIocDbConnectionFactory _iocDbConnectionFactory;
    private readonly EmailSettings _emailConfiguration;
		private readonly IMediator _mediator;

		private static readonly List<string> NewStudentToEmailAddress = new List<string>(1)
		{
			"kyleaebischer@hotmail.com"
		};

    public StudentService(
			IIocDbConnectionFactory iocDbConnectionFactory,
			IAppConfiguration appConfiguration, 
			IMediator mediator)
    {
      _iocDbConnectionFactory = iocDbConnectionFactory;
      _emailConfiguration = appConfiguration.GetAppConfiguration().EmailSettings;
			_mediator = mediator;
    }

    public async Task SaveNewStudent(Student student)
    {
      var sql = @"
                DECLARE @AddressId INT = (
                    SELECT [AddressId]
                    FROM [dbo].[Address]
                    WHERE [AddressOne] = @StreetAddress
                    AND [City] = @City
                    AND [ZipCode] = @ZipCode
                    AND [State] = 'FL'
                );

                IF(@AddressId IS NULL)
                BEGIN
                    INSERT INTO [dbo].[Address]
                    (
                        [AddressOne],
                        [City],
                        [ZipCode],
                        [State]
                    )
                    VALUES 
                    (
                        @StreetAddress,
                        @City,
                        @ZipCode,
                        'FL'
                    )

                    SET @AddressId = SCOPE_IDENTITY();
                END

                DECLARE @ProgramId INT = (
                    SELECT [ProgramId]
                    FROM [dbo].[Program]
                    WHERE [Name] = @Program
                );

                INSERT INTO [dbo].[Student]
                (
                    --Basic Info
                    [FirstName],
                    [MiddleInitial],
                    [LastName],
                    [StudentNumber],
                    [HomeroomTeacher],
                    [DateOfBirth],
                    [Allergies],

                    --Foreign Keys
                    [AddressId],
                    [ProgramId],

                    --Parent/Guardian 1
                    [ParentOneFirstName],
                    [ParentOneLastName],
                    [ParentOnePhoneNumber],
                    [ParentOneEmail],
                    [ParentOneCanContact],

                    --Parent/Guardian 2
                    [ParentTwoFirstName],
                    [ParentTwoLastName],
                    [ParentTwoPhoneNumber],
                    [ParentTwoEmail],
                    [ParentTwoCanContact],

                    --Emergency Contact 1 Info
                    [EmergencyContactOneName],
                    [EmergencyContactOneRelationship],
                    [EmergencyContactOnePhoneNumber],

                    --Emergency Contact 2 Info
                    [EmergencyContactTwoName],
                    [EmergencyContactTwoRelationship],
                    [EmergencyContactTwoPhoneNumber]
                )
                VALUES
                (
                    @FirstName,
                    @MiddleInitial,
                    @LastName,
                    @StudentNumber,
                    @HomeroomTeacher,
                    @DateOfBirth,
                    @Allergies,
    
                    @AddressId,
                    @ProgramId,

                    @ParentOneFirstName,
                    @ParentOneLastName,
                    @ParentOnePhoneNumber,
                    @ParentOneEmail,
                    @ParentOneCanContact,

                    @ParentTwoFirstName,
                    @ParentTwoLastName,
                    @ParentTwoPhoneNumber,
                    @ParentTwoEmail,
                    @ParentTwoCanContact,

                    @EmergencyContactOneName,
                    @EmergencyContactOneRelationship,
                    @EmergencyContactOnePhoneNumber,

                    @EmergencyContactTwoName,
                    @EmergencyContactTwoRelationship,
                    @EmergencyContactTwoPhoneNumber
                );
            ";

      using (var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        await connection.ExecuteAsync(sql, student);

        //if successful, send email
				await _mediator.Send(new SendEmail(NewStudentToEmailAddress, "New Student Sign Up", GetNewStudentEmailBody(student), TextFormat.Text));
      }
    }

    public async Task<IEnumerable<Student>> GetStudentsByProgram(int programId) 
    {
      var sql = @"
        SELECT 
          [StudentId] AS [Id],
          [FirstName],
          [LastName]
        FROM [dbo].[Student] student
        INNER JOIN [dbo].[Program] program ON program.[ProgramId] = student.[ProgramId]
        WHERE program.[ProgramId] = @ProgramId
      ";

      using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection()) 
      {
        return await connection.QueryAsync<Student>(sql, new { programId });
      }
    }

    public async Task<Student> GetStudentById(int studentId) 
    {
      var sql = @"
        --Main Student Info
        SELECT
          [StudentId] AS [Id],
          [FirstName],
          [MiddleInitial],
          [LastName],
          [StudentNumber],
          [HomeroomTeacher],
          [DateOfBirth],
          -- [ShirtSize], Need to add this to the table
          program.[Name] AS [Program],
          [Allergies]
        FROM [dbo].[Student] student
        INNER JOIN [dbo].[Program] program ON program.[ProgramId] = student.[ProgramId]
        WHERE [StudentId] = @StudentId;

        --Student Address
        SELECT
          address.[AddressId] AS [Id],
          [AddressOne],
          [AddressTwo],
          [City],
          [State],
          [ZipCode]
        FROM [dbo].[Address] address
        INNER JOIN [dbo].[Student] student ON student.[AddressId] = address.[AddressId]
        WHERE student.[StudentId] = @StudentId;

        --Parent/Guardian One
        SELECT
          [ParentOneFirstName] AS [FirstName],
          [ParentOneLastName] AS [LastName],
          [ParentOnePhoneNumber] AS [PhoneNumber],
          [ParentOneEmail] AS [Email],
          [ParentOneCanContact] AS [CanContact]
        FROM [dbo].[Student]
        WHERE [StudentId] = @StudentId;

        --Parent/Guardian Two
        SELECT
          [ParentTwoFirstName] AS [FirstName],
          [ParentTwoLastName] AS [LastName],
          [ParentTwoPhoneNumber] AS [PhoneNumber],
          [ParentTwoEmail] AS [Email],
          [ParentTwoCanContact] AS [CanContact]
        FROM [dbo].[Student]
        WHERE [StudentId] = @StudentId;

        --Emergency Contact One
        SELECT
          [EmergencyContactOneName] AS [Name],
          [EmergencyContactOneRelationship] AS [Relationship],
          [EmergencyContactOnePhoneNumber] AS [PhoneNumber]
        FROM [dbo].[Student]
        WHERE [StudentId] = @StudentId;

        --Emergency Contact Two
        SELECT
          [EmergencyContactTwoName] AS [Name],
          [EmergencyContactTwoRelationship] AS [Relationship],
          [EmergencyContactTwoPhoneNumber] AS [PhoneNumber]
        FROM [dbo].[Student]
        WHERE [StudentId] = @StudentId;
      ";

      using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection()) 
      {
        using(var multi = await connection.QueryMultipleAsync(sql, new { studentId }))
        {
          var student = await multi.ReadSingleAsync<Student>();
          student.Address = await multi.ReadSingleOrDefaultAsync<Address>();
          student.ParentGuardianOne = await multi.ReadSingleOrDefaultAsync<ParentGuardian>();
          student.ParentGuardianTwo = await multi.ReadSingleOrDefaultAsync<ParentGuardian>();
          student.EmergencyContactOne = await multi.ReadSingleOrDefaultAsync<EmergencyContact>();
          student.EmergencyContactTwo = await multi.ReadSingleOrDefaultAsync<EmergencyContact>();

          return student;
        }
      }
    }

    public async Task<byte[]> GetAttendanceReport(AttendanceReportRequest request) 
    {
      var sql = @"
        SELECT
          student.[FirstName],
          student.[LastName], 
          attendanceStatus.[Status],
          attendance.[MeetDay]
        FROM [dbo].[Attendance] attendance
        INNER JOIN [dbo].[Student] student ON student.[StudentId] = attendance.[StudentId]
        INNER JOIN [dbo].[AttendanceStatus] attendanceStatus ON attendanceStatus.[AttendanceStatusId] = attendance.[StatusId]
        WHERE attendance.[ProgramId] = @ProgramId
        AND (
            @StartDate IS NULL 
            AND 1=1 
            
            OR attendance.[MeetDay] >= @StartDate 
        )
        AND (
            @EndDate IS NULL
            AND 1=1

            OR attendance.[MeetDay] <= @EndDate
        )
      ";


      using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        var report = await connection.QueryAsync<AttendanceReport>(sql, request);

        var studentAttendanceReportDictionary = GetStudentAttendanceRecordDictionary(report);

        using (var memoryStream = new MemoryStream())
        {
          using (var streamWriter = new StreamWriter(memoryStream))
          {
            streamWriter.WriteLine(GetAttendanceReportHeaderRow(report.Select(record => record.MeetDay).Distinct()));

            foreach(var student in studentAttendanceReportDictionary)
            {
              streamWriter.WriteLine(GetStudentAttendanceRow(student));
            }

            streamWriter.Flush();

            return memoryStream.ToArray();
          }
        }
      }
    }

    public async Task<IEnumerable<SelectOption>> GetStudentOptions(int? programId, bool includeDefault)
    {
      var sql = @"
        SELECT 
          [StudentId] AS [Value],
          [FirstName] + ' ' + [LastName] AS [Label]
        FROM [dbo].[Student]
        WHERE (@ProgramId IS NULL AND 1=1) OR [ProgramId] = @ProgramId;
      ";

      using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        var studentOptions = new List<SelectOption>();

        if(includeDefault) 
        {
          studentOptions.Add(new SelectOption(null, "None"));
        }

        studentOptions.AddRange(await connection.QueryAsync<SelectOption>(sql, new { programId }));

        return studentOptions;
      }
    }

		private string GetNewStudentEmailBody(Student student) 
		{
			return $@"
				Hello,

				A new student has signed up for a program. 
				Student Details:

				-Name: {student.FirstName} {student.LastName}
				-Program: {student.Program}
	
				-- Please do not reply to this email --
			";
		}
  
    private Dictionary<string, Dictionary<DateTime, string>> GetStudentAttendanceRecordDictionary(IEnumerable<AttendanceReport> report)
    {
      var result = new Dictionary<string, Dictionary<DateTime, string>>();

      foreach (var record in report)
      {
        var key = record.FirstName + " " + record.LastName;

        if (result.ContainsKey(key))
        {
          //Student already exists in dictionary, add entry
          var studentAttendanceDictionary = result[key];

          studentAttendanceDictionary.Add(record.MeetDay, record.Status);
        }
        else
        {
          //Student does not exist in dictionary, add student and entry
          var studentAttendanceDictionary = new Dictionary<DateTime, string>();

          studentAttendanceDictionary.Add(record.MeetDay, record.Status);

          result.Add(key, studentAttendanceDictionary);
        }
      }

      return result;
    }

    private string GetAttendanceReportHeaderRow(IEnumerable<DateTime> meetDays) 
    {
      var result = new StringBuilder();

      result.Append(",");

      var lastMeetDay = meetDays.Last();

      foreach (var meetDay in meetDays)
      {
        result.Append(meetDay.Equals(lastMeetDay) ? meetDay.ToShortDateString().ToString() : $"{meetDay.ToShortDateString()},");
      }

      return result.ToString();
    }
  
    private string GetStudentAttendanceRow(KeyValuePair<string, Dictionary<DateTime, string>> studentAttendanceRecord)
    {
      var result = new StringBuilder();

      result.Append($"{studentAttendanceRecord.Key},");

      var lastDay = studentAttendanceRecord.Value.Last();

      foreach (var attendanceRecord in studentAttendanceRecord.Value)
      {
        result.Append(attendanceRecord.Equals(lastDay) ? attendanceRecord.Value : $"{attendanceRecord.Value},");
      }

      return result.ToString();
    }
  }
}
