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
    public class NoticeController : ControllerBase
    {
        private readonly IRepositoryModule<NoticeData> noticeDataRepo;

        public NoticeController(IRepositoryModule<NoticeData> noticeDataRepo)
        {
            this.noticeDataRepo = noticeDataRepo;
        }

        [HttpPost("searchNoticeData")]
        [ProducesResponseType(typeof(NoticeData[]), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]     
        public async Task<IActionResult> SearchNoticeData([FromBody] DynamicQueryPart query) =>
            await GetList<NoticeData>(
                e => StatusCode(500, e),
                v => Ok(v),
                Maybe<CoreDynamicQueryPart>.From(query))();


        [HttpPost("sendNoticeData")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> SendNoticeToUsers([FromBody]  NoticeData[] notices) {
            var noticesInfo = new SendNoticeToUsersExecuteInfo {Notices = notices};
            var result = await this.noticeDataRepo.Execute(noticesInfo);
            if(result.IsSuccess)
                return Ok();
            else 
                throw result.Error.SourceException;
        }


        [HttpDelete("deleteNoticeData/{noticeId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> DeleteNoticeData(int noticeId) {
            var noticesInfo = new DeleteNoticeDataExecuteInfo { Notices = new[] { new NoticeData { NoticeId = noticeId } } };
            var result = await this.noticeDataRepo.Execute(noticesInfo);
            if (result.IsSuccess)
                return Ok();
            else 
                throw result.Error.SourceException;
        }

       

        [HttpPut("updateNoticeData")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UpdateNoticeData([FromBody]  NoticeData[] notices) {
            var noticesInfo = new UpdateNoticeDataExecuteInfo{Notices = notices};
            var result = await this.noticeDataRepo.Execute(noticesInfo);
            if (result.IsSuccess)
                return Ok();
            else 
                throw result.Error.SourceException;
        }
    }
}
