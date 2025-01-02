using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        public readonly IMapper _mapper;

        public readonly BrevoEmailService _emailService;
        public readonly IConfiguration _config;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper, BrevoEmailService emailService, IConfiguration config)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _mapper = mapper;
            _emailService = emailService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegistrationResponseDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username))
                return BadRequest("Irizina ryarafashwe");

            var user = _mapper.Map<AppUser>(registerDto);
            user.Email = registerDto.Email;
            user.UserName = registerDto.Username.ToLower();

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");
            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            var confirmToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmToken));

            var confirmationLink = $"{_config["ClientURL"]}/confirm-email?userId={user.Id}&token={encodedToken}";
            // var confirmationLink = $"{_config["ClientURL"]}/confirm-email?userId={user.Id}&token={encodedToken}";
            // e.g.  "https://localhost:4200/confirm-email?userId=25&token=abc"


            var htmlContent = $@"
                <h2>Welcome {user.UserName}!</h2>
                <p>Please confirm your email by clicking the link below:</p>
                <p><a href='{confirmationLink}'>Confirm Email</a></p>";

            await _emailService.SendEmailAsync(user.Email, "Confirm Your Email", htmlContent);

            return Ok(new RegistrationResponseDto
            {
                Message = "Registration successful. Please check your email to confirm your account."
            });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
                return BadRequest("User ID and token are required.");

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return BadRequest("Invalid User ID.");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (!result.Succeeded)
                return BadRequest("Email confirmation failed.");

            return Ok(new { message = "Email confirmed successfully!" });

            // return Ok("Email Confirmed!");

            // var frontendUrl = $"{_config["ClientURL"]}/email-confirmed";
            // return Redirect(frontendUrl);
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return BadRequest("User not found.");

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(resetToken));

            var callbackUrl = $"{_config["ClientURL"]}/reset-password?email={user.Email}&token={encodedToken}";

            var htmlContent = $@"
        <h3>Reset Your Password</h3>
        <p>Click the link below to reset your password:</p>
        <a href='{callbackUrl}'>Reset Password</a>
    ";
            await _emailService.SendEmailAsync(user.Email, "Password Reset", htmlContent);

            // return Ok("Password reset link sent. Please check your email.");
            return Ok(new { message = "Password reset link sent. Please check your email." });
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return BadRequest("Invalid user");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));

            // var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
            // if (!result.Succeeded)
            //     return BadRequest(result.Errors);
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // return Ok("Password has been reset successfully!");
            return Ok(new { message = "Password has been reset successfully!" });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == loginDto.Username);

            if (user == null)
                return Unauthorized("Invalid username.");

            var validPassword = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!validPassword)
                return Unauthorized("Invalid password.");

            var emailConfirmed = await _userManager.IsEmailConfirmedAsync(user);
            if (!emailConfirmed)
                return Unauthorized("Email not confirmed. Please check your email for verification instructions.");

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }

}