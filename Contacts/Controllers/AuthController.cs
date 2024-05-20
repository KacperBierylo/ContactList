using Contacts.Dtos;
using Contacts.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
namespace Contacts.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")] // żądanie HTTP POST na "api/Auth/login"
        public IActionResult Login([FromBody] UserDto userDto)
        {
            var token = _authService.Authenticate(userDto.Username, userDto.Password);

            if (token == null)
                return Unauthorized(); // zwraca informację o nieudanym uwierzytelnieniu

            return Ok(new { Token = token }); // zwraca token, jeśli uwierzytelnianie powiedzie się
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserDto userDto)
        {
            if (!ValidatePassword(userDto.Password))    // jeśli hasło ma niewystarczającą złożoność
                return BadRequest("Password must contain at least one upper case English letter, at least one lower case English letter, at least one digit, at least one special character, be minimum eight in length");
            var user = _authService.Register(userDto.Username, userDto.Password);

            if (user == null)   // jeśli nie udało się przeprowadzić rejestracji
                return BadRequest("User already exists");

            return Ok();

        }
        private bool ValidatePassword(string password)
        {
            var regex = new Regex(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
            if (!regex.IsMatch(password))
                return false;
            return true;
        }
    }
}
