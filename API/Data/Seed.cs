// using System.Security.Cryptography;
// using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        // public static async Task SeedUsers(DataContext context)
        // {
        //     if (await context.Users.AnyAsync()) return;
        public static async Task SeedUsers(UserManager<AppUser> userManager,
             RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            // var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            // var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            // var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

            // foreach (var user in users)
            var roles = new List<AppRole>
            {
                // using var hmac = new HMACSHA256();
                                new AppRole{Name = "Member"},
                 new AppRole{Name = "Admin"},
                 new AppRole{Name = "Moderator"},
             };

            // user.UserName = user.UserName.ToLower();
            // user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
            // user.PasswordSalt = hmac.Key;

            //     context.Users.Add(user);
            // }

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });

            // await context.SaveChangesAsync();
        }
    }
}