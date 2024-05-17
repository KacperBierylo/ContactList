﻿using Contacts.Data;
using Contacts.Dtos;
using Contacts.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetContacts()
        {
            var contacts = _context.Contacts.ToList();
            return Ok(contacts);
        }

        [HttpGet("{id}")]
        public IActionResult GetContact(int id)
        {
            var contact = _context.Contacts.Find(id);
            if (contact == null)
                return NotFound();

            return Ok(contact);
        }

        [HttpPost]
        public IActionResult CreateContact([FromBody] ContactDto contactDto)
        {
            var categoryName = _context.Categories.Where(c => c.Id == contactDto.Category)
                                         .Select(c => c.Name)
                                         .FirstOrDefault();
            if (categoryName != null)
            {
                var contact = new Contact
                {
                    FirstName = contactDto.FirstName,
                    LastName = contactDto.LastName,
                    Email = contactDto.Email,
                    Phone = contactDto.Phone,
                    BirthDate = contactDto.BirthDate,
                    Category = categoryName,
                    SubCategory = contactDto.SubCategory
                };

                _context.Contacts.Add(contact);
                _context.SaveChanges();

                return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
            }
            return NotFound();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateContact(int id, [FromBody] ContactDto contactDto)
        {

            var categoryName = _context.Categories.Where(c => c.Id == contactDto.Category)
                                         .Select(c => c.Name)
                                         .FirstOrDefault();
            var contact = _context.Contacts.Find(id);
            if (contact == null)
                return NotFound();
            if (categoryName != null)
            {
                contact.FirstName = contactDto.FirstName;
                contact.LastName = contactDto.LastName;
                contact.Email = contactDto.Email;
                contact.Phone = contactDto.Phone;
                contact.BirthDate = contactDto.BirthDate;
                contact.Category = categoryName;
                contact.SubCategory = contactDto.SubCategory;

                _context.SaveChanges();

                return NoContent();
            }
            return NotFound();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteContact(int id)
        {
            var contact = _context.Contacts.Find(id);
            if (contact == null)
                return NotFound();

            _context.Contacts.Remove(contact);
            _context.SaveChanges();

            return NoContent();
        }
    }
}