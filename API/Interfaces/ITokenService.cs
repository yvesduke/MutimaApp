using API.Entities;

namespace API.Interfaces
{
    public interface ITokenService
    {
        // string CreateToken(AppUser user);
        Task<string> CreateToken(AppUser user);
    }
}