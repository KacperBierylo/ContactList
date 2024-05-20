using Contacts.Data;
using Contacts.Dtos;
using Contacts.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Contacts.Services;
namespace Contacts.Controllers
{    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoriesService _CategoriesService;


        public CategoriesController(ICategoriesService CategoriesService)
        {
            _CategoriesService = CategoriesService;
        }

        [HttpGet]// żądanie HTTP GET na "api/Categories, zwraca kategorie i ich podkategorie"
        public IActionResult GetCategoriesWithSubCategories()
        {
            var categoriesWithSubCategories =  _CategoriesService.GetCategoriesWithSubCategories();
            return Ok(categoriesWithSubCategories);
        }

        [HttpGet("{id}")]// żądanie HTTP GET na "api/Categories/{id}, zwraca informacje o wybranej kategorii, w tym jej podkategorie
        public IActionResult GetCategoryWithSubCategories(int id)
        {
            var category = _CategoriesService.GetCategoryWithSubCategories(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

    }
}
