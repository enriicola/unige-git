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
    public class CoursesController : ControllerBase
    {
        private readonly IRepositoryModule<CoursesData> coursesDataRepo;

        public CoursesController(IRepositoryModule<CoursesData> CoursesDataRepo)
        {
            this.coursesDataRepo = CoursesDataRepo;
        }

        [HttpPost("searchCoursesData")]
        [ProducesResponseType(typeof(CoursesData[]), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]     
        public async Task<IActionResult> SearchCoursesData([FromBody] DynamicQueryPart query) =>
            await GetList<CoursesData>(
                e => StatusCode(500, e),
                v => Ok(v),
                Maybe<CoreDynamicQueryPart>.From(query))();


        [HttpPost("addCoursesData")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> AddCoursesToDb([FromBody] CoursesData[] Courses) {
            var CoursesInfo = new AddCoursesToDbExecuteInfo {Courses = Courses};
            var result = await this.coursesDataRepo.Execute(CoursesInfo);
            if(result.IsSuccess)
                return Ok();
            else 
                throw result.Error.SourceException;
        }

        
        [HttpDelete("deleteCoursesData/{CoursesId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> DeleteCoursesData(int CoursesId) {
            var CoursesInfo = new DeleteCoursesDataExecuteInfo { Courses = new[] { new CoursesData { CoursesId = CoursesId } } };
            var result = await this.coursesDataRepo.Execute(CoursesInfo);
            if (result.IsSuccess)
                return Ok();
            else 
                throw result.Error.SourceException;
        }
        
       
        
        [HttpPut("updateCoursesData")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UpdateCoursesData([FromBody]  CoursesData[] Courses) {
            var CoursesInfo = new UpdateCoursesDataExecuteInfo{Courses = Courses};
            var result = await this.coursesDataRepo.Execute(CoursesInfo);
            if (result.IsSuccess)
                return Ok();
            else 
                throw result.Error.SourceException;
        }        
    }
}
