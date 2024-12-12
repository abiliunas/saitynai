using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PersonalFinanceController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DataContext _context;

        public PersonalFinanceController(UserManager<User> userManager, DataContext context)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<List<PersonalFinance>>> GetPersonalFinancesByUsername(string id)
        {
            var user = await _userManager.FindByNameAsync(id);

            if (user == null)
            {
                return NotFound($"User with username {id} not found.");
            }

            return await _context.PersonalFinances.ToListAsync();
        }

        [HttpPost("")]
        public async Task<ActionResult<PersonalFinance>> UpsertPersonalFinance(PersonalFinance request)
        {
            var existingPersonalFinance = await _context.PersonalFinances.FirstOrDefaultAsync(x => x.Id == request.Id);

            if (existingPersonalFinance == null)
            {
                request.CreatedOn = DateTime.Now;
                request.FormatedDateTimeString = request.CreatedOn.ToString("yyyy-MM-dd");
                request.EditedOn = DateTime.Now;
                await _context.PersonalFinances.AddAsync(request);
                await _context.SaveChangesAsync();

                return Ok(request);
            }
            else
            {
                existingPersonalFinance.ExpenceIncomeType = request.ExpenceIncomeType;
                existingPersonalFinance.ExpenceIncomeName = request.ExpenceIncomeName;
                existingPersonalFinance.Amount = request.Amount;
                request.EditedOn = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(existingPersonalFinance);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePersonalFinance(int id)
        {
            var order = await _context.PersonalFinances.FirstOrDefaultAsync(x => x.Id == id);

            if (order == null)
            {
                return Ok();
            }

            _context.PersonalFinances.Remove(order);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}