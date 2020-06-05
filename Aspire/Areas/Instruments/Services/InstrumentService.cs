using System.Linq;
using System.ComponentModel.DataAnnotations;
using System;
using System.Data;
using System.Collections.Generic;
using Aspire.Areas.Instruments.Models;
using Aspire.Areas.Instruments.Models.Enums;
using Aspire.Areas.Shared.Models;
using Aspire.Areas.Shared.Utils;
using Aspire.Configuration;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Aspire.Areas.Instruments.Services.Interfaces
{
  public class InstrumentService : IInstrumentService
  {
    private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

    public InstrumentService(IIocDbConnectionFactory iocDbConnectionFactory)
    {
      _iocDbConnectionFactory = iocDbConnectionFactory;
    }

    public async Task<InstrumentFilterConstants> GetInstrumentFilterConstants()
    {
      var sql = @"
                SELECT 
                    [ProgramId] AS [Value],
                    [Name] AS [Label]
                FROM [dbo].[Program]
            ";

      using (var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {

        var programOptions = new List<SelectOption>()
        {
          new SelectOption(null, "All")
        };

        programOptions.AddRange(await connection.QueryAsync<SelectOption>(sql));

        return new InstrumentFilterConstants(programOptions);
      }
    }
  
		public async Task<List<Instrument>> GetInstruments(Status? status, int? programId)
		{
      var sql = @"
        SELECT  
          instrument.[InstrumentId] AS [Id],
          instrument.[SerialNumber],
          instrument.[Status],
          instrument.[Type],

          '' AS [ModelBreak],
          model.[ModelId] AS [Id],
          model.[ModelNumber],

          '' AS [MakeBreak],
          make.[MakeId] AS [Id],
          make.[Description],

          '' AS [ProgramBreak],
          program.[ProgramId] AS [Id],
          program.[Name],

          '' AS [Studentbreak],
          student.[StudentId] AS [Id],
          student.[FirstName],
          student.[LastName]
        FROM [dbo].[Instrument] instrument
        INNER JOIN [dbo].[Model] model ON model.[ModelId] = instrument.[ModelId]
			  INNER JOIN [dbo].[Make] make ON make.[MakeId] = model.[MakeId]
			  LEFT JOIN [dbo].[Program] program ON program.[ProgramId] = instrument.[ProgramId]
			  LEFT JOIN [dbo].[Student] student ON student.[StudentId] = instrument.[StudentId]
        WHERE (
					@ProgramId IS NULL
					AND 1=1

					OR instrument.[ProgramId] = @ProgramId
				)
				AND (
					@Status IS NULL
					AND 1=1

					OR instrument.[Status] = @Status
				)
      ";

			using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
			{
        List<Instrument> instruments;

        try {
          instruments = (await connection.QueryAsync<Instrument, Model, Make, Shared.Models.Program, Student, Instrument>(sql,
            (instrument, model, make, program, student) =>
            {
              instrument.Model = model;
              instrument.Make = make;
              instrument.Program = program.Id == 0 ? null : program;
              instrument.Student = student.Id == 0 ? null : student;

              return instrument;
            },
            new { programId, status = status == null ? null : status },
            splitOn: "ModelBreak,MakeBreak,ProgramBreak,StudentBreak"
          )).AsList();
        } catch(Exception e) {
          instruments = Enumerable.Empty<Instrument>().ToList();
        }

        instruments.Sort();

        return instruments;
			}
		}
	
    public async Task DeleteInstrument(int instrumentId)
    {
      var sql = @"
        --DELETE 
        --FROM [dbo].[InstrumentHistory]
        --WHERE [InstrumentId] = @InstrumentId;

        DELETE 
        FROM [dbo].[Instrument]
        WHERE [InstrumentId] = @InstrumentId;
      ";

      using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        await connection.ExecuteAsync(sql, new { instrumentId });
      }
    }

    public async Task<InstrumentConstants> GetFormConstants() 
    {
      var sql = @"
        SELECT 
            [MakeId] AS [Value],
            [Description] AS [Label]
        FROM [dbo].[Make];

        SELECT 
            [ProgramId] AS [Value],
            [Name] AS [Label]
        FROM [dbo].[Program];
      ";

      using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        using(var multi = await connection.QueryMultipleAsync(sql))
        {
          var makeOptions = await multi.ReadAsync<SelectOption>();
          var programOptions = await multi.ReadAsync<SelectOption>();

          return new InstrumentConstants(makeOptions, programOptions);
        }
      }
    }

    public async Task<IEnumerable<SelectOption>> GetModelOptions(int makeId)
    {
      var sql = @"
        SELECT 
            [ModelId] AS [Value],
            [ModelNumber] AS [Label]
        FROM [dbo].[Model]
        WHERE [MakeId] = @MakeId;
      ";

      using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        return await connection.QueryAsync<SelectOption>(sql, new { makeId });
      }
    }
  
    public async Task CreateInstrument(Instrument instrument)
    {
      ValidateInstrument(instrument, false);

      var sql = @"											
        INSERT INTO [dbo].[Instrument]
				(
					[ModelId],
					[Type],
					[ProgramId],
					[StudentId],
					[SerialNumber],
					[Notes],
					[DateCreated],
					[Status]	
				)
				VALUES 
				(
					@ModelId,
					@Type, 
					@ProgramId, 
					@StudentId, 
					@SerialNumber, 
					@Notes,
					GETDATE(),
					@Status
				);
      ";

      using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        await connection.ExecuteAsync(sql, 
          new 
          {
            ModelId = instrument.Model.Id,
            Type = instrument.Type,
            ProgramId = instrument.Program.Id,
            StudentId = instrument.Student.Id,
            SerialNumber = instrument.SerialNumber,
            Notes = instrument.Notes,
            Status = instrument.Status
          }
        );
      }
    }

    public async Task EditInstrument(Instrument instrument)
    {
      ValidateInstrument(instrument, true);

      var sql = @"
      	UPDATE [dbo].[Instrument]
				SET 
			  	[ModelId] = @ModelId,
					[Type] = @Type,
					[ProgramId] = @ProgramId,
					[StudentId] = @StudentId,
					[SerialNumber] = @SerialNumber,
					[Notes] = @Notes,
					[Status] = @Status
				WHERE [InstrumentId] = @Id
      ";

      using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        await connection.ExecuteAsync(sql, 
          new 
          {
            Id = instrument.Id,
            ModelId = instrument.Model.Id,
            Type = instrument.Type,
            ProgramId = instrument.Program.Id,
            StudentId = instrument.Student.Id,
            SerialNumber = instrument.SerialNumber,
            Notes = instrument.Notes,
            Status = instrument.Status
          }
        );
      }
    }

    public async Task<Instrument> GetInstrument(int instrumentId)
    {
      var sql = @"
        SELECT  
          instrument.[InstrumentId] AS [Id],
          instrument.[SerialNumber],
          instrument.[Status],
          instrument.[Type],

          '' AS [ModelBreak],
          model.[ModelId] AS [Id],
          model.[ModelNumber],

          '' AS [MakeBreak],
          make.[MakeId] AS [Id],
          make.[Description],

          '' AS [ProgramBreak],
          program.[ProgramId] AS [Id],
          program.[Name],

          '' AS [Studentbreak],
          student.[StudentId] AS [Id],
          student.[FirstName],
          student.[LastName]
        FROM [dbo].[Instrument] instrument
        INNER JOIN [dbo].[Model] model ON model.[ModelId] = instrument.[ModelId]
			  INNER JOIN [dbo].[Make] make ON make.[MakeId] = model.[MakeId]
			  LEFT JOIN [dbo].[Program] program ON program.[ProgramId] = instrument.[ProgramId]
			  LEFT JOIN [dbo].[Student] student ON student.[StudentId] = instrument.[StudentId]
        WHERE [InstrumentId] = @InstrumentId;
      ";
      
      using(var connection  = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        return (await connection.QueryAsync<Instrument, Model, Make, Shared.Models.Program, Student, Instrument>(
          sql,
          (instrument, model, make, program, student) => {
            instrument.Model = model;
            instrument.Make = make;
            instrument.Program = program.Id == 0 ? null : program;
            instrument.Student = student.Id == 0 ? null : student;

            return instrument;
          },
          new { instrumentId },
          splitOn: "ModelBreak,MakeBreak,ProgramBreak,StudentBreak"
        )).FirstOrDefault();
      }
    }

    private async Task<Make> GetMake(int instrumentId)
    {
      var sql = @"
        SELECT
          make.[MakeId] AS [Id],
          [Description]
        FROM [dbo].[Make] make
        INNER JOIN [dbo].[Model] model ON model.[MakeId] = make.[MakeId]
        INNER JOIN [dbo].[Instrument] instrument ON 
          instrument.[ModelId] = model.[ModelId]
          AND instrument.[InstrumentId] = @InstrumentId;
      ";

      using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
      {
        return await connection.QuerySingleOrDefaultAsync<Make>(sql, instrumentId);
      }
    }

    private void ValidateInstrument(Instrument instrument, bool isEdit)
    {
      if(isEdit && (instrument.Id.Equals(default(int)) || instrument.Id.Equals(null)))
      {
        throw new ValidationException($"Cannot edit instrument with id {default(int)}");
      }
      else if (instrument.Make.Id.Equals(default(int)) || instrument.Make.Id.Equals(null))
      {
        throw new ValidationException(GetRequiredMessage("Make"));
      }
      else if (instrument.Model.Id.Equals(default(int)) || instrument.Model.Id.Equals(null))
      {
        throw new ValidationException(GetRequiredMessage("Model"));
      }
      else if(instrument.Program.Id.Equals(default(int)) || instrument.Program.Id.Equals(null))
      {
        throw new ValidationException(GetRequiredMessage("Program"));
      }
      else if(instrument.SerialNumber.Equals(string.Empty)) 
      {
        throw new ValidationException(GetRequiredMessage("Serial Number"));
      }
    }

    private string GetRequiredMessage(string fieldName) => $"{fieldName} is required";
  }
}