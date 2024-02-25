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
    public class BookingCoursesController : ControllerBase
    {
        private readonly IRepositoryModule<BookingCoursesData> noticeDataRepo;

        public BookingCoursesController(IRepositoryModule<BookingCoursesData> noticeDataRepo)
        {
            this.noticeDataRepo = noticeDataRepo;
        }

        [HttpPost("searchBookingCoursesData")]
        [ProducesResponseType(typeof(BookingCoursesData[]), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]     
        public async Task<IActionResult> SearchBookingCoursesData([FromBody] DynamicQueryPart query) =>
            await GetList<BookingCoursesData>(
                e => StatusCode(500, e),
                v => Ok(v),
                Maybe<CoreDynamicQueryPart>.From(query))();
    }
}
