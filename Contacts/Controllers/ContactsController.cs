using Contacts.Data;
using Contacts.Dtos;
using Contacts.Models;
using Contacts.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;

namespace Contacts.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContactsController : ControllerBase
    {
        private readonly IContactsService _ContactsService;

        public ContactsController(IContactsService contactsService)
        {
            _ContactsService = contactsService;
        }

        [AllowAnonymous]
        [HttpGet]// żądanie HTTP GET na "api/Contacts, zwraca listę kontaktów"
        public IActionResult GetContacts()
        {
            var contacts = _ContactsService.GetContacts();
            return Ok(contacts);
        }

        [HttpGet("{id}")]// żądanie HTTP GET na "api/Contacts/{id}, zwraca infomację o wybranym kontakcie"
        public IActionResult GetContact(int id)
        {
            var contact = _ContactsService.GetContact(id);
            if (contact == null)
                return NotFound();

            return Ok(contact);
        }

        [HttpPost]
        public IActionResult CreateContact([FromBody] ContactDto contactDto)
        {
            if (contactDto.HasEmptyOrNullFields())
                return BadRequest("Not all fields are filled");

            if (!ValidateEmail(contactDto.Email))
            {
                return BadRequest("Incorrect email");
            }
            if (!ValidatePhoneNumber(contactDto.Phone))
            {
                return BadRequest("Incorrect phone number");
            }
            var contact = _ContactsService.CreateContact(contactDto);

            if (contact == null)
            {
                return BadRequest("Unknown category");
            }
            return Ok(contact);
            
        }

        [HttpPut("{id}")]
        public IActionResult UpdateContact(int id, [FromBody] ContactDto contactDto)
        {
            if (contactDto.HasEmptyOrNullFields())
                return BadRequest("Not all fields are filled");

            if (!ValidateEmail(contactDto.Email))
            {
                return BadRequest("Incorrect email");
            }
            if (!ValidatePhoneNumber(contactDto.Phone))
            {
                return BadRequest("Incorrect phone number");
            }
            var contact = _ContactsService.UpdateContact(id, contactDto);
            if(contact == null)
                 return NotFound();
            return Ok(contact);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteContact(int id)
        {
            var contact = _ContactsService.DeleteContact(id);
            if (contact == null)
                return NotFound();
            return Ok(contact);
        }
        private bool ValidateEmail(string password)
        {
            var regex = new Regex(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
            if (!regex.IsMatch(password))
                return false;
            return true;
        }

        private bool ValidatePhoneNumber(string phoneNumber) {

            var regex = new Regex(@"\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{3})");
            if(!regex.IsMatch(phoneNumber))
                return false;
            return true;
        }
    }
}
