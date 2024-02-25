namespace It.gs.backend.Requirements
{
    using System.Security.Claims;
    using Microsoft.AspNetCore.Authorization;

    public class GsStarterRequirement : IAuthorizationRequirement
    {
        public GsStarterRequirement()
        {

        }

        public static string GetSubject(ClaimsPrincipal user) => user.Claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier, StringComparison.InvariantCultureIgnoreCase))?.Value;
    }
}
