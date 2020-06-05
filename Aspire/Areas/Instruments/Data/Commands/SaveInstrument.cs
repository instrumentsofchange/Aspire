using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Aspire.Areas.Instruments.Models;
using Aspire.Configuration;
using Dapper;
using MediatR;

namespace Aspire.Areas.Instruments.Data.Commands
{
  public class SaveInstrument : IRequest<int>
  {
    public Instrument Instrument { get; }

    public SaveInstrument(Instrument instrument)
    {
      Instrument = instrument;
    }
  }

  public class SaveInstrumentHandler : IRequestHandler<SaveInstrument, int>
  {
    private const string _sproc = "[dbo].[sto_save_instrument]";

    private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

    public SaveInstrumentHandler(IIocDbConnectionFactory iocDbConnectionFactory)
    {
      _iocDbConnectionFactory = iocDbConnectionFactory;
    }

    public async Task<int> Handle(SaveInstrument message, CancellationToken cancellationToken)
    {
      using (var connection = _iocDbConnectionFactory.GetReadWriteConnection())
      {
        var instrument = message.Instrument;

        var sprocParameters = new
        {
          InstrumentId = instrument.Id,
          instrument.Make,
          instrument.Model,
          instrument.Type,
          instrument.Program,
          instrument.Student,
          instrument.SerialNumber,
          instrument.Notes,
          instrument.Status
        };

        var sql = @"
	                DECLARE @ModelId INT = (
		                SELECT Model.[ModelId]
		                FROM [dbo].[Model] Model
		                INNER JOIN [dbo].[Make] Make ON Make.[MakeId] = Model.[MakeId]
		                WHERE Make.[Description] = @Make
		                AND Model.[ModelNumber] = @Model
	                );

	                DECLARE @InstrumentTypeId INT = (
		                SELECT [InstrumentTypeId]
		                FROM [dbo].[InstrumentType]
		                WHERE [Description] = @InstrumentType
	                );

	                DECLARE @ProgramId INT = (
		                SELECT [ProgramId]
		                FROM [dbo].[Program]
		                WHERE [Name] = @Program
	                );

	                DECLARE @StudentId INT = (
		                SELECT [StudentId]
		                FROM [dbo].[Student]
		                WHERE CONCAT([FirstName], ' ', [LastName]) = @Student
                        AND [ProgramId] = @ProgramId
	                );

                    DECLARE @StatusId INT = (
                        SELECT [InstrumentStatusId]
                        FROM [dbo].[InstrumentStatus]
                        WHERE [Status] = @Status
                    );

	                IF @InstrumentId IS NULL OR @InstrumentId = 0 
	                BEGIN
		                INSERT INTO [dbo].[Instrument]
		                (
			                [ModelId],
			                [InstrumentTypeId],
			                [ProgramId],
			                [StudentId],
			                [SerialNumber],
			                [Notes],
			                [DateCreated],
                            [InstrumentStatusId]	
		                )
		                VALUES 
		                (
			                @ModelId,
			                @InstrumentTypeId, 
			                @ProgramId, 
			                @StudentId, 
			                @SerialNumber, 
			                @Notes,
			                GETDATE(),
                            @StatusId
		                )

		                SET @InstrumentId = SCOPE_IDENTITY();
	                END
	                ELSE
	                BEGIN
		                UPDATE [dbo].[Instrument]
		                SET 
			                [ModelId] = @ModelId,
			                [InstrumentTypeId] = @InstrumentTypeId,
			                [ProgramId] = @ProgramId,
			                [StudentId] = @StudentId,
			                [SerialNumber] = @SerialNumber,
			                [Notes] = @Notes,
                            [InstrumentStatusId] = @StatusId
		                WHERE [InstrumentId] = @InstrumentId
	                END

	                SELECT @InstrumentId;
                ";

        return await connection.ExecuteAsync(sql, sprocParameters);

        //return await connection.QuerySingleAsync<int>(_sproc, sprocParameters, commandType: CommandType.StoredProcedure);
      }
    }
  }
}
