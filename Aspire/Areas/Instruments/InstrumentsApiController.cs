using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aspire.Areas.Instruments.Services.Interfaces;
using Aspire.Areas.Instruments.Data.Commands;
using Aspire.Areas.Instruments.Data.Queries;
using Aspire.Areas.Instruments.Models;
using Aspire.Areas.Instruments.Models.Enums;
using Aspire.Areas.Shared;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MimeKit;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Aspire.Areas.Instruments
{
  public class InstrumentsApiController : Controller
  {
    private const string instrumentsApiRoute = "/api/instruments";

    private readonly IInstrumentService _instrumentService;

    public InstrumentsApiController(IInstrumentService instrumentService)
    {
      _instrumentService = instrumentService;
    }

    [HttpGet]
    [Route(instrumentsApiRoute + "/constants")]
    public async Task<ActionResult> GetInstrumentListConstants()
    {
      return Ok(await _instrumentService.GetInstrumentFilterConstants());
    }

    [HttpGet]
    [Route(instrumentsApiRoute)]
    public async Task<ActionResult> GetInstruments([FromQuery] Status? status, [FromQuery] int? programId)
    {
      return Ok(await _instrumentService.GetInstruments(status, programId));
    }

    [HttpDelete]
    [Route(instrumentsApiRoute + "/{instrumentId}")]
    public async Task DeleteInstrument([FromRoute] int instrumentId)
    {
      await _instrumentService.DeleteInstrument(instrumentId);
    }

    [HttpGet]
    [Route(instrumentsApiRoute + "/form-constants")]
    public async Task<ActionResult> GetFormConstants()
    {
      return Ok(await _instrumentService.GetFormConstants());
    }

    [HttpGet]
    [Route(instrumentsApiRoute + "/model/options")]
    public async Task<ActionResult> GetModelOptions([FromQuery] int makeId)
    {
      return Ok(await _instrumentService.GetModelOptions(makeId));
    }

    [HttpGet]
    [Route(instrumentsApiRoute + "/default")]
    public ActionResult GetDefaultInstrument()
    {
      return Ok(new Instrument());
    }

    [HttpGet]
    [Route(instrumentsApiRoute + "/{instrumentId}")]
    public async Task<ActionResult> GetInstrument([FromRoute] int instrumentId)
    {
      return Ok(await _instrumentService.GetInstrument(instrumentId));
    }

    [HttpPost]
    [Route(instrumentsApiRoute)]
    public async Task CreateInstrument([FromBody] Instrument instrument)
    {
      await _instrumentService.CreateInstrument(instrument);
    }

    [HttpPut]
    [Route(instrumentsApiRoute)]
    public async Task EditInstrument([FromBody] Instrument instrument)
    {
      await _instrumentService.EditInstrument(instrument);
    }
  }
}