namespace It.gs.backend.Requirements
{
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.Extensions.Options;

    public class GsStarterHandler : AuthorizationHandler<GsStarterRequirement>
    {
        private readonly OAuthSettings _oAuthSettings;

        public GsStarterHandler(IOptions<OAuthSettings> oAuthSettings)
        {
            _oAuthSettings = oAuthSettings.Value;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, GsStarterRequirement requirement)
        {
            if (!context.User.HasClaim(c => c.Type == "iss"))
            {
                context.Fail(new AuthorizationFailureReason(this, "Bad request"));
                return Task.CompletedTask;
            }

            var subject = GsStarterRequirement.GetSubject(context.User);
            if (subject is null || string.IsNullOrEmpty(subject) || string.IsNullOrWhiteSpace(subject))
            {
                context.Fail(new AuthorizationFailureReason(this, "Bad request"));
                return Task.CompletedTask;
            }

            var audiences = context.User.FindAll(c => c.Type == "iss");
            if (audiences.Any(audience => audience.Value.Equals(_oAuthSettings.Authority, StringComparison.InvariantCulture)))
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}
