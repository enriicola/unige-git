using System.Security.Claims;
using CSharpFunctionalExtensions;
using It.gs.backend.Services.Interfaces;

namespace It.gs.backend.Services.Implementations
{
    public class KeyCloakRoleCheckerService : IRoleCheckerService
    {
        private readonly ILogger<KeyCloakRoleCheckerService> logger;

        public KeyCloakRoleCheckerService(ILogger<KeyCloakRoleCheckerService> logger) 
        {
            this.logger = logger;
        }

        public Task<IEnumerable<string>> GetRoles(IEnumerable<Claim> claims)
        {
            if (claims is null)
            {
                this.logger.LogWarning($"User claims not found");
                throw new UnauthorizedAccessException();
            }

            var userRoles = claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value);
            
            return Task.FromResult(userRoles);
        }

        public Task<string> GetUserId(IEnumerable<Claim> claims)
        {
            var userIdClaim = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if(string.IsNullOrEmpty(userIdClaim?.Value) || string.IsNullOrWhiteSpace(userIdClaim?.Value)) {
                this.logger.LogWarning($"UserId Claim {ClaimTypes.NameIdentifier} not found");
                throw new UnauthorizedAccessException();
            }
            return Task.FromResult(userIdClaim?.Value);
        }

        public async Task<bool> HasAtLeastOneRole(IEnumerable<Claim> claims, Maybe<IEnumerable<string>> roles)
        {
            if (claims is null)
            {
                this.logger.LogWarning($"User claims not found");
                throw new UnauthorizedAccessException();
            }

            if (roles.HasNoValue || !roles.Value.Any()) 
                return true;
            var userRoles = await GetRoles(claims);

            return roles.Value.Any(role => userRoles.Contains(role));
        }

        
    }
}