﻿using Application.Users.Commands.RegisterUser;
using Application.Users.Queries.LoginUser;
using Application.Common.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Users.Commands.DeleteUser;

namespace Web.Controllers
{
    [Authorize]
    public class UsersController : ApiControllerBase
    {
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<int>> Register(RegisterUserCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResult>> Login(LoginUserQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            await Mediator.Send(new DeleteUserCommand { UserId = id });
            return NoContent();
        }

        // Other methods...
    }
}