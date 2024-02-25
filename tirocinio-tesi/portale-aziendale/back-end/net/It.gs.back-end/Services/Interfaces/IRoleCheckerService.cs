using System.Security.Claims;
using CSharpFunctionalExtensions;

namespace It.gs.backend.Services.Interfaces
{
    public interface IRoleCheckerService 
    {
        public Task<IEnumerable<string>> GetRoles(IEnumerable<Claim> claims);
        public Task<bool> HasAtLeastOneRole(IEnumerable<Claim> claims, Maybe<IEnumerable<string>> roles);
        public Task<string> GetUserId(IEnumerable<Claim> claims);
    }
}