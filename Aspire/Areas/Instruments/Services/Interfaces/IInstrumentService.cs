using System.Collections.Generic;
using Aspire.Areas.Instruments.Models;
using Aspire.Areas.Instruments.Models.Enums;
using Aspire.Areas.Shared.Models;
using System.Threading.Tasks;

namespace Aspire.Areas.Instruments.Services.Interfaces
{
  public interface IInstrumentService
  {
    Task<InstrumentFilterConstants> GetInstrumentFilterConstants();

    Task<List<Instrument>> GetInstruments(Status? status, int? programId);

    Task DeleteInstrument(int instrumentId);

    Task<InstrumentConstants> GetFormConstants();

    Task<IEnumerable<SelectOption>> GetModelOptions(int makeId);

    Task CreateInstrument(Instrument instrument);

    Task EditInstrument(Instrument instrument);

    Task<Instrument> GetInstrument(int instrumentId);
    
  }
}