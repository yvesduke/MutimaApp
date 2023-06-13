using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        // public readonly DataContext _context;
        // public UsersController(DataContext context)
        // {
        // _context = context;
        // }
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _userRepository = userRepository;
        }

        // [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            // var users = await _context.Users.ToListAsync();
            // return Ok(await _userRepository.GetUsersAsync());

            // return users;
            // var users = await _userRepository.GetUsersAsync();
            // var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            // return Ok(usersToReturn);

            var users = await _userRepository.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            // var user = await _context.Users.FindAsync(id);
            // return user;

            // return await _userRepository.GetUserByUsernameAsync(username);

            // var user = await _userRepository.GetUserByUsernameAsync(username);
            // return _mapper.Map<MemberDto>(user);

            return await _userRepository.GetMemberAsync(username);

        }
    }
}