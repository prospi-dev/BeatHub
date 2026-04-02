using BeatHub.Data;
using BeatHub.DTOs;
using BeatHub.DTOs.Auth;
using BeatHub.Models;
using BeatHub.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace BeatHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtService _jwt;

        public AuthController(AppDbContext db, JwtService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
                return Conflict("Username already in use");
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return Conflict("Email already in use.");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                AvatarUrl = $"https://api.dicebear.com/7.x/bottts/svg?seed={dto.Username}"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);

            return Ok(new AuthResponseDTO
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password.");

            var token = _jwt.GenerateToken(user);

            return Ok(new AuthResponseDTO
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl
            });
        }
    }
}