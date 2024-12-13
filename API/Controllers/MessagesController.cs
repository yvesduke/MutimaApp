using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MessagesController : BaseApiController
{
    // private readonly IUserRepository _userRepository;
    // private readonly IMessageRepository _messageRepository;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    // public MessagesController(IUserRepository userRepository,
    //     IMessageRepository messageRepository, IMapper mapper)
    public MessagesController(IUnitOfWork uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
        // _messageRepository = messageRepository;
        // _userRepository = userRepository;
    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var username = User.GetUsername();

        if (username == createMessageDto.RecipientUsername.ToLower())
            return BadRequest("Ntushobora kwiyoherereza ubutumwa");

        // var sender = await _userRepository.GetUserByUsernameAsync(username);
        // var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

        var sender = await _uow.UserRepository.GetUserByUsernameAsync(username);
        var recipient = await _uow.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

        if (recipient == null) return NotFound();

        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content
        };

        // _messageRepository.AddMessage(message);
        _uow.MessageRepository.AddMessage(message);

        // if (await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));
        if (await _uow.Complete()) return Ok(_mapper.Map<MessageDto>(message));

        return BadRequest("Ntushoboye kohereza ubutumwa");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery]
        MessageParams messageParams)
    {
        messageParams.Username = User.GetUsername();

        // var messages = await _messageRepository.GetMessagesForUser(messageParams);

        var messages = await _uow.MessageRepository.GetMessagesForUser(messageParams);

        Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage,
            messages.PageSize, messages.TotalCount, messages.TotalPages));

        return messages;
    }

    // [HttpGet("thread/{username}")]
    // public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
    // {
    //     var currentUsername = User.GetUsername();

    //     return Ok(await _messageRepository.GetMessageThread(currentUsername, username));
    // }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(int id)
    {
        var username = User.GetUsername();

        // var message = await _messageRepository.GetMessage(id);
        var message = await _uow.MessageRepository.GetMessage(id);

        if (message.SenderUsername != username && message.RecipientUsername != username)
            return Unauthorized();

        if (message.SenderUsername == username) message.SenderDeleted = true;

        if (message.RecipientUsername == username) message.RecipientDeleted = true;

        if (message.SenderDeleted && message.RecipientDeleted)
        {
            // _messageRepository.DeleteMessage(message);
            _uow.MessageRepository.DeleteMessage(message);
        }

        // if (await _messageRepository.SaveAllAsync()) return Ok();
        if (await _uow.Complete()) return Ok();

        return BadRequest("Ntushoboye gusiba ubutumwa");
    }
}