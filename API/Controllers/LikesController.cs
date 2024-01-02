using API.Controllers;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API;

[Authorize]
public class LikesController : BaseApiController
{
    // private readonly IUserRepository _userRepository;
    // private readonly ILikesRepository _likesRepository;
    private readonly IUnitOfWork _uow;
    // public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
    public LikesController(IUnitOfWork uow)
    {
        // _likesRepository = likesRepository;
        // _userRepository = userRepository;
        _uow = uow;
    }

    [HttpPost("{username}")]
    public async Task<ActionResult> AddLike(string username)
    {
        var sourceUserId = User.GetUserId();
        // var likedUser = await _userRepository.GetUserByUsernameAsync(username);
        // var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

        var likedUser = await _uow.UserRepository.GetUserByUsernameAsync(username);
        var sourceUser = await _uow.LikesRepository.GetUserWithLikes(sourceUserId);

        if (likedUser == null) return NotFound();

        if (sourceUser.UserName == username) return BadRequest("You cannot like yourself");

        // var userLike = await _likesRepository.GetUserLike(sourceUserId, likedUser.Id);
        var userLike = await _uow.LikesRepository.GetUserLike(sourceUserId, likedUser.Id);

        if (userLike != null) return BadRequest("You already like this user");

        userLike = new UserLike
        {
            SourceUserId = sourceUserId,
            TargetUserId = likedUser.Id
        };

        sourceUser.LikedUsers.Add(userLike);

        // if (await _userRepository.SaveAllAsync()) return Ok();
        if (await _uow.Complete()) return Ok();

        return BadRequest("Failed to like user");
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery] LikesParams likesParams)
    {
        likesParams.UserId = User.GetUserId();

        // var users = await _likesRepository.GetUserLikes(likesParams);
        var users = await _uow.LikesRepository.GetUserLikes(likesParams);

        Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize,
            users.TotalCount, users.TotalPages));

        return Ok(users);
    }
}