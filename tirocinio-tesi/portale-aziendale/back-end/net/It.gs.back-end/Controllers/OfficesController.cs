namespace It.gs.backend.Controllers
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using CSharpFunctionalExtensions;
    using It.gs.backend.Model;
    using It.gs.backend.Requirements;
    using It.gs.Repository;
    using It.gs.Repository.Model;
    using static It.gs.Repository.Utilities.Functions;

    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    [Authorize(Policy = Policies.Base)]
    public class OfficesController : ControllerBase
    {
        private readonly IRepositoryModule<OfficesData> officesDataRepo;

        public OfficesController(IRepositoryModule<OfficesData> officesDataRepo)
        {
            this.officesDataRepo = officesDataRepo;
        }

        [HttpPost("searchOfficesData")]
        [ProducesResponseType(typeof(OfficesData[]), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]     
        public async Task<IActionResult> SearchOfficesData([FromBody] DynamicQueryPart query) =>
            await GetList<OfficesData>(
                e => StatusCode(500, e),
                v => Ok(v),
                Maybe<CoreDynamicQueryPart>.From(query))();


        [HttpPost("addOfficesData")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> AddOfficesToDb([FromBody]  OfficesData[] Offices) {
            var OfficesInfo = new AddOfficesToDbExecuteInfo {Offices = Offices};
            var result = await this.officesDataRepo.Execute(OfficesInfo);
            if(result.IsSuccess)
                return Ok();
            else 
                throw result.Error.SourceException;
        }

        
        [HttpDelete("deleteOfficesData/{officesId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> DeleteOfficesData(int officesId) {
            var officesInfo = new DeleteOfficesDataExecuteInfo { Offices = new[] { new OfficesData { OfficesId = officesId } } };
            var result = await this.officesDataRepo.Execute(officesInfo);
            if (result.IsSuccess)
                return Ok();
            else 
                throw result.Error.SourceException;
        }
        
       
        
        [HttpPut("updateOfficesData")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UpdateOfficesData([FromBody]  OfficesData[] Offices) {
            var OfficesInfo = new UpdateOfficesDataExecuteInfo{Offices = Offices};
            var result = await this.officesDataRepo.Execute(OfficesInfo);
            if (result.IsSuccess)
                return Ok();
            else 
                throw result.Error.SourceException;
        }        
    }
}
