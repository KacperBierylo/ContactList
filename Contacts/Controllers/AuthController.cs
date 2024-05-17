using Contacts.Dtos;
using Contacts.Services;
using Microsoft.AspNetCore.Mvc;
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

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserDto userDto)
        {
            var token = _authService.Authenticate(userDto.Username, userDto.Password);

            if (token == null)
                return Unauthorized();

            return Ok(new { Token = token });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserDto userDto)
        {
            var user = _authService.Register(userDto.Username, userDto.Password);

            if (user == null)
                return BadRequest("User already exists");

            return Ok();
        }
    }
}
