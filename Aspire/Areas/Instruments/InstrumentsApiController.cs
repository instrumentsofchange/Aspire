using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aspire.Areas.Instruments.Data.Commands;
using Aspire.Areas.Instruments.Data.Queries;
using Aspire.Areas.Instruments.Models;
using Aspire.Areas.Shared;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Aspire.Areas.Instruments
{
    public class InstrumentsApiController : Controller
    {
        private readonly IMediator _mediator;

        public InstrumentsApiController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("/api/instruments/GetInitialInstrumentFormOptions")]
        public async Task<ActionResult> GetInitialInstrumentFormOptions()
        {
            return Ok(await _mediator.Send(new GetCreateInstrumentInitialFormOptions()));
        }

        [HttpGet]
        [Route("/api/instruments/getModelOptions/{make}")]
        public async Task<ActionResult> GetModelOptionsByMake(string make)
        {
            return Ok(Model.GetModelOptions(await _mediator.Send(new GetModelsByMake(make))));
        }

        [HttpGet]
        [Route("/api/instruments/getMakeOptions")]
        public async Task<ActionResult> GetMakeOptions()
        {
            var makes = await _mediator.Send(new GetMakes());

            var makeOptions = new List<SelectListItem>(makes.Count() + 1);
            makeOptions.Add(SelectListHelpers.GetDefaultItem());
            foreach(var make in makes)
            {
                makeOptions.Add(new SelectListItem(make, make));
            }

            return Ok(makeOptions);
        }

        [HttpGet]
        [Route("/api/instruments/getStudentOptions/{program}")]
        public async Task<ActionResult> GetStudentOptionsByProgram(string program)
        {
            var options = new List<SelectListItem>
            {
                new SelectListItem("Select One...", "Select One...", true, true),
                new SelectListItem("Kyle Aebischer", "Kyle Aebischer"),
                new SelectListItem("Trey Gonzalez", "Trey Gonzalez")
            };

            return Ok(options); 
        }

        [HttpGet]
        [Route("/api/instruments/search")]
        public async Task<ActionResult> SearchInstruments(string serialNumber, string make)
        {
            return Ok(await _mediator.Send(new SearchInstruments(serialNumber, make)));
        }

        [HttpGet]
        [Route("/api/instruments/{id}")]
        public async Task<ActionResult> GetInstrument(int id)
        {
            var instrument = await _mediator.Send(new GetInstrumentById(id));
            var initialFormOptions = await _mediator.Send(new GetCreateInstrumentInitialFormOptions());
            var modelOptions = Model.GetModelOptions(await _mediator.Send(new GetModelsByMake(instrument.Make)));
            //var students = await _mediator.Send(new GetStude)


            return Ok(new
            {
                Instrument = instrument,
                initialFormOptions.InstrumentTypeOptions,
                initialFormOptions.MakeOptions,
                ModelOptions = modelOptions,
                initialFormOptions.ProgramOptions
                //students
            });
        }

        [HttpPost]
        [Route("/api/instruments")]
        public async Task<ActionResult> SaveInstrument([FromBody]Instrument instrument)
        {
            return Ok(await _mediator.Send(new SaveInstrument(instrument)));
        }
    }
}
