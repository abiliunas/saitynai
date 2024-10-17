using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DataContext _context;

        public UserController(UserManager<User> userManager, DataContext context)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password)) {
                return Unauthorized();
            }
               
            var roles = await _userManager.GetRolesAsync(user);
            
            return new UserDTO() {
                UserId = user.Id,
                Username = user.UserName,
                UserRoles = roles.ToList(),
            };
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<UserDTO>>> GetUsers()
        {
            var usersWithRoles = new List<UserDTO>();

            foreach (var user in _userManager.Users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userDto = new UserDTO
                {
                    UserId = user.Id,
                    Username = user.UserName,
                    UserRoles = roles.ToList(),
                };

                usersWithRoles.Add(userDto);
            }

            return Ok(usersWithRoles);
        }

        [HttpGet("currentUser")]
        public async Task<ActionResult<List<UserDTO>>> GetCurrentUser([FromQuery] string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if(user != null) {
                var roles = await _userManager.GetRolesAsync(user);

                return Ok(new UserDTO(){
                    UserId = user.Id,
                    Username = user.UserName,
                    UserRoles = roles.ToList(),
                });
            }

            return BadRequest(null);
        }

        [HttpPut("update")]
        public async Task<ActionResult<UserDTO>> UpdateUser([FromBody] UserDTO userUpdate)
        {
            var user = await _userManager.FindByIdAsync(userUpdate.UserId);

            if (user == null)
            {
                return NotFound($"User with ID {userUpdate.Username} not found");
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            var rolesToRemove = currentRoles.Except(userUpdate.UserRoles);
            var rolesToAdd = userUpdate.UserRoles.Except(currentRoles);

            await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
            await _userManager.AddToRolesAsync(user, rolesToAdd);

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(userUpdate);
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> RegisterUser(RegisterDTO registerDto)
        {
            var user = new User { UserName = registerDto.Username, Email = registerDto.Email };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            await _context.SaveChangesAsync();

            return new UserDTO() {
                UserId = user.Id,
                Username = user.UserName,
                UserRoles = new List<string>() {"Member"},
            };
        }
    }
}