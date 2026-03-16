using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserManagementAPI.Data;
using UserManagementAPI.DTOs;
using UserManagementAPI.Models;

namespace UserManagementAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // REGISTER
        [HttpPost("register")]
public IActionResult Register(RegisterDto dto)
{
    if (_context.Users.Any(x => x.Email == dto.Email))
        return BadRequest("Email already exists");

    var user = new User
    {
        Name = dto.Name,
        Email = dto.Email,
        Role = dto.Role,
        PhoneNumber = dto.PhoneNumber,
        Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        Status = true
    };

    _context.Users.Add(user);
    _context.SaveChanges();

    return Ok("User Registered Successfully");
}

        // LOGIN
        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var user = _context.Users.FirstOrDefault(x => x.Email == dto.Email);

            if (user == null)
                return Unauthorized("Invalid Email");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized("Invalid Password");

            var token = GenerateToken(user);

            return Ok(new { token });
        }

        // CHANGE PASSWORD
        [HttpPost("change-password")]
        public IActionResult ChangePassword(ChangePasswordDto dto)
        {
            var user = _context.Users.FirstOrDefault(x => x.Email == dto.Email);

            if (user == null)
                return NotFound("User not found");

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.Password))
                return BadRequest("Old password incorrect");

            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            _context.SaveChanges();

            return Ok("Password changed successfully");
        }

        // FORGOT PASSWORD
        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword(ForgotPasswordDto dto)
        {
            var user = _context.Users.FirstOrDefault(x => x.Email == dto.Email);

            if (user == null)
                return NotFound("User not found");

            return Ok("Reset password request accepted");
        }

        // RESET PASSWORD
        [HttpPost("reset-password")]
        public IActionResult ResetPassword(ResetPasswordDto dto)
        {
            var user = _context.Users.FirstOrDefault(x => x.Email == dto.Email);

            if (user == null)
                return NotFound("User not found");

            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            _context.SaveChanges();

            return Ok("Password reset successful");
        }

        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

            var creds =
                new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.Role,user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}